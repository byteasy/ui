// zh.ts
import parentZHTW from './parent/zh-TW.ts'
import app from './app/zh-TW.ts'

export default {
  title: 'Byteasy',
  ...parentZHTW,
  ...app
} as const
