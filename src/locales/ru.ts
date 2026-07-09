import parent from './parent/ru.ts'
import componentRu from './component/ru.ts'
import app from './app/ru.ts'

export default {
  title: 'Byteasy',
  ...parent,
  ...componentRu,
  app

} as const
