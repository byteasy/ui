import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
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
import qiankun from 'vite-plugin-qiankun'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production' || mode === 'pro'
  const isBuild = command === 'build' // 识别当前是否是打包构建阶段

  return {
    base: '/platformSvr/common',
    plugins: [
      vue(),
      vueJsx(),
      // 1. 🔥 核心修复：仅在 build 打包时加载模块联邦插件，彻底避开 dev 模式下的拦截与 500 报错
      isBuild &&
      federation({
        name: 'platform_service',
        remotes: {
          micro_marketing: env.VITE_MICRO_MARKETING_ENTRY || '/marketing/assets/remoteEntry.js',
          micro_biz: env.VITE_MICRO_BIZ_ENTRY || '/biz/assets/remoteEntry.js',
        },
        shared: ['vue', 'vue-router', 'pinia', 'element-plus', 'vue-i18n']
      }),
      qiankun('platform-service', {
        useDevMode: true
      }),
      mode === 'dev' && process.env.NOT_QIANKUN_BUILD && vueDevTools(),
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
        autoInstall: true,
        compiler: 'vue3',
        defaultStyle: 'display: inline-block;',
        defaultClass: 'icon',
        customCollections: {
          local: FileSystemIconLoader(resolve(__dirname, 'src/icons')),
        },
      }),
    ].filter(Boolean),
    define: {
      'import.meta.env.MODE': JSON.stringify(mode),
    },
    server: {
      cors: true,
      port: 7998,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: {
        '/platformSvr/sapi': {
          target: 'http://localhost:18080',
          changeOrigin: true,
        },
      },
    },
    esbuild: {
      supported: {
        'top-level-await': true
      }
    },
    build: {
      target: 'esnext',
      outDir: 'dist/static/common',
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('monaco-editor') || id.includes('@guolao/vue-monaco-editor')) {
                return 'monaco-editor'
              }
              if (id.includes('axios') || id.includes('dayjs') || id.includes('qs') || id.includes('md5') || id.includes('xe-utils')) {
                return 'utils-vendor'
              }
            }
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@import "src/assets/styles/global.scss";',
        },
      },
    },
    resolve: {
      extensions: ['.js', '.ts', '.json', '.vue'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // 2. 🔥 核心修复：彻底删除了 'vue-i18n' 的文件级别名，防止模块联邦解析路径时出现 package.json 找不到的 500 异常
      },
    },
  }
})
