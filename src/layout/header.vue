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
                                <img :src="user.headimgurl">
                                <span>{{user.nickname}}</span>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :disabled="true">v2.0.0</el-dropdown-item>
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
import { mapState } from 'vuex'
export default {
    name: 'my-header',
    data() {
        return {
            breadcrumb: ''
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
        }
    },
    mounted() {
        this.getBreadcrumb()
    },
    methods: {
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
