import parent from './parent/en.ts'
import component from './component/en.ts'
import app from './app/en.ts'

export default {
  title: 'Byteasy',
  ...parent,
  ...component,
  ...app

} as const
