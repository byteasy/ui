import parentZHCN from './parent/zh-CN.ts'
import app from './app/zh-CN.ts'
export default {
  title: 'Byteasy',
  ...parentZHCN,
  ...app

} as const
