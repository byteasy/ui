// src/util/componentLoader.ts
import { defineAsyncComponent, h, type Component } from 'vue'
import { getRouteComponents } from "@/util/autoImportComponent.ts"

// 缓存动态 ESM 异步组件实例，避免同一 URL 重复发起网络请求
export const dynamicComponentCache = new Map<string, Component>()

/**
 * 将 import 语句中的解构内容转换为合法的 JS 对象解构语法
 * 例如将 "openBlock as _openBlock, ref" 转换为 "openBlock: _openBlock, ref"
 */
export function parseImportClause(clause: string): string {
  return clause
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => {
      // 匹配 "a as b" 并替换为 "a: b"
      if (/\s+as\s+/.test(item)) {
        const [orig, alias] = item.split(/\s+as\s+/)
        return `${orig.trim()}: ${alias.trim()}`
      }
      return item
    })
    .join(', ')
}

/**
 * 核心：支持 ESM 裸模块重写的安全动态加载器
 * 通过 fetch 拉取源码并在内存中动态替换裸模块为全局宿主实例，再通过 Blob URL 原生执行
 */
export async function fetchAndExecuteEsm(url: string): Promise<any> {
  // 1. 请求远程组件脚本源码
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status} fetching ${url}`)
  }
  let code = await response.text()

  // 2. 注入宿主共享实例头
  const bridgeHeader = `
const _Vue = window.__SHARED_VUE__ || {};
const _ElementPlus = window.__SHARED_ELEMENT_PLUS__ || {};
const _ElementIcons = window.__SHARED_ELEMENT_ICONS__ || {};
const _VueI18n = window.__SHARED_VUE_I18N__ || {};
`

  // 3. 精准转换各个模块的 import 语句
  const transformImport = (sourceCode: string, moduleName: string, globalVar: string) => {
    // 匹配: import { ... } from "moduleName";
    const namedImportRegex = new RegExp(`import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${moduleName}['"];?`, 'g')
    sourceCode = sourceCode.replace(namedImportRegex, (_, clause) => {
      return `const { ${parseImportClause(clause)} } = ${globalVar};`
    })

    // 匹配: import * as Foo from "moduleName";
    const starImportRegex = new RegExp(`import\\s*\\*\\s*as\\s+([\\w$]+)\\s*from\\s*['"]${moduleName}['"];?`, 'g')
    sourceCode = sourceCode.replace(starImportRegex, (_, alias) => {
      return `const ${alias} = ${globalVar};`
    })

    // 匹配: import Foo from "moduleName";
    const defaultImportRegex = new RegExp(`import\\s+([\\w$]+)\\s+from\\s*['"]${moduleName}['"];?`, 'g')
    sourceCode = sourceCode.replace(defaultImportRegex, (_, alias) => {
      return `const ${alias} = ${globalVar}.default || ${globalVar};`
    })

    return sourceCode
  }

  code = transformImport(code, 'vue', '_Vue')
  code = transformImport(code, 'element-plus', '_ElementPlus')
  code = transformImport(code, '@element-plus/icons-vue', '_ElementIcons')
  code = transformImport(code, 'vue-i18n', '_VueI18n')

  // 4. 转成 Blob URL 并通过浏览器原生 dynamic import 执行
  const blob = new Blob([bridgeHeader + '\n' + code], { type: 'application/javascript' })
  const blobUrl = URL.createObjectURL(blob)

  try {
    const dynamicImport = new Function('u', 'return import(u)')
    const module = await dynamicImport(blobUrl)
    return module
  } finally {
    URL.revokeObjectURL(blobUrl)
  }
}

/**
 * 通用组件加载入口（支持本地路径与远程 ESM 脚本）
 * @param path 本地路径 (如 '/views/user/UserForm.vue') 或 远程 ESM (如 'http://localhost:9088/index.js#DemoOperationButton')
 */
export function getComponent(path: string | null | undefined): any {
  if (!path) return null

  // 1. 判断是否为远程动态脚本
  const isRemote = /^(https?:)?\/\//.test(path) || /\.(js|mjs)(\?.*)?$/.test(path)

  if (isRemote) {
    if (dynamicComponentCache.has(path)) {
      return dynamicComponentCache.get(path)!
    }

    const asyncComp = defineAsyncComponent({
      loader: async () => {
        try {
          const [scriptUrl, componentName] = path.split('#')
          const module = await fetchAndExecuteEsm(scriptUrl)
          const comp = componentName ? module[componentName] : (module.default || module)

          if (!comp) {
            throw new Error(`在模块中未找到组件 "${componentName || 'default'}"`)
          }
          return comp
        } catch (err) {
          console.error(`[Dynamic Loader] 远程组件加载失败: ${path}`, err)
          throw err
        }
      },
      loadingComponent: {
        render() {
          return h('span', { class: 'text-xs text-gray-400 py-1' }, '组件加载中...')
        }
      },
      errorComponent: {
        render() {
          return h('span', { class: 'text-xs text-red-500', title: `加载失败: ${path}` }, '[远程组件异常]')
        }
      },
      delay: 80,
      timeout: 8000
    })

    dynamicComponentCache.set(path, asyncComp)
    return asyncComp
  }

  // 2. 本地相对路径组件查找
  const { modules } = getRouteComponents()
  return modules['..' + path] || modules[path] || null
}
