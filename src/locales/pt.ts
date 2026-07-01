import parent from './parent/pt.ts'
import app from './app/pt.ts'

export default {
  title: 'Byteasy',
  ...parent,
  ...app

} as const
