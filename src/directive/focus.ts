import type { ObjectDirective } from 'vue'

export const focus: ObjectDirective = {
  mounted(el: HTMLElement, binding) {
    if (binding.value === undefined || binding.value === true) {
      el.focus()
    }
  }
}
