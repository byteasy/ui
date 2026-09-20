import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import { doHttpGet } from '@/api/common/platform';
import { getComponent } from '@/util/componentLoader.ts';
import { defineComponent, h } from 'vue';

const routers = [
  {
    path: '/pub/index',
    name: 'pubComponent',
    component: wrapDynamicComponent('/views/layout/RouteLayoutAutoRender.vue', 'pubComponent'),
  },
]

const router = createRouter({
  history: createWebHashHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? '/' : '/'),
  routes: routers,
});

let isMicroAppRouterLoad = false;
let activeMicroAppRouter = 'noActive';
const WHITE_LIST_ROUTES = ['pubComponent'];

router.beforeEach(async (to, from, next) => {
  // 脱离框架的公开访问页面
  if(to.fullPath.startsWith('/pub')) {
    next();
    return;
  }

  const paths = to.fullPath.split('/');
  const nowActiveAppRouter = '/' + (paths[1] || '') + '/' + (paths[2] || '');

  // 1. 切换微应用模块时，正确清理已注册的动态路由
  if (!to.fullPath.startsWith(activeMicroAppRouter)) {
    isMicroAppRouterLoad = false;
    activeMicroAppRouter = nowActiveAppRouter;

    // 🔥 修复点 1：Vue Router 正规清理路由方式
    router.getRoutes().forEach((route) => {
      if (route.name && !WHITE_LIST_ROUTES.includes(route.name as string)) {
        router.removeRoute(route.name);
      }
    });
  }

  // 2. 动态加载当前微应用侧边栏路由
  if (!isMicroAppRouterLoad) {
    try {
      const response = await doHttpGet('/platformSvr/sapi/resources/leftMenu', { fullPath: to.fullPath });
      const menuList = response?.data || [];

      menuList.forEach((item) => {
        try {
          const dynamicRoute: RouteRecordRaw = {};
          rebuildLeftMenus(dynamicRoute, item);
          if (dynamicRoute.path) {
            router.addRoute(dynamicRoute);
          }
        } catch (err) {
          console.error('micro app add router err', err, item);
        }
      });

      isMicroAppRouterLoad = true;
      // 携带 replace 参数重新进入路由解析，保证刚刚 addRoute 的路由生效
      next({ ...to, replace: true });
      return;
    } catch (error) {
      console.error('加载微应用路由失败:', error);
      next();
      return;
    }
  }

  next();
});

/**
 * 构建路由树
 */
function rebuildLeftMenus(node, menu) {
  const Layout = getComponent(menu.layout || '/views/layout/AsideMain.vue');

  // 情况 A：处理独立的一级菜单（自身是 MENU，没有父节点）
  if (menu.type === 'MENU' && (!menu.parentId || menu.parentId === '0')) {
    const rawUrl = filteredQueryParameter(menu.routerUrl || '');
    const idx = rawUrl.lastIndexOf('/');

    const parentPath = idx > 0 ? rawUrl.substring(0, idx) : rawUrl;
    // 🔥 修复点 2：子路由 path 不能以 "/" 开头，必须为相对路径！
    const subPath = idx >= 0 ? rawUrl.substring(idx + 1) : '';

    node.path = parentPath;
    node.name = menu.code + 'Parent';
    node.component = Layout;
    node.children = [
      {
        path: subPath, // 正确的相对路径（如 "4FscHb4pi"）
        name: menu.code,
        // 🔥 修复点 3：统一读取 menu.name 作为标题
        meta: {
          title: menu.name,
          noCache: menu.keepAlive === 'NO',
          affix: menu.affix === 'YES',
          query: parseQueryParameter(menu.routerUrl),
        },
        component: wrapDynamicComponent(menu.component, menu.code),
      },
    ];
    return;
  }

  // 情况 B：处理目录结构（包含多级子菜单）
  if (hasChildrenMenu(menu)) {
    node.path = filteredQueryParameter(menu.routerUrl || '');
    node.name = menu.code;
    node.component = Layout;
    node.redirect = menu.redirectUrl;
    node.meta = { title: menu.name };
    node.children = [];

    // 🔥 修复点 4：通用递归打平收集所有叶子菜单，支持任意层级目录嵌套
    collectLeafMenus(menu.childrenList, '', node.children);
  }
}

/**
 * 递归收集所有叶子菜单（MENU）并拼接相对路由路径
 */
function collectLeafMenus(childrenList, parentPrefix, targetChildren) {
  if (!Array.isArray(childrenList) || childrenList.length === 0) return;

  childrenList.forEach((child) => {
    // 移除前置斜杠，确保拼接出来的路径符合 Vue Router 规范
    const currentPath = filteredQueryParameter(child.routerUrl || '').replace(/^\//, '');
    const combinedPath = parentPrefix ? `${parentPrefix}/${currentPath}` : currentPath;

    if (child.type === 'MENU') {
      targetChildren.push({
        path: combinedPath,
        name: child.code,
        meta: {
          title: child.name,
          affix: child.affix === 'YES',
          noCache: child.keepAlive === 'NO',
          query: parseQueryParameter(child.routerUrl),
        },
        component: wrapDynamicComponent(child.component, child.code),
      });
    } else if (child.type === 'DIRECTORY' && child.childrenList && child.childrenList.length > 0) {
      // 遇到中间目录继续递归向下收集，累加路径前缀
      collectLeafMenus(child.childrenList, combinedPath, targetChildren);
    }
  });
}

function filteredQueryParameter(value) {
  if (!value) return '';
  return value.includes('?') ? value.split('?')[0] : value;
}

function parseQueryParameter(value) {
  if (!value) return undefined;
  const index = value.indexOf('?');
  return index >= 0 ? value.substring(index + 1) : undefined;
}

function hasChildrenMenu(menu) {
  if (menu && Array.isArray(menu.childrenList) && menu.childrenList.length > 0) {
    return menu.childrenList.some((child) => child.type === 'MENU' || hasChildrenMenu(child));
  }
  return false;
}

function getModule(name) {
  const component = getComponent(name);
  if (!component) {
    return getComponent('/views/common/Error404.vue');
  }
  return component;
}

// 🔥 2. 核心包装函数：根据菜单唯一的 code，动态为通用模板组件赋予唯一的 name
function wrapDynamicComponent(componentPath, uniqueName) {
  const RawComponent = getModule(componentPath);
  if (!RawComponent) return RawComponent;

  // 包装一层高阶组件，让它的 name 严格等于 route.name (即 menu.code)
  return defineComponent({
    name: uniqueName, // 🔥 核心：在这里把组件名重写为菜单唯一的 code！
    render() {
      return h(RawComponent);
    },
  });
}

export default router;
