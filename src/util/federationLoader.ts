// src/util/federationLoader.ts
import { defineAsyncComponent, type Component, h } from 'vue'

// 缓存已解析的组件 Promise，防止同页面多次渲染时重复发起网络解析
const componentCache = new Map<string, any>()

/**
 * 判断是否为模块联邦路径
 * 规则：包含 '/' 且不以绝对路径 '/'、'./' 或 '../' 开头
 * 例如：'micro_marketing/MarketingForm'、'federation:micro_user/UserCard'
 */
export function isFederationPath(path: string): boolean {
  if (!path) return false
  if (path.startsWith('/') || path.startsWith('./') || path.startsWith('../')) {
    return false
  }
  return path.startsWith('federation:') || path.includes('/')
}

/**
 * ⚡ 真正的全动态模块联邦解析器（零组件维护）
 * 格式支持：
 * 1. 'micro_marketing/MarketingForm'
 * 2. 'federation:micro_marketing/MarketingForm'
 */
export function loadFederationComponent(path: string): Component | null {
  if (!path) return null

  const cleanPath = path.replace(/^federation:/, '').trim()

  // 1. 命中内存缓存直接返回
  if (componentCache.has(cleanPath)) {
    return componentCache.get(cleanPath)
  }

  // 2. 动态拆解：应用名称 与 暴露的组件名
  // 例如 'micro_marketing/custom/MarketingForm' -> remoteName: 'micro_marketing', moduleName: './custom/MarketingForm'
  const firstSlashIndex = cleanPath.indexOf('/')
  if (firstSlashIndex === -1) {
    console.warn(`[FederationLoader] 非法的模块联邦组件路径格式: ${cleanPath}`)
    return null
  }

  const remoteName = cleanPath.substring(0, firstSlashIndex)
  const rawModuleName = cleanPath.substring(firstSlashIndex + 1)
  const moduleName = rawModuleName.startsWith('./') ? rawModuleName : `./${rawModuleName}`

  // 3. 构建真正的动态异步组件
  const asyncComponent = defineAsyncComponent({
    loader: async () => {
      try {
        // 获取 @originjs/vite-plugin-federation 注入的底层通用拉取方法
        const getRemoteFn = (window as any).__federation_method_getRemote

        if (!getRemoteFn) {
          throw new Error('当前环境未初始化 Vite 模块联邦运行时环境 (__federation_method_getRemote 未挂载)')
        }

        // 核心：直接动态拉取微应用的组件，无需本地提前声明组件列表！
        const module = await getRemoteFn(remoteName, moduleName)
        // 兼容 ES 模块 export default 和 export { Comp }
        return module?.default || module
      } catch (err) {
        console.error(`[FederationLoader] 动态拉取远程组件失败 [${remoteName} -> ${moduleName}]:`, err)
        throw err
      }
    },
    loadingComponent: {
      render: () => h('div', { class: 'text-xs text-gray-400 p-2' }, '正在拉取远程组件...')
    },
    errorComponent: {
      render: () => h('div', { class: 'text-xs text-red-500 p-2' }, `[远程组件加载异常: ${cleanPath}]`)
    },
    timeout: 15000
  })

  // 写入缓存
  componentCache.set(cleanPath, asyncComponent)
  return asyncComponent
}
