import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

const router = createRouter({
  history: createWebHashHistory(
    qiankunWindow.__POWERED_BY_QIANKUN__
      ? '/'
      : '/'
  ),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/supplyChain/productAssistant/namePlatRecord'
    },
    {
      path: '/supplyChain/productAssistant',
      component: () => import('../views/layout/AsideMain.vue'),
      name: 'account',
      meta: { title: '生产辅助' },
      children: [
        {
          path: 'namePlatRecord',
          name: 'namePlatRecord',
          meta: { title: '铭牌打印' },
          component: () => import('../views/microapp/productAssistant/namePlatePrint/NamePlateRecordList.vue'),
        },
        {
          path: 'qrSyncJob',
          name: 'qrSyncJob',
          meta: { title: '同步记录' },
          component: () => import('../views/microapp/productAssistant/daTianSyncJob/QrSyncJobList.vue'),
        },
        {
          path: 'printRecord',
          name: 'printRecord',
          meta: { title: '打印记录' },
          component: () => import('../views/microapp/productAssistant/printRecord/PrintRecordList.vue'),
        },
        {
          path: 'modelEnvPubNo',
          name: 'modelEnvPubNo',
          meta: { title: '环保公开信息' },
          component: () => import('../views/microapp/productAssistant/modelEnvPubNo/ModelEnvPubNoList.vue'),
        }
      ]
    },
  ]
})

export default router
