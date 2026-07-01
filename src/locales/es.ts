import parent from './parent/es.ts'
import app from './app/es.ts'

export default {
  title: 'Byteasy',
  ...parent,
  ...app

} as const
