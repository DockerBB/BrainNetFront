import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import axios from '@/axios'
import { ws } from './webSocket'
// 第三方
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueProgressBar from 'vue-progressbar'
import vuePositionSticky from 'vue-position-sticky'
import i18n from '@/language'
import './assets/iconfont/iconfont.css'
// 自定义
import '@/assets/css/reset.css'
import '@/assets/css/global.css'
import '@/utils/permission'
import '@/utils/errorLog'
import components from '@/components'
import filters from '@/filters'
// mock数据
// import '@/mock'

Vue.config.productionTip = false

// 第三方
Vue.use(ElementUI, {
    size: 'small',
    i18n: (key, value) => i18n.t(key, value)
})
Vue.use(VueProgressBar)
Vue.use(vuePositionSticky)
// 自定义
Object.keys(components).forEach(key => {
    Vue.component(key, components[key])
})
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.prototype.$axios = axios
Vue.prototype.$webSocket = ws
new Vue({
    i18n,
    router,
    store,
    axios,
    render: h => h(App)
}).$mount('#app')
