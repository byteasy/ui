import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]'

      /**
       * 自定义插入位置
       * @default: body-last
       */
      // inject?: 'body-last' | 'body-first'

      /**
       * custom dom id
       * @default: __svg__icons__dom__
       */
      // customDomId: '__svg__icons__dom__',
    }),
  ],
  server: {
    port: 7999,
    proxy: {
      '/system': {
        target: 'http://192.168.202.21:8080',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist/static'
  },
  css: {
    preprocessorOptions: {
      scss: {
        /**如果引入多个文件，可以使用
         * '@import "@/assets/scss/globalVariable1.scss";
         * @import"@/assets/scss/globalVariable2.scss";'
         **/
        additionalData: '@import "src/assets/styles/global.scss";'
      }
    }
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'], // 自动补全扩展名
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), 'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
    },
  },
})
