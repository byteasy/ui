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
  {label: '中文简体', value: 'zh_CN', description: '中文简体'},
  {label: 'English', value: 'en', description: '英语'},
  {label: '中文繁體', value: 'zh_TW', description: '中文繁体'},
  {label: 'Français', value: 'fr', description: '法语'},
  {label: 'Deutsch', value: 'de', description: '德语'},
  {label: 'Italiano', value: 'it', description: '意大利语'},
  {label: '日本語', value: 'ja', description: '日语'},
  {label: '한국어', value: 'ko', description: '韩语'},
  {label: 'Русский', value: 'ru', description: '俄语'},
  {label: 'Português', value: 'pt', description: '葡萄牙语'},
  {label: 'Español', value: 'es', description: '西班牙语'},
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
