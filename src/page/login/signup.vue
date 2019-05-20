<template>
    <div id="signup" :style="background">
        <div class="signup-wrapper" style="background: #ffffff;border-style: solid; border-radius: 5px; border-width: 2px">
            <div class="title">Brain Science Lab</div>
            <el-form class="signup-form" :rules="rules" :model="form" ref="form" @submit.native.prevent="verify">
                <el-form-item prop="username">
                    <!-- username -->
                    <el-input v-model="form.username" placeholder="Account" auto-complete='off' />
                    <span class="input-icon prepend-icon">
                        <i class="el-icon-my-user"></i>
                    </span>
                </el-form-item>
                <el-form-item prop="name">
                    <!-- nickname -->
                    <el-input v-model="form.name" placeholder="Nickname" auto-complete='off'/>
                    <span class="input-icon prepend-icon">
                        <i class="el-icon-my-user"></i>
                    </span>
                </el-form-item>
                <el-form-item prop="password">
                    <!-- password -->
                    <el-input v-model="form.password" placeholder="Password" auto-complete='off' :type="pwdWatch ? 'text' : 'password'" />
                    <span class="input-icon prepend-icon">
                        <i class="el-icon-my-lock"></i>
                    </span>
                </el-form-item>
                <el-form-item prop="repeat_password">
                    <!-- repeat password -->
                    <el-input v-model="form.repeat_password" placeholder="Repeat Password" auto-complete='off' :type="pwdWatch ? 'text' : 'password'" />
                    <span class="input-icon prepend-icon">
                        <i class="el-icon-my-lock"></i>
                    </span>
                </el-form-item>
                <!--<el-form-item>-->
                    <!--&lt;!&ndash; phone &ndash;&gt;-->
                    <!--<el-input v-model="form.phone" placeholder="phone" auto-complete='off'/>-->
                <!--</el-form-item>-->
                <el-form-item prop="email">
                    <!-- E mail -->
                    <el-input v-model="form.email" placeholder="E-mail" auto-complete='off'/>
                    <button @click="verifyMail" class="code-btn" :disabled="!show">
                        <span :hidden="isOvertime" @click="verifyMail">{{$t('login.verifyCode')}}</span>
                        <span v-show="isOvertime" class="count">{{OvertimeText}}</span>
                    </button>
                </el-form-item>
                <el-form-item prop="verifyCode">
                    <!-- verify -->
                    <el-input v-model="form.verifyCode" placeholder="Verify code from E-mail" auto-complete='off'/>
                </el-form-item>
                <el-form-item prop="institution">
                    <!-- institution -->
                    <el-input v-model="form.institution" placeholder="Institution" auto-complete='off'/>
                </el-form-item>
                <!--<el-form-item>-->
                    <!--&lt;!&ndash; QQ &ndash;&gt;-->
                    <!--<el-input v-model="form.qq" placeholder="QQ" auto-complete='off'/>-->
                <!--</el-form-item>-->
                <el-form-item>
                    <!-- avatar -->
                    <!--<el-button v-if="form.avatar === ''" type="primary" @click="toggleShow" round> Set Avatar</el-button>-->
                    <el-row type="flex" justify="center">
                        <img v-if="form.avatar === ''" src="../../assets/img/avatar.png" :width="100" :height="100" @click="toggleShow"/>
                        <img v-else :src="form.avatar" @click="toggleShow">
                    </el-row>
                    <my-upload field="img"
                               @crop-success="cropSuccess"
                               @crop-upload-success="cropUploadSuccess"
                               @crop-upload-fail="cropUploadFail"
                               v-model="show"
                               :width="100"
                               :height="100"
                               :params="params"
                               :headers="headers"
                               :withCredentials="true"
                               img-format="png"></my-upload>
                </el-form-item>
                <!-- submit -->
                <el-input class="signup_btn" type="submit" :value="transform('signup')" />
            </el-form>
        </div>

    </div>
