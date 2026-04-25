import parent from './parent/es.ts'
import app from './app/es.ts'

export default {
  title: 'LGAG',
  ...parent,
  ...app

} as const
