import type { ObjectDirective } from 'vue'
import { useSessionStore } from '../stores/session.ts'

export const permission: ObjectDirective = {
  mounted(el: HTMLElement, binding) {
    if (binding.value === undefined) return
    const code = binding.value
    const currentSession = useSessionStore()
    if (!currentSession.authorize(code)) {
      el.remove()
    }
  }
}
