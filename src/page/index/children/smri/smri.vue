<template>
    <div>
        <el-form label-position="left" v-model="temporalFilteringOptions" label-width="280px">
            <h1>Create Task</h1>
            <el-form-item label="Task Name">
                <el-autocomplete :fetch-suggestions="querySearch" v-model="taskname" style="width: 300px"></el-autocomplete>
            </el-form-item>
            <el-form-item label="Drag and Drop File Uploading Zone">
                <div
                        v-loading="showuploading"
                        :element-loading-text="uploadmsg"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"
                        class="myCenter myupload"
                        style="float: left;"
                        @click="()=>showuploading = uploading"
                        :ref="'select_frame'">
                    <i class="el-icon-plus" style="font-size: 50px;color: #8cc5ff"></i>
                </div>
            </el-form-item>
        </el-form>
        <el-dialog title="sMRI REPORT" :visible.sync="runDialogTableVisible">
            <div style="white-space: pre-wrap;">
                <p v-html="smriTextarea"></p>
            </div>
        </el-dialog>
        <div style="text-align: center">
            <el-button type="primary" style="margin: 10px auto 0 auto;font-size: 1.5rem" @click="onSubmit">run</el-button>
            &nbsp;&nbsp;&nbsp;
            <el-button type="primary" style="margin: 10px auto 0 auto;font-size: 1.5rem" @click="onSubmitParallel">run parallel</el-button>
        </div>
        <!--<el-button type="primary" style="float: right" @click="downloadResult">download</el-button>-->
    </div>
</template>

