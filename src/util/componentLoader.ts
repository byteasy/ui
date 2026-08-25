// src/util/componentLoader.ts
import {getRouteComponents} from "@/util/autoImportComponent.ts"
import type {Component} from "vue";

const {modules} = getRouteComponents()
const dynamicComponentCache = new Map<string, Component>()

/**
 * 判断是否为动态远程 ESM 脚本路径
 * 支持: http://, https://, //, 以及以 .js / .mjs 结尾的路径
 */
export function isRemoteEsm(path: string): boolean {
  return /^(https?:)?\/\//.test(path) || /\.(js|mjs)(\?.*)?$/.test(path)
}

/**
 * 将 import 语句中的解构内容转换为合法 JS 解构语句
 * 例如将 "openBlock as _openBlock, ref" 转换为 "openBlock: _openBlock, ref"
 */
function parseImportClause(clause: string): string {
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
 */
export async function fetchAndExecuteEsm(url: string) {
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
