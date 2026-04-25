import parentZHCN from './parent/zh-CN.ts'
import app from './app/zh-CN.ts'
export default {
  title: '临工农机',
  ...parentZHCN,
  ...app

} as const
