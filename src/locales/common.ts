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
  {label: '中文繁體', value: 'zh_TW'},
  {label: 'English', value: 'en'},
  {label: 'Français', value: 'fr'},
  {label: 'Deutsch', value: 'de'},
  {label: 'Italiano', value: 'it'},
  {label: '日本語', value: 'ja'},
  {label: '한국어', value: 'ko'},
  {label: 'Русский', value: 'ru'},
  {label: 'Português', value: 'pt'},
  {label: 'Español', value: 'es'},
]

export {
  langMap, langList
}
