import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import zhTw from 'element-plus/dist/locale/zh-tw.mjs'
import zhMo from 'element-plus/dist/locale/zh-mo.mjs'
import fr from 'element-plus/dist/locale/fr.mjs'
import de from 'element-plus/dist/locale/de.mjs'
import it from 'element-plus/dist/locale/it.mjs'
import ja from 'element-plus/dist/locale/ja.mjs'
import ko from 'element-plus/dist/locale/ko.mjs'
import ru from 'element-plus/dist/locale/ru.mjs'
import pt from 'element-plus/dist/locale/pt.mjs'
import ptBr from 'element-plus/dist/locale/pt-br.mjs'
import es from 'element-plus/dist/locale/es.mjs'

const elementLocales = {
  'zh_CN': zhCn,
  'en': en,
  'zh_TW': zhTw,
  'zh_MO': zhMo,
  'fr': fr,
  'de': de,
  'it': it,
  'ja': ja,
  'ko': ko,
  'ru': ru,
  'pt': pt,
  'pt_br': ptBr,
  'es': es,
}
// 映射表
const langMap = {
  'zh': 'zh_CN',
  'zh-CN': 'zh_CN',
  'zh-cn': 'zh_CN',
  'zh_cn': 'zh_CN',
  'zh-TW': 'zh_TW',
  'zh-tw': 'zh_TW',
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
  'pt_br': 'pt_br',
  'es': 'es',
}

const langList = [
  {label: '中文简体', value: 'zh_CN', description: '中文简体'},
  {label: 'English', value: 'en', description: '英语'},
  {label: 'Français', value: 'fr', description: '法语'},
  {label: 'Deutsch', value: 'de', description: '德语'},
  {label: 'Italiano', value: 'it', description: '意大利语'},
  {label: '日本語', value: 'ja', description: '日语'},
  {label: '한국어', value: 'ko', description: '韩语'},
  {label: 'Русский', value: 'ru', description: '俄语'},
  {label: 'Português', value: 'pt_br', description: '葡萄牙语-巴西'},
  {label: 'Português', value: 'pt', description: '葡萄牙语-葡萄牙'},
  {label: 'Español', value: 'es', description: '西班牙语'},
]

export function getLangText(text: any, currentLocale: string): string {
  if (!text) return ''
  const lang = langMap[currentLocale] || currentLocale

  try {
    const obj = JSON.parse(text)
    return obj[lang] || obj['zh_CN'] || obj['en'] || text
  } catch {
    return text
  }
}

export {
  langMap, langList, elementLocales
}
