import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import { resolve } from 'path'
import IconsResolver from 'unplugin-icons/resolver'

// https://vite.dev/config/
export default defineConfig({
  base: '/platform/',
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'icon',
          enabledCollections: ['ep', 'local'],
        })
      ],
      dts: 'src/components.d.ts'
    }),
    Icons({
      autoInstall: true, // 自动安装图标集
      compiler: 'vue3', // 编译器
      // 默认样式
      defaultStyle: 'display: inline-block;',
      // 默认类名
      defaultClass: 'icon',
      customCollections: {
        // 本地 SVG 图标
        'local': FileSystemIconLoader(
          resolve(__dirname, 'src/icons')
        )
      }
    })
  ],
  server: {
    port: 7999,
    proxy: {
      '/system': {
        target: 'http://localhost:80',
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
