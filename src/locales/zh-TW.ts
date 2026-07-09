// zh.ts
import parentZHTW from './parent/zh-TW.ts'
import componentZHTW from './component/zh-TW.ts'
import app from './app/zh-TW.ts'

export default {
  title: 'Byteasy',
  ...parentZHTW,
  ...componentZHTW,
  ...app
} as const
