import router from '@/router'
import store from '@/store'
import cache from '@/utils/cache'
import axios from '@/axios'
import { ws } from '../webSocket'

// 登录验证，权限验证
router.beforeEach((to, from, next) => {
    // 是否需要登录
    if (to.matched.some(record => record.meta.login)) {
        if (cache.getToken() || store.state.user.nickname === 'public') {
            if (to.path === '/login') {
                next('/')
            } else {
                // 除非重新登陆，不然token不变，并且socket不会因为刷新中断
                ws.webSocket == null && ws.setWebSocket(cache.getToken())
                // 后台是否有用户信息
                axios.post('/live').then(res => {
                    if (res.data.status === 666 && store.state.user.nickname !== 'public') {
                        // 可根据错误信息，做相应需求，这里默认token值失效
                        window.alert('Failed, please login again')
                        cache.removeToken()
                        next({ path: '/login', query: { redirect: to.fullPath } })
                    } else {
                        if (!store.state.user) store.commit('SET_USER', JSON.parse(cache.getLocal('user')))
                        if (store.state.user) {
                            assessPermission(store.state.user.role, to.meta.role, next)
                        }
                    }
                })
            }
        } else {
            if (from.path !== '/') window.alert('登录已失效，请重新登录')
            next({ path: '/login', query: { redirect: to.fullPath } })
        }
    } else {
        if (to.path === '/login' && cache.getToken()) {
            next('/')
        } else {
            next()
        }
    }
})

// 验证权限
function assessPermission(userRole, pageRole, next) {
    let pass = false
    // 页面无需权限 || 用户是管理员
    if (!pageRole || userRole.indexOf('admin') > -1) pass = true
    // 符合页面的其中一种权限（支持String和Array写法）
    if (typeof pageRole === 'string') {
        if (userRole.indexOf(pageRole) > -1) pass = true
    } else if (Array.isArray(pageRole)) {
        if (pageRole.some(role => userRole.indexOf(role) > -1)) pass = true
    }
    pass ? next() : next('/401')
}
