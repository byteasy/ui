import parent from './parent/ja.ts'
import component from './component/ja.ts'
import app from './app/ja.ts'

export default {
  title: 'Byteasy',
  ...parent,
  ...component,
  ...app

} as const
