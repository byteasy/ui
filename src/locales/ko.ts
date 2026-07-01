import parent from './parent/ko.ts'
import app from './app/ko.ts'

export default {
  title: 'Byteasy',
  ...parent,
  ...app

} as const
