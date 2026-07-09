import {defineStore} from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => {
    return {
      authorizedCodes: new Set(),
    }
  },
  getters: {
    authorize: (state) => {
      return (code) => state.authorizedCodes.has(code)
    },
  },
  actions: {
    addAuthorizedCode(url) {
      this.authorizedCodes.add(url)
      // console.log(this.authorizedCodes)
    },
    invalidateAuthorizedCode() {
      this.authorizedCodes = new Set()
    },
  }
})
