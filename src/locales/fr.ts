import parent from './parent/fr.ts'
import component from './component/fr.ts'
import app from './app/fr.ts'

export default {
  title: 'Byteasy',
  ...parent,
  ...component,
  ...app

} as const
