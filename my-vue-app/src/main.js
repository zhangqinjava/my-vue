import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)
app.use(router)
app.use(store)
// 注册 Element Plus
app.use(ElementPlus, { locale: zhCn })
// 全局注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.mount('#app')

