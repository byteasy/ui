import parent from './parent/pt.ts'
import component from './component/pt.ts'
import app from './app/pt.ts'

export default {
  title: 'Byteasy',
  ...parent,
  ...component,
  ...app

} as const
