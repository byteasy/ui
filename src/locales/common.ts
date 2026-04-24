// 映射表
const langMap = {
  'zh': 'zh_CN',
  'zh-CN': 'zh_CN',
  'zh_cn': 'zh_CN',
  'zh-TW': 'zh_TW',
  'zh_tw': 'zh_TW',
  'en': 'en',
  'en-US': 'en',
  'fr': 'fr',
  'de': 'de',
  'it': 'it',
  'ja': 'ja',
  'ko': 'ko',
  'ru': 'ru',
  'pt': 'pt',
  'es': 'es',
}

const langList = [
  {label: '中文简体', value: 'zh_CN'},
  {label: 'English', value: 'en'},
  {label: '中文繁體', value: 'zh_TW'},
  {label: 'Français', value: 'fr'},
  {label: 'Deutsch', value: 'de'},
  {label: 'Italiano', value: 'it'},
  {label: '日本語', value: 'ja'},
  {label: '한국어', value: 'ko'},
  {label: 'Русский', value: 'ru'},
  {label: 'Português', value: 'pt'},
  {label: 'Español', value: 'es'},
]

export function getLangText(text: any, currentLocale: string): string {
  if (!text) return ''

  const lang = langMap[currentLocale] || currentLocale

  try {
    const obj = JSON.parse(text)
    return obj[lang] || text
  } catch {
    return text
  }
}

export {
  langMap, langList
}
