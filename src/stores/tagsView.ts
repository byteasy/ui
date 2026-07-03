import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'

// 扩展路由元数据类型
export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string
}

export const useTagsViewStore = defineStore('tagsView', {
  state: () => ({
    visitedViews: [] as TagView[],
  }),
  getters: {
    // 提取所有访问过的视图中，需要缓存的组件名 (注意：组件内必须定义相同的 name)
    cachedViews: (state) : string[] => {
      return state.visitedViews
        .map(view => view.name as string)
        .filter(name => !!name)
    }
  },
  actions: {
    addView(view: RouteLocationNormalized) {
      if (this.visitedViews.some((v) => v.path === view.path)) return
      this.visitedViews.push({
        ...view,
        title: (view.meta?.title as string) || 'no-name',
      })
    },
    delView(view: TagView) {
      const index = this.visitedViews.findIndex((v) => v.path === view.path)
      if (index > -1) this.visitedViews.splice(index, 1)
    },
    delOthersViews(view: TagView) {
      this.visitedViews = this.visitedViews.filter((v) => v.path === view.path || v.meta?.affix)
    },
    delLeftViews(view: TagView) {
      const index = this.visitedViews.findIndex((v) => v.path === view.path)
      this.visitedViews = this.visitedViews.filter((v, i) => i >= index || v.meta?.affix)
    },
    delRightViews(view: TagView) {
      const index = this.visitedViews.findIndex((v) => v.path === view.path)
      this.visitedViews = this.visitedViews.filter((v, i) => i <= index || v.meta?.affix)
    },
    delAllViews() {
      this.visitedViews = this.visitedViews.filter((v) => v.meta?.affix)
    },
  },
})
