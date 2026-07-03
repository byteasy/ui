import { registerMicroApps } from 'qiankun'

export function registerApps(subApps) {
  try {
    console.log('registerApps()', subApps)
    registerMicroApps(subApps, {
      beforeLoad: [
        (app) => {
          console.log('before load', app)
        },
      ],
      beforeMount: [
        (app) => {
          console.log('before mount', app)
        },
      ],
      afterUnmount: [
        (app) => {
          console.log('before unmount', app)
        },
      ],
    })
  } catch (err) {
    console.log(err)
  }
}
