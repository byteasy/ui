// src/locales/index.ts
import type {I18n, I18nOptions} from 'vue-i18n'
import {createI18n} from 'vue-i18n'

import de from './de'
import en from './en'
import es from './es'
import fr from './fr'
import it from './it'
import ja from './ja'
import ko from './ko'
import pt from './pt'
import pt_BR from './pt-BR'
import ru from './ru'
import zh_CN from './zh-CN.ts'
import zh_TW from './zh-TW.ts'

const messages = {
  de,
  en,
  es,
  fr,
  it,
  ja,
  ko,
  pt,
  pt_BR,
  ru,
  zh_CN,
  zh_TW,
}

// 获取当前语言
function getDefaultLocale() {
  const storageLang = localStorage.getItem('lang')
  if (storageLang) return storageLang

  // 浏览器语言适配
  const navLang = navigator.language.toLowerCase()

  if (navLang.includes('cn') || navLang.includes('zh')) return 'zh_CN'
  if (navLang.includes('tw')) return 'zh_TW'
  if (navLang.includes('mo')) return 'zh_MO'
  if (navLang.includes('br')) return 'pt_BR'
  return 'en'
}

const i18nOptions: I18nOptions = {
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
  legacy: false  // Vue3 + TS 必须加
}

const i18n = createI18n(i18nOptions) as I18n

export default i18n
