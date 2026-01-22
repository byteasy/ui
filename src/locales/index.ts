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

const i18n = createI18n(i18nOptions) as I18n

export default i18n
