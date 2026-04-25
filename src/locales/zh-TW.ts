// zh.ts
import parentZHTW from './parent/zh-TW.ts'
import app from './app/zh-TW.ts'

export default {
  title: '临工农机',
  ...parentZHTW,
  ...app
} as const
