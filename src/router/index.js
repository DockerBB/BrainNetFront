import Vue from 'vue'
import Router from 'vue-router'

// const view = () => import('@/layout/view')
// index
const index = () => import('@/page/index/index')
const home = () => import('@/page/index/children/home/home')
const bnViewer = () => import('@/page/index/children/brainNetViewer/View')
const brainSide = () => import('@/page/index/children/brainNetViewer/brainNet')
const gretna = () => import('@/page/index/children/gretna/gretna')
const fmri = () => import('@/page/index/children/fmri/fmri')
// const ftsys = () => import('@/page/index/children/ftsys/ftsys')
// login
const login = () => import('@/page/login/login')
// Sign Up
const Signup = () => import('@/page/login/signup')
// other
const page401 = () => import('@/page/other/page401')
const page404 = () => import('@/page/other/page404')

Vue.use(Router)

/* sideRoutes config
* @meta
* icon: ''                      菜单图标（可以用element-ui的icon & iconfont）
* login: false                  是否需要登录
* role: 'admin' || ['admin']    是否需要权限
* keep: false                   是否需要缓存
* open: false                   是否展开菜单
*/
// 要在侧边栏渲染的路由
export const sideRoutes = [
    {
        name: 'home',
        path: 'home',
        component: home,
        meta: {
            icon: 'el-icon-my-home'
            // title: '主页'
        }
    },
    {
        name: 'fmri',
        path: 'fmri',
        component: fmri,
        meta: {
            icon: 'iconfont icon-timeSeries'
            // title: '网络分析'
        }
    },
    {
        name: 'gretna',
        path: 'networkanalysis',
        component: gretna,
        meta: {
            icon: 'iconfont icon-fenxi'
            // title: '网络分析'
        }
    },
    {
        name: 'bn-view',
        path: 'brainNet',
        components: {
            default: bnViewer,
            sideOption: brainSide
        },
        meta: {
            icon: 'iconfont icon-danao',
            // title: '脑神经网络',
            switchon: true
        }
    },
    {
        name: 'ftsys',
        path: 'ftsys',
        component: ftsys
    }
]

export default new Router({
    // mode: 'history',
    routes: [
        {
            path: '',
            redirect: '/index'
        },
        {
            name: 'index',
            path: '/index',
            component: index,
            redirect: '/index/home',
            meta: {
                login: true
            },
            children: sideRoutes
        },
        {
            name: 'login',
            path: '/login',
            component: login
        },
        {
            name: 'signup',
            path: '/signup',
            component: Signup
        },
        {
            name: '401',
            path: '/401',
            component: page401
        },
        {
            name: '404',
            path: '/404',
            component: page404
        },
        {
            path: '*',
            redirect: '/404'
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
})
