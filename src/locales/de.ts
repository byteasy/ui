import parent from './parent/de.ts'
import component from './component/de.ts'
import app from './app/de.ts'

export default {
  title: 'Byteasy',
  ...parent,
  ...component,
  ...app

} as const
