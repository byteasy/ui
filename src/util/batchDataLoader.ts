// src/util/batchDataLoader.ts
import { doHttpGet, getEntityDefine } from "@/api/common/platform"

// 缓存项数据结构（包含过期时间戳）
interface CacheItem {
  data: any
  expireAt: number // 过期时间戳（毫秒）
}

// 1. 全局短时缓存池: cacheKey -> { data, expireAt }
const objectEntityCache = new Map<string, CacheItem>()

// 2. 默认缓存有效时间（毫秒），建议设为 1000ms（刚好覆盖一次表格完整渲染周期，又保证极高的新鲜度）
const CACHE_TTL_MS = 1000

// 3. 正在等待合并的请求队列: classKey -> Set<id>
const batchQueueMap = new Map<string, Set<any>>()

// 4. 正在执行的网络请求 Promise 池: classKey -> Promise<any>
const pendingPromisesMap = new Map<string, Promise<any>>()

// 5. 等待分发给每个组件的 Resolve 回调池
const resolverMap = new Map<string, Array<{ id: any; resolve: (data: any) => void }>>()

/**
 * 获取对象的唯一缓存 Key
 */
function getCacheKey(externalClass: string, id: any): string {
  return `${externalClass}_${id}`
}

/**
 * 显式手动清理某个类或所有对象的短时缓存（供弹窗选择后或外部刷新时调用）
 */
export function clearEntityCache(externalClass?: string, id?: any) {
  if (externalClass && id !== undefined) {
    objectEntityCache.delete(getCacheKey(externalClass, id))
  } else if (externalClass) {
    for (const key of objectEntityCache.keys()) {
      if (key.startsWith(`${externalClass}_`)) {
        objectEntityCache.delete(key)
      }
    }
  } else {
    objectEntityCache.clear()
  }
}

/**
 * 核心：短生命周期批量加载实体对象
 */
export function fetchEntityObject(
  externalClass: string,
  primaryField: string,
  id: any,
  extraParams: Record<string, any> = {},
  ttlMs: number = CACHE_TTL_MS
): Promise<any> {
  if (id === undefined || id === null || id === '') {
    return Promise.resolve(null)
  }

  const cacheKey = getCacheKey(externalClass, id)
  const now = Date.now()

  // 1. 检查短时缓存：如果存在且未过期，直接复用
  if (objectEntityCache.has(cacheKey)) {
    const item = objectEntityCache.get(cacheKey)!
    if (item.expireAt > now) {
      return Promise.resolve(item.data)
    } else {
      // 已过期，从 Map 中移除
      objectEntityCache.delete(cacheKey)
    }
  }

  // 2. 将 ID 放入同一渲染批次的聚合队列
  const classKey = `${externalClass}_${JSON.stringify(extraParams)}`
  if (!batchQueueMap.has(classKey)) {
    batchQueueMap.set(classKey, new Set())
    resolverMap.set(classKey, [])
  }

  return new Promise((resolve) => {
    batchQueueMap.get(classKey)!.add(id)
    resolverMap.get(classKey)!.push({ id, resolve })

    // 3. 微任务调度：将同一 Tick / 渲染周期内的分散请求合并为 1 次批量请求
    if (!pendingPromisesMap.has(classKey)) {
      const schedulePromise = Promise.resolve().then(async () => {
        const idSet = batchQueueMap.get(classKey)
        const resolvers = resolverMap.get(classKey) || []

        // 清理当前批次状态
        batchQueueMap.delete(classKey)
        resolverMap.delete(classKey)
        pendingPromisesMap.delete(classKey)

        if (!idSet || idSet.size === 0) return

        const idList = Array.from(idSet)

        try {
          // 4. 发起批量 in 请求
          const entityDefine = await getEntityDefine(externalClass)
          const url = entityDefine.serviceInstance.contextPath + '/sapi/common/' + externalClass

          const queryObj: Record<string, any> = {
            ...extraParams,
            size: idList.length > 20 ? idList.length : 20
          }

          if (idList.length === 1) {
            queryObj[primaryField] = idList[0]
            queryObj[primaryField + 'QueryType'] = 'eq'
          } else {
            queryObj[primaryField] = idList
            queryObj[primaryField + 'QueryType'] = 'in'
          }

          const response = await doHttpGet(url, queryObj)
          const records: any[] = response?.data?.records || []
          const expireTime = Date.now() + ttlMs

          // 5. 写入短时缓存（只在设定的 ttlMs 毫秒内有效）
          records.forEach((record) => {
            const recordId = record[primaryField]
            if (recordId !== undefined && recordId !== null) {
              objectEntityCache.set(getCacheKey(externalClass, recordId), {
                data: record,
                expireAt: expireTime
              })
            }
          })

          // 6. 分发结果给各个组件
          resolvers.forEach(({ id: targetId, resolve: itemResolve }) => {
            const cached = objectEntityCache.get(getCacheKey(externalClass, targetId))
            itemResolve(cached?.data || null)
          })
        } catch (error) {
          console.error('[BatchDataLoader Error]:', error)
          resolvers.forEach(({ resolve: itemResolve }) => itemResolve(null))
        }
      })

      pendingPromisesMap.set(classKey, schedulePromise)
    }
  })
}
