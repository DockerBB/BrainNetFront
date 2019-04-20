<template>
    <el-header id="header" height="50px">
        <div class="container">
            <div class="header-left">
                <el-breadcrumb class="header-breadcrumb">
                    <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index" :to="item.path">{{item.meta.title || $t('routes.' + item.name) }}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="header-right">
                <!-- i18n -->
                <div class="right-item">
                    <el-dropdown placement="top-end" @command="onLanguageSelected">
                        <div class="i18n">
                            <span>{{$t('translations')}}</span>
                            <i class="el-icon-caret-bottom"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="zh" :disabled="language === 'zh'">中文</el-dropdown-item>
                            <el-dropdown-item command="en" :disabled="language === 'en'">English</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="right-item">
                    <div class="user" v-if="user">
                        <el-dropdown placement="top-end" @command="onUserSelected">
                            <div class="user-info">
                                <img v-if="user.headimgurl === ''" src="../assets/img/avatar.png">
                                <img v-else :src="user.headimgurl">
                                <span>{{user.nickname}}</span>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <!--<el-dropdown-item :disabled="true">v2.0.0</el-dropdown-item>-->
                                <el-dropdown-item>Mission State</el-dropdown-item>
                                <el-dropdown-item style="text-align: center"><i :style="'color: '+netAnalysisColor" class="iconfont icon-fenxi"></i>{{formatSeconds($store.state.netAnalysis)}}</el-dropdown-item>
                                <el-dropdown-item style="text-align: center"><i :style="'color: '+cpacColor" class="iconfont icon-timeSeries"></i>{{formatSeconds($store.state.fmri)}}</el-dropdown-item>
                                <!--<el-dropdown-item style="text-align: center"><i style="color: #5daf34;" class="iconfont icon-fenxi"></i></el-dropdown-item>-->
                                <el-dropdown-item divided command="exit">{{ $t('logOut') }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </div>
    </el-header>
</template>
<script>
/* eslint-disable */
import { mapState } from 'vuex'
export default {
    name: 'my-header',
    data() {
        return {
            breadcrumb: '',
            netAnalysisColor: 'black',
            cpacColor: 'black',
            imgUrl:require('../assets/img/avatar.png'),
            time: 0
        }
    },
    computed: {
        ...mapState([
            'user',
            'language'
        ])
    },
    watch: {
        $route() {
            this.getBreadcrumb()
        },
        '$store.state.netAnalysis.state': function (){
            const netAnalysis = this.$store.state.netAnalysis
            let state = netAnalysis.state
            if (state === 'finish')
                this.netAnalysisColor = 'black'
            else if (state === 'submitted' ) this.netAnalysisColor = 'orange'
            else if (state === 'running' ) {
                this.netAnalysisColor = '#5daf34'
                let sendTimer = setInterval(function(){
                    netAnalysis.time++;
                    if(netAnalysis.state !== 'running'){
                        clearInterval(sendTimer);
                    }
                },1000)
            }
        },
        '$store.state.cpac.state': function (){
            const cpac = this.$store.state.cpac
            let state = cpac.state
            // console.log(state)
            if (state === 'finish'||state === 'error')
                this.cpacColor = 'black'
            else if (state === 'submitted' ) this.cpacColor = 'orange'
            else if (state === 'running' ) {
                this.cpacColor = '#5daf34'
                let sendTimer = setInterval(function(){
                    cpac.time++;
                    if(cpac.state !== 'running'){
                        clearInterval(sendTimer);
                    }
                },1000)
            }
        }
    },
    mounted() {
        this.getBreadcrumb()
        // console.log(this.user.headimgurl)
        window.addEventListener('unload', this.saveState)
        let temp = sessionStorage.getItem('gretna')
        if (temp != null) {
            temp = JSON.parse(temp)
            // console.log(temp)
            this.$store.state.netAnalysis.time = temp.time
            this.$store.state.netAnalysis.state = temp.state
        }
        temp = sessionStorage.getItem('fmri')
        if (temp != null) {
            temp = JSON.parse(temp)
            // console.log(temp)
            this.$store.state.fmri.time = temp.time
            this.$store.state.fmri.state = temp.state
        }
    },
    methods: {
        saveState(){
            let netAnalysis = this.$store.state.netAnalysis
            let fmri = this.$store.state.fmri
            sessionStorage.setItem('gretna',  JSON.stringify({
                state:netAnalysis.state,
                time:netAnalysis.time
            }))
            sessionStorage.setItem('fmri',  JSON.stringify({
                state:fmri.state,
                time:fmri.time
            }))
        },
        formatSeconds(item) {
            let value = item.time
            if (item.state !== 'running' ) return ''
            let secondTime = parseInt(value);// 秒
            let minuteTime = 0;// 分
            let hourTime = 0;// 小时
            if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
                //获取分钟，除以60取整数，得到整数分钟
                minuteTime = parseInt(secondTime / 60);
                //获取秒数，秒数取佘，得到整数秒数
                secondTime = parseInt(secondTime % 60);
                //如果分钟大于60，将分钟转换成小时
                if(minuteTime > 60) {
                    //获取小时，获取分钟除以60，得到整数小时
                    hourTime = parseInt(minuteTime / 60);
                    //获取小时后取佘的分，获取分钟除以60取佘的分
                    minuteTime = parseInt(minuteTime % 60);
                }
            }
            let result = "" + parseInt(secondTime) + "s";

            if(minuteTime > 0) {
                result = "" + parseInt(minuteTime) + "m" + result;
            }
            if(hourTime > 0) {
                result = "" + parseInt(hourTime) + "h" + result;
            }
            return result;
        },
        onLanguageSelected(val) {
            this.$store.commit('set_language', val)
            if (val === 'zh') {
                this.$message.success('语言切换成功')
            } else {
                this.$message.success('switch language success')
            }
        },
        onUserSelected(val) {
            if (val === 'exit') {
                this.$axios.post('/signout').then(res => {
                    this.$message.success(res.data.message)
                    this.$store.commit('SET_LOGOUT')
                    this.$router.push('/login')
                })
            }
        },
        getBreadcrumb() {
            this.breadcrumb = this.$route.matched.filter(item => item.name)
        }
    }
}
</script>
<style lang='stylus'>
$avatarSize = 30px;
#header {
    position: relative;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid $deepBorderColor;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    padding: 0 20px;
    z-index: 1;
    .container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .header-right {
            height: 100%;
            display: flex;
            align-items: center;
            .right-item {
                color: $normalTextColor;
                font-size: 20px;
                margin: 0 10px;
                cursor: pointer;
            }
            .user {
                .user-info {
                    img {
                        display: inline-block;
                        width: $avatarSize;
                        height: $avatarSize;
                        border-radius: 100%;
                        vertical-align: middle;
                        margin-right: 5px;
                    }
                }
            }
        }
    }
    .header-breadcrumb {
        font-size: 13px;
    }
}
</style>