</template>
<script>
    /* eslint-disable */
    import cache from "../../utils/cache";
    import myUpload from 'vue-image-crop-upload'
    export default {
        name: 'signup',
        components: {myUpload},
        data() {
            return {
                isOvertime: false,
                OvertimeText: '',
                background: {
                    backgroundImage: 'url(' + require('@/assets/img/background.jpg') + ')',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.7
                },
                form: {
                    username: '',
                    name: '',
                    password: '',
                    repeat_password: '',
                    phone: '',
                    email: '',
                    institution: '',
                    verifyCode: '',
                    qq: '',
                    avatar: ''
                },
                rules: {
                    username: [
                        { required: true, message: 'please set your account', trigger: 'blur' },
                        { min: 3, message: 'No less than 3 characters', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: 'please set your nickname', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'please set your password', trigger: 'blur' },
                        { min: 6, message: 'No less than 6 characters', trigger: 'change' }
                    ],
                    repeat_password: [
                        { required: true, validator: (rule, value, callback) => {
                                if (value === '') {
                                    callback(new Error('please repeat your password'))
                                } else if (value !== this.form.password) {
                                    callback(new Error('两次输入密码不一致!'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'blur' }
                    ],
                    verifyCode: [
                        { required: true, message: 'please input verifyCode', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: 'please input your e-mail', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'change' }
                    ],
                    institution: [
                        { required: true, message: 'please input your institution', trigger: 'blur' }
                    ]
                },
                pwdWatch: false,
                show: false,
                params: {
                    token: '123456798',
                    name: 'avatar'
                },
                headers: {
                    smail: '*_~'
                }
            }
        },
        // mounted(){
        //     console.log(this.$i18n.locale)
        // },
        methods: {
            verify() {
                this.$refs['form'].validate((valid) => {
                    if (valid) this.signup()
                    else {
                        console.log('submit error!!');
                        return false;
                    }
                });
            },
            verifyMail() {
                if(!/@/.test(this.form.email)||this.isOvertime){
                    return false;
                }
                this.$axios.get('/verifyMail?email='+encodeURIComponent(this.form.email))
                    .then(()=>{
                        let that = this,
                            time = 60;
                        let sendTimer = setInterval(function(){
                            that.isOvertime = true;
                            time--;
                            if (that.$i18n.locale === 'zh') that.OvertimeText = "重新发送"+time;
                            else that.OvertimeText = "Re Send "+time+"s";
                            if(time < 0){
                                that.isOvertime = false;
                                clearInterval(sendTimer);
                                that.OvertimeText = '';
                            }
                        },1000)
                    })
            },
            signup() {
                delete this.form.repeat_password
                this.$axios.post('/signup', this.form, {
                    headers: {
                        'Content-type': 'application/json;charset=UTF-8'
                    }
                }).then((res) => {
                    if (res.data.status !== 0) return;
                    this.$store.state.user = {
                        nickname: res.data.data.name,
                        avatar: res.data.data.avatar
                    }
                    cache.setToken(res.token)
                    this.$message.success(res.data.message)
                    sessionStorage.removeItem('gretnaState')
                    this.$router.push('/')
                }).catch((err) => {
                    console.log(err)
                    this.$message.error('注册失败')
                })
            },
            transform(key) {
                return this.$t('login.' + key)
            },
            toggleShow() {
                this.show = !this.show;
            },
            /**
             * crop success
             *
             * [param] imgDataUrl
             * [param] field
             */
            cropSuccess(imgDataUrl, field){
                console.log('-------- crop success --------');
                this.form.avatar = imgDataUrl;
                // console.log(imgDataUrl)
            },
            /**
             * upload success
             *
             * [param] jsonData   服务器返回数据，已进行json转码
             * [param] field
             */
            cropUploadSuccess(jsonData, field){
                console.log('-------- upload success --------');
                console.log(jsonData);
                console.log('field: ' + field);
            },
            /**
             * upload fail
             *
             * [param] status    server api return error status, like 500
             * [param] field
             */
            cropUploadFail(status, field){
                console.log('-------- upload fail --------');
                console.log(status);
                console.log('field: ' + field);
            }
        }
    }
</script>
<style lang='stylus'>
    .code-btn {
        width: 100px;
        height: 24px;
        position: absolute;
        top: 10px;
        right: 5px;
        z-index: 222;
        color: #F5A623;
        font-size: 14px;
        border: none;
        border-left: 1px solid #bababa;
        padding-left: 10px;
        background-color: #fff;
    }
    #signup {
        position: relative;
        width: 100%;
        height: 200vh;
        /*background: #464c5b;*/
        background: #ffffff;
        overflow: hidden;
        .signup-wrapper {
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
            .signup-form {
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
                .signup_btn {
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
