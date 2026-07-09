import parent from './parent/es.ts'
import component from './component/es.ts'
import app from './app/es.ts'

export default {
  title: 'Byteasy',
  ...parent,
  ...component,
  ...app

} as const
