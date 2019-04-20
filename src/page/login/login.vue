<template>
    <div id="login" :style="background">
        <div class="login-wrapper" style="background: #ffffff;border-style: solid; border-radius: 5px; border-width: 2px">
            <div class="title">Brain Science Lab</div>
            <el-form class="login-form" :model="form" @submit.native.prevent="verify">
                <el-form-item>
                    <!-- username -->
                    <el-input v-model="form.username" :placeholder="$t('login.account')" auto-complete='off' />
                    <span class="input-icon prepend-icon">
                        <i class="el-icon-my-user"></i>
                    </span>
                </el-form-item>
                <el-form-item :hidden="form.username === 'public'">
                    <!-- password -->
                    <el-input v-model="form.password" :placeholder="$t('login.password')" auto-complete='off' :type="pwdWatch ? 'text' : 'password'" />
                    <span class="input-icon prepend-icon">
                        <i class="el-icon-my-lock"></i>
                    </span>
                    <span class="input-icon append-icon" @click="pwdWatch = !pwdWatch">
                        <i :class="pwdWatch ? 'el-icon-my-openEye' : 'el-icon-my-closeEye'"></i>
                    </span>
                </el-form-item>
                <!-- submit -->
                <el-input v-if="form.username === 'public'" class="login_btn" type="submit" :value="transform('playground')" />
                <div v-else align="end"><el-button native-type="submit" round>{{ transform('login') }}</el-button><el-button @click="signon" type="primary" round>{{ transform('signup') }}</el-button></div>
            </el-form>
        </div>

    </div>
</template>
<script>
/* eslint-disable */
import cache from "../../utils/cache";

export default {
    name: 'login',
    data() {
        return {
            background: {
                backgroundImage: 'url(' + require('@/assets/img/background.jpg') + ')',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.7
            },
            form: {
                username: 'public',
                password: ''
            },
            pwdWatch: false
        }
    },
    methods: {
        verify() {
            if (this.form.username === 'public'){
                this.$store.commit('SET_USER', {
                    nickname: 'public',
                    headimgurl: 'https://avatars1.githubusercontent.com/u/25951301?s=40&v=4',
                    role: 'admin'
                })
                this.$message.info('you are not login yet')
                this.$route.query.redirect ? this.$router.push(this.$route.query.redirect) : this.$router.push('/')
                return;
            }
            if (!this.form.username) {
                this.$message.error('请输入账号')
            } else if (!this.form.password) {
                this.$message.error('请输入密码')
            } else {
                this.login()
            }
        },
        login() {
            this.$axios.post('/login-test', this.form, {
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                }
            }).then((res) => {
                this.$store.commit('SET_USER', {
                    nickname: res.data.data.name,
                    headimgurl: res.data.data.avatar
                })
                cache.setToken(res.data.data.token)
                this.$message.success(res.data.message)
                sessionStorage.removeItem('gretnaState')
                this.$route.query.redirect ? this.$router.push(this.$route.query.redirect) : this.$router.push('/')
            }).catch((err) => {
                console.log(err)
                this.$message.error('账号或密码错误')
            })
        },
        signon() {
            this.$router.push('/signup')
        },
        transform(key) {
            return this.$t('login.' + key)
        }
    }
}
</script>
<style lang='stylus'>
#login {
    position: relative;
    width: 100%;
    height: 100vh;
    /*background: #464c5b;*/
    background: #ffffff;
    overflow: hidden;
    .login-wrapper {
        position: absolute;
        width: 520px;
        left: 0;
        right: 0;
        margin: 150px auto;
        padding: 30px;
        .title {
            display: block;
            font-size: 26px;
            font-weight: 400;
            /*color: #eee;*/
            color: #3a8ee6;
            margin: 0px auto 50px;
            text-align: center;
            font-weight: bold;
        }
        .login-form {
            .el-input__inner {
                padding: 0 36px 0 40px;
                height: 44px;
                line-height: 44px;
            }
            .input-icon {
                position: absolute;
                top: 0;
                font-size: 16px;
                user-select: none;
                cursor: pointer;
                padding: 0 10px;
                text-align: center;
                height: 100%;
                display: flex;
                align-items: center;
                &.prepend-icon {
                    left: 0;
                }
                &.append-icon {
                    right: 0;
                }
            }
            .login_btn {
                input {
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                }
                &:hover {
                    input {
                        color: $blackColor;
                    }
                }
            }
        }
    }
}
</style>
