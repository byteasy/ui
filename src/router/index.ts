import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import { doHttpGet } from '@/api/common/platform';
import XEUtils from 'xe-utils';
import { getComponent } from '@/util/componentLoader.ts';

const router = createRouter({
  history: createWebHashHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? '/' : '/'),
  routes: [],
});

/**
 * 基座只有静态路由，并动态加载微应用的路由入口
 */
let isMicroAppRouterLoad = false;
let activeMicroAppRouter = 'noActive';

router.beforeEach(async (to, from, next) => {
  const paths = to.fullPath.split('/');
  const nowActiveAppRouter = '/' + paths[1] + '/' + paths[2];
  console.log('active router', nowActiveAppRouter);
  if (!to.fullPath.startsWith(activeMicroAppRouter)) {
    isMicroAppRouterLoad = false;
    activeMicroAppRouter = nowActiveAppRouter;
    router.clearRoutes();
  }
  if (!isMicroAppRouterLoad) {
    console.log('micro app router not init. try to init', to.fullPath);
    await doHttpGet('/platformSvr/sapi/resources/leftMenu', { fullPath: to.fullPath }).then(
      (response) => {
        response.data.forEach((item) => {
          try {
            const dynamicRoute: RouteRecordRaw = {};
            rebuildLeftMenus(dynamicRoute, item);
            console.log('micro app add dynamicRoute', dynamicRoute, item);
            router.addRoute(dynamicRoute);
            console.log('micro app routes length:', router.getRoutes().length);
          } catch (err) {
            console.log('micro app add router err', err);
          }
        });
      },
    );
    console.log('micro app router init finished', router.getRoutes().length, router.getRoutes());
    isMicroAppRouterLoad = true;
    next({ ...to, replace: true });
    return;
  }
  console.log('micro app goto', to.fullPath);
  next();
});

function rebuildLeftMenus(node, menu) {
  console.log('menu', menu);
  const AsideMain = getComponent('/views/layout/AsideMain.vue');
  // 支持一级菜单
  if (menu.type === 'MENU' && (menu.parentId === null || menu.parentId === undefined)) {
    const idx = (menu.routerUrl || '').lastIndexOf('/');
    node.path = filteredQueryParameter(menu.routerUrl.substring(0, idx));
    node.name = menu.code + 'Parent';
    node.component = AsideMain;
    node.children = [
      {
        path: filteredQueryParameter(menu.routerUrl.substring(idx)),
        name: menu.code,
        meta: { title: menu.title, noCache: menu.keepAlive === 'NO' },
        component: getModule(menu.component),
      },
    ];
  }
  if (hasChildrenMenu(menu)) {
    node.path = filteredQueryParameter(menu.routerUrl);
    node.name = menu.code;
    node.component = AsideMain;
    node.redirect = menu.redirectUrl;
    node.children = [];
    node.meta = { title: menu.name };
    menu.childrenList.forEach((child) => {
      if (hasChildrenMenu(child)) {
        child.childrenList.forEach((subChild) => {
          if (subChild.type === 'MENU') {
            node.children.push({
              path: filteredQueryParameter(child.routerUrl) + '/' + filteredQueryParameter(subChild.routerUrl),
              name: subChild.code,
              meta: {
                title: subChild.name,
                affix: subChild.affix === 'YES',
                noCache: subChild.keepAlive === 'NO',
                query: parseQueryParameter(subChild.routerUrl),
              },
              component: getModule(subChild.component),
            });
          }
        });
      } else {
        node.children.push({
          path: filteredQueryParameter(child.routerUrl),
          name: child.code,
          meta: {
            title: child.name,
            affix: child.affix === 'YES',
            noCache: child.keepAlive === 'NO',
            query: parseQueryParameter(child.routerUrl),
          },
          component: getModule(child.component),
        });
      }
    });
  }
}

function filteredQueryParameter(value) {
  if (value.indexOf('?') >= 0) {
    return value.split('?')[0];
  } else {
    return value;
  }
}

function parseQueryParameter(value) {
  const index = value.indexOf('?');
  if (index >= 0) {
    return value.substring(index + 1);
  } else {
    return undefined;
  }
}

function hasChildrenMenu(menu) {
  if (
    XEUtils.hasOwnProp(menu, 'childrenList') &&
    menu.childrenList !== null &&
    menu.childrenList.length > 0
  ) {
    const len = menu.childrenList.length;
    for (let i = 0; i < len; i++) {
      const child = menu.childrenList[i];
      if (child.type === 'MENU') {
        return true;
      }
      const childHasChildren = hasChildrenMenu(child);
      if (childHasChildren === true) {
        return true;
      }
    }
  }
  return false;
}

function getModule(name) {
  const component = getComponent(name);
  if (component === undefined) {
    return getComponent('/views/common/Error404.vue');
  }
  return component;
}

export default router;
