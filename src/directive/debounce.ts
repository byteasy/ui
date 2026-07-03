import type { ObjectDirective, DirectiveBinding } from 'vue'

export const debounce: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 🔥 关键修复：获取真实的 DOM 元素（解决UI组件不生效问题）
    const realEl = el?.$el || el

    const fn = binding.value
    const delay = binding.arg ? Number(binding.arg) : 500

    if (typeof fn !== 'function') {
      console.error('[v-debounce] 必须绑定一个函数')
      return
    }

    let timer: NodeJS.Timeout | null = null

    const handler = (...args: any[]) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(realEl, args)
        timer = null
      }, delay)
    }

    // 给真实DOM绑定事件
    realEl.addEventListener('click', handler)
    ;(realEl as any).__debounceHandler__ = handler
  },

  unmounted(el: HTMLElement) {
    const realEl = el?.$el || el
    const handler = (realEl as any).__debounceHandler__
    if (handler) {
      realEl.removeEventListener('click', handler)
    }
  }
}
