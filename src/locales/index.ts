// src/locales/index.ts
import { createI18n } from 'vue-i18n'
import type { I18nOptions, I18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

const messages = {
  en,
  zh
}

const language = (navigator.language || 'zh').toLocaleLowerCase()

const i18nOptions: I18nOptions = {
  locale: localStorage.getItem('lang') || language.split('-')[0] || 'zh',
  fallbackLocale: 'en',
  messages,
  globalInjection: true  // 全局注入 $t 方法
}

async function loadMessages(lang: string) {
  try {
    // 从服务器获取语言包
    const response = await fetch(`/api/lang/${lang}`)
    const messages = await response.json()

    // 设置到 i18n
    i18n.global.setLocaleMessage(lang, messages)
    i18n.global.locale = lang

    // 保存到本地存储
    localStorage.setItem('lang', lang)

    return true
  } catch (error) {
    console.error('加载语言包失败:', error)

    // 如果服务器失败，尝试加载本地备用
    try {
      const localMessages = await import('./' + lang + '.ts')
      i18n.global.setLocaleMessage(lang, localMessages.default)
      return true
    } catch {
      return false
    }
  }
}

// 3. 初始化加载
async function initI18n() {
  const lang = localStorage.getItem('lang') || 'zh'
  await loadMessages(lang)
}

const i18n = createI18n(i18nOptions) as I18n

export default i18n
export { initI18n, loadMessages }
