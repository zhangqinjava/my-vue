import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
        scss: {
            additionalData: `@use "@/styles/element/index.scss" as *;`,
        },
    }
},
  // 反向代理
  server: {
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    disableHostCheck: true,
    port: 5673,
    proxy: {
        '/api': {
            target:'http://127.0.0.1:8080',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api'
            }
        }
    } 
}
})
