import { defineStore } from 'pinia'
import request from '@/api/request' // 替换为你实际的 request 导入路径

// 用于缓存正在请求中的 Promise，防止同一时间并发调用产生重复网络请求
const pendingEnumPromises = new Map<string, Promise<any>>()

export const useSessionStore = defineStore('session', {
  state: () => ({
    authorizedCodes: new Set<string>(),
    enumMap: new Map<string, any>(),
  }),
  getters: {
    authorize: (state) => {
      return (code: string) => state.authorizedCodes.has(code)
    },
  },
  actions: {
    addAuthorizedCode(url: string) {
      this.authorizedCodes.add(url)
    },
    invalidateAuthorizedCode() {
      this.authorizedCodes = new Set()
    },
    hasPermission(code: string | null | undefined) {
      if(code === null || code === undefined) {
        return false
      }
      return this.authorizedCodes.has(code)
    },
    putLocalEnum(name: string, enums: any) {
      this.enumMap.set(name, enums)
    },
    getLocalEnum(name: string) {
      return this.enumMap.get(name)
    },
    /**
     * 清理某个枚举或所有枚举缓存（适用于字典热更新场景）
     */
    clearEnumCache(name?: string) {
      if (name) {
        this.enumMap.delete(name)
        pendingEnumPromises.delete(name)
      } else {
        this.enumMap.clear()
        pendingEnumPromises.clear()
      }
    },
    /**
     * 获取枚举（优先走缓存，带并发去重）
     */
    async fetchEnumValues(enumClassName: string) {
      // 1. 命中内存缓存，直接返回
      if (this.enumMap.has(enumClassName)) {
        return this.enumMap.get(enumClassName)
      }

      // 2. 如果当前有同名的请求正在网络请求中，复用该 Promise，不重复发请求
      if (pendingEnumPromises.has(enumClassName)) {
        return pendingEnumPromises.get(enumClassName)
      }

      // 3. 发起真实请求并存入 pending 队列
      const promise = request({
        url: `/platformSvr/sapi/fieldDefines/entity/${enumClassName}`,
        method: 'get',
      })
        .then((res: any) => {
          // 写入本地 Pinia 缓存
          this.putLocalEnum(enumClassName, res)
          return res
        })
        .finally(() => {
          // 请求完成后，移出 pending 队列
          pendingEnumPromises.delete(enumClassName)
        })

      pendingEnumPromises.set(enumClassName, promise)
      return promise
    }
  }
})
