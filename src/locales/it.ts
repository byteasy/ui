import parent from './parent/it.ts'
import app from './app/it.ts'

export default {
  title: 'LGAG',
  ...parent,
  ...app

} as const
