import parent from './parent/ko.ts'
import component from './component/ko.ts'
import app from './app/ko.ts'

export default {
  title: 'Byteasy',
  ...parent,
  ...component,
  ...app

} as const
