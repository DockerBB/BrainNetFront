import Vue from 'vue'
import Vuex from 'vuex'
import i18n from '@/language'
import cache from '@/utils/cache'
import { getLogin, getUser, signOn } from '@/api'

Vue.use(Vuex)

const state = {
    logs: [], // 错误日志
    user: '', // 用户信息{headimgurl,nickname}
    language: 'en',
    bnOption: { sflag: false, lflag: false, allMaterial: {} }
}
const getters = {
}
const mutations = {
    set_language(state, lang) {
        i18n.locale = lang
        state.language = lang
    },
    SET_LOGS(state, error) {
        state.logs.push(error)
    },
    SET_USER(state, val) {
        state.user = val
        cache.setLocal('user', val)
    },
    SET_ROLE(state, val) {
        state.user.role = val
    },
    SET_LOGOUT(state) {
        state.user = ''
        cache.removeToken()
    }
}
const actions = {
    // 获取登录数据
    async GET_LOGIN_DATA({ commit }, params) {
        return new Promise((resolve, reject) => {
            (params.name === undefined ? getLogin(params) : signOn(params)).then(res => {
                if (res && res.data.token) {
                    console.log(res.data.token)
                    res.data.nickname = res.data.name
                    delete res.data.name
                    commit('SET_USER', res.data)
                    cache.setToken(res.token)
                    resolve(res)
                } else {
                    reject(new Error('nothing login data'))
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取用户数据
    async GET_USER_DATA({ commit }, token) {
        return new Promise((resolve, reject) => {
            getUser(token).then(res => {
                if (res && res.code === 200 && res.data) {
                    commit('SET_USER', res.data)
                    resolve(res.data)
                } else {
                    reject(new Error('nothing user data'))
                }
            }).catch(err => {
                reject(err)
            })
        })
    }
}
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
