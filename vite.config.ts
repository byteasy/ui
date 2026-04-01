import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite' // 新增 loadEnv 导入
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
// 改为带环境参数的函数形式，核心改造点
export default defineConfig(({ mode }) => {
  // 加载对应环境的 .env 文件（.env.dev / .env.pro）
  // 第三个参数为空字符串，确保能加载所有 VITE_ 开头的环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: './',
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'icon',
            enabledCollections: ['ep', 'local'],
          }),
        ],
        dts: 'src/components.d.ts',
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
          local: FileSystemIconLoader(resolve(__dirname, 'src/icons')),
        },
      }),
    ],
    // 注入环境模式标识，让 env.d.ts 能识别当前环境
    define: {
      'import.meta.env.MODE': JSON.stringify(mode),
    },
    server: {
      cors: true,
      port: 7999,
      proxy: {
        '/platformSvr/': {
          target: 'http://localhost:18080',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist/static',
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "src/assets/styles/global.scss";',
        },
      },
    },
    resolve: {
      extensions: ['.js', '.ts', '.json'], // 自动补全扩展名
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    },
  }
})