<script>
    /* eslint-disable */
    import cache from "@/utils/cache"
    export default {
        name: "smri",
        data() {
            return {
                active: 0,
                uploading: false,
                showuploading: false,
                uploadmsg: '',
                taskList: [],
                filePathOptions: [],
                filePath: '',
                fileListType: '',
                setPathEle: [],
                taskname: '',
                smriTextarea: '',
                runDialogTableVisible: false
            }
        },
        mounted() {
            this.initUploadField();
            this.$axios.get('/getdirlist/smri').then(res => {
                let taskList = []
                res.data.data.forEach(v=>taskList.push({value:v.name}))
                this.taskList = taskList
                this.taskname = taskList.length === 0? 'task':taskList[0].value
            })
        },
        watch: {
            '$store.state.smri.smriState': function () {
                // console.log(this.$store.state.smri.smriState)
                if (this.$store.state.smri.smriState !== 'finish') return;
                this.$confirm('smri脚本运行结束，是否下载结果？', '确认信息', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '下载',
                    cancelButtonText: '否'
                }).then(()=>this.downloadResult())
                    .catch(()=>this.$message.info('运行结果可在home查看'))
            },
            '$store.state.smri.outputText': function () {
                this.runDialogTableVisible = true
                let line = this.$store.state.smri.outputText
                this.smriTextarea += '\n' + line
            }
        },
        methods: {
            onSubmit: function () {
                this.$axios.post('/find',['/smri/'+this.taskname+'/data'])
                    .then(res=>{
                        if(res.data.data[0].match(/-find\s(.+)/)[1] === 'success') return Promise.resolve();
                        else return Promise.reject()
                    }).then(() => {
                        let parameterList = {}
                        parameterList['smri'] = 'json'
                        // console.log(parameterList)
                        this.$axios.post('/smri/'+this.taskname+'/'+cache.getToken(), {jsonstr:JSON.stringify(parameterList)})
                            .then(res => this.$message({message: res.data.message, type: 'info'}))
                    }).catch(()=>this.$message({message: 'you have no upload data yet', type: 'info'}))
            },
            onSubmitParallel: function () {
                this.$axios.post('/find',['/smri/'+this.taskname+'/data'])
                    .then(res=>{
                        if(res.data.data[0].match(/-find\s(.+)/)[1] === 'success') return Promise.resolve();
                        else return Promise.reject()
                    }).then(() => {
                        let parameterList = {}
                        parameterList['smri'] = 'json'
                        // console.log(parameterList)
                        this.$axios.post('/smriParallel/'+this.taskname+'/'+cache.getToken(), {jsonstr:JSON.stringify(parameterList)})
                            .then(res => this.$message({message: res.data.message, type: 'info'}))
                    }).catch(()=>this.$message({message: 'you have no upload data yet', type: 'info'}))
            },
            downloadResult(){
                let url = '/MyFile/smri/'+this.taskname+'/working.zip'
                let link = document.createElement('a')
                link.download = this.taskname+'_working.zip'// 跨域状态（非同源）下无法用download属性设置下载文件名
                link.href = 'http:' + window.g.API_URL + url
                link.click()
            },
            querySearch(queryString, cb) {
                let restaurants = this.taskList;
                let results = queryString ? restaurants.filter(data => !queryString || data.value.toLowerCase().includes(queryString.toLowerCase())) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            initUploadField: function (item) {

                this.$refs.select_frame.ondragleave = (e) => {
                    e.preventDefault();  //阻止离开时的浏览器默认行为
                };
                this.$refs.select_frame.ondrop = (e) => {
                    e.preventDefault();    //阻止拖放后的浏览器默认行为
                    const self = this
                    if (self.uploading === true)return;
                    const list = []
                    let totalcount = 0
                    let uploadcount = 0
                    self.uploading=true
                    self.showuploading=true
                    // const uploadlog = this.$message({
                    //     message: '文件上传(0/0)',
                    //     type: 'info',
                    //     duration: 0
                    // })
                    function uploadFile() {
                        if (list.length === 0) {
                            // self.$message.success('upload success')
                            // uploadlog.close()
                            self.$axios.get('/getdirlist/smri').then(res => {
                                let taskList = []
                                res.data.data.forEach(v=>taskList.push({value:v.name}))
                                self.taskList = taskList
                            })
                            self.uploading=false
                            self.uploadmsg='文件上传成功，一共'+totalcount+'个文件'
                            self.$refs['select_frame'].setAttribute('element-loading-spinner','el-icon-success')
                            self.$refs['select_frame'].getElementsByClassName('el-loading-spinner')[0].getElementsByTagName('i')[0].setAttribute('class','el-icon-success')
                            // self.$refs['select_frame'].innerHTML = self.$refs['select_frame'].innerHTML.replace(/el-icon-loading/g, 'el-icon-success')
                            return;
                        }
                        let file = list.pop()
                        const formData = new FormData();
                        let name = file.fullPath === undefined ? file.name : file.fullPath;
                        name = self.taskname+'/data/'+name
                        formData.append('uploadfile', file, encodeURIComponent(name))
                        self.$axios.post('/uploadfiles/smri', formData, {
                            onUploadProgress (p){
                                // uploadlog.message='文件上传('+uploadcount+'/'+totalcount+')  '+Math.ceil(100 * ( p.loaded / p.total ))+'%'
                                self.uploadmsg='文件上传('+uploadcount+'/'+totalcount+')  '+Math.ceil(100 * ( p.loaded / p.total ))+'%'
                            }
                        }).then(res=>{uploadcount++;self.uploadmsg='文件上传('+uploadcount+'/'+totalcount+')';uploadFile()})
                            .catch(err=>{
                                self.$message.warning(err);
                                // self.$refs['select_frame'].innerHTML = self.$refs['select_frame'].innerHTML.replace(/el-icon-loading/g, 'el-icon-error')
                                self.$refs['select_frame'].setAttribute('element-loading-spinner','el-icon-error')
                                self.$refs['select_frame'].getElementsByClassName('el-loading-spinner')[0].getElementsByTagName('i')[0].setAttribute('class','el-icon-error')
                                self.uploadmsg='文件上传失败';
                            })
                            // .catch(err=>console.log(err))
                    }
                    function addFile(file) {
                        if (file.size > 157286400) {
                            self.uploading=false
                            self.$refs['select_frame'].setAttribute('element-loading-spinner','el-icon-error')
                            self.$refs['select_frame'].getElementsByClassName('el-loading-spinner')[0].getElementsByTagName('i')[0].setAttribute('class','el-icon-error')
                            self.uploadmsg='文件上传失败, 存在数据文件大小大于150M'
                            console.error('文件上传失败, 文件'+file.fullPath+'大小大于150M')
                            return;
                        }
                        if (!self.uploading) return;
                        let pathArr = file.fullPath.split('/')
                        if (pathArr[1] !== 'session_1'||pathArr[2] !== 'rest_1'&&pathArr[2] !== 'anat_1'){
                            self.uploading=false
                            self.$refs['select_frame'].setAttribute('element-loading-spinner','el-icon-error')
                            self.$refs['select_frame'].getElementsByClassName('el-loading-spinner')[0].getElementsByTagName('i')[0].setAttribute('class','el-icon-error')
                            self.uploadmsg='文件上传失败, 数据路径不正确'
                            return;
                        }else if (pathArr[2] === 'rest_1') return;
                        list.push(file)
                        totalcount++
                    }
                    function addFilesFormDirectory(directory, path) {
                        const dirReader = directory.createReader();
                        const readEntries = function readEntries() {
                            return dirReader.readEntries(function(entries) {
                                entries.forEach(function(entry){
                                    if (entry.isFile) {
                                        // 如果是文件
                                        entry.file(function(file){
                                            file.fullPath = path + '/' + file.name;
                                            addFile(file);
                                        });
                                    } else if (entry.isDirectory) {
                                        // 递归处理
                                        addFilesFormDirectory(entry, path + '/' + entry.name);
                                    }
                                });
                            });
                        };
                        return readEntries();
                    }
                    function addFilesItems(items) {
                        for (let i = 0; i < items.length; i++) {
                            let item = items[i];
                            let entry;
                            if (item.webkitGetAsEntry && (entry = item.webkitGetAsEntry())) {
                                if (entry.isFile) {
                                    addFile(item.getAsFile());
                                } else if (entry.isDirectory) {
                                    addFilesFormDirectory(entry, entry.name)
                                }
                            }
                        }
                    }
                    addFilesItems(e.dataTransfer.items)
                    let taskList = []
                    self.taskList.forEach(v=>taskList.push(v.value))
                    // console.log(self.taskList, taskList,self.taskname,taskList.indexOf(self.taskname)>-1)
                    if (taskList.indexOf(self.taskname)>-1) self.$confirm('任务已存在，是否删除原有任务中的数据和结果？', '确认信息', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '是',
                        cancelButtonText: '否'
                    }).then(()=> {
                        if (!self.uploading) return;
                        self.$axios.delete('/MyFile/smri/' + self.taskname)
                            .then(()=>{
                                self.$refs['select_frame'].setAttribute('element-loading-spinner','el-icon-loading')
                                self.$refs['select_frame'].getElementsByClassName('el-loading-spinner')[0].getElementsByTagName('i')[0].setAttribute('class','el-icon-loading')
                                self.uploadmsg='文件上传('+uploadcount+'/'+totalcount+')';uploadFile()
                            })
                    }).catch(()=>self.showuploading=false)
                    else setTimeout(function(){
                        if (!self.uploading) return;
                        self.$refs['select_frame'].setAttribute('element-loading-spinner','el-icon-loading')
                        self.$refs['select_frame'].getElementsByClassName('el-loading-spinner')[0].getElementsByTagName('i')[0].setAttribute('class','el-icon-loading')
                        self.uploadmsg='文件上传('+uploadcount+'/'+totalcount+')';uploadFile()
                    }, 1000);
                };
                this.$refs.select_frame.ondragenter = (e) => {
                    e.preventDefault();  //阻止拖入时的浏览器默认行为
                    this.$refs.select_frame.border = '2px dashed red';
                };
                this.$refs.select_frame.ondragover = (e) => {
                    e.preventDefault();    //阻止拖来拖去的浏览器默认行为
                };
            }
        }
    }
</script>

<style lang='stylus' scoped>
    .el-scrollbar__wrap{
        overflow-x: hidden;
    }
    .myCenter {
        display: -moz-box;/*兼容Firefox*/
        display: -webkit-box;/*兼容FSafari、Chrome*/

        -moz-box-align: center;/*兼容Firefox*/
        -webkit-box-align: center;/*兼容FSafari、Chrome */

        -moz-box-pack: center;/*兼容Firefox*/
        -webkit-box-pack: center;/*兼容FSafari、Chrome */
    }
    .myupload {
        width: 300px;
        height: 200px;
        border:3px dashed #8cc5ff;
    }
    .el-step__main {
        white-space: pre !important;
    }
</style>