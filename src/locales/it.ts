import parent from './parent/it.ts'
import component from './component/it.ts'
import app from './app/it.ts'

export default {
  title: 'Byteasy',
  ...parent,
  ...component,
  ...app

} as const
