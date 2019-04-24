/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import i18n from '@/language'
import cache from '@/utils/cache'
import { getLogin, getUser, signOn } from '@/api'
import * as ElementUI from "element-ui";


Vue.use(Vuex)

const state = {
    logs: [], // 错误日志
    user: '', // 用户信息{headimgurl,nickname}
    language: 'en',
    bnOption: { sflag: false, lflag: false, allMaterial: {} },
    netAnalysis: {
        state: 'finish',
        time: 0,
    },
    fmri: {
        state: 'fail',
        time: 0,
        outputText: ''
    },
    smri: {
        state: 'fail',
        time: 0,
        outputText: ''
    },
    outputText: ''
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
    },
    appendTBPO(state, payload) {
        console.log("in store, append tbpo");
        state.toBePoppedOut.push(payload);
    },
    updateNotificationSimplified(state, payload) {
        state.notificationTableDataSimplified = payload;
    },
    updateSysMsgSimplified(state, payload) {
        state.sysMsgData = payload;
    },
    pushFrontSysMsgItem(state, payload) {
        if (state.sysMsgData.sysMsgItems.length === 6) {
            state.sysMsgData.moreUnread = state.sysMsgData.moreUnread || state.sysMsgData.sysMsgItems[5].unread;
            state.sysMsgData.sysMsgItems.splice(5, 1); // 弹出尾部
        }
        state.sysMsgData.sysMsgItems.splice(0, 0, payload); // 插入头部
    },
    popFrontTBPO(state) {
        state.toBePoppedOut.splice(0, 1);
    },
    changeMonitorBrowsingStatus(state, payload) {
        state.monitorBrowsingStatus = payload;
        sessionStorage.setItem('monitorBrowsingStatus', payload);
    },
    pushMatlabOutput(state, text) {
        state.outputText = text
    },
    pushfMRIOutput(state, text) {
        state.fmri.outputText = text
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
