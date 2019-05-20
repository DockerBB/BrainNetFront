<template>
    <div style="width: 100%">
        <el-tabs v-model="activeTab" type="card">
            <el-tab-pane label="DTI Preprocessing" name="DTI">
                <div style="width: 20%;height: 460px;float: left;">
                    <el-steps direction="vertical" :active="activeDTI" finish-status="wait" align-center>
                        <el-step title="Create Task" @click.native="()=>activeDTI = 0"></el-step>
                        <el-step title="Prepare B0" @click.native="()=>activeDTI = 1"></el-step>
                        <el-step title="Skull Remove" @click.native="()=>activeDTI = 2"></el-step>
                        <el-step title="Eddy Current Correction" @click.native="()=>activeDTI = 3"></el-step>
                        <el-step title="Gradient Correction" @click.native="()=>activeDTI = 4"></el-step>
                        <el-step title="Calculating DTI Measures(FA,MD,L1,L2,L3)" @click.native="()=>activeDTI = 5"></el-step>
                        <el-step title="Normalize To Target" @click.native="()=>activeDTI = 6"></el-step>
                        <el-step title="TBSS" @click.native="()=>activeDTI = 7"></el-step>
                        <el-step title="Atlas Statistics" @click.native="()=>activeDTI = 8"></el-step>
                        <el-step title="Fiber Tracking" @click.native="()=>activeDTI = 9"></el-step>
                    </el-steps>
                </div>
                <div style="height: 460px;width: 80%;float: right;overflow-y: scroll;">
                    <div style="min-height: 360px" v-if="activeDTI === 0">
                        <el-form label-position="left" label-width="280px">
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
                    </div>
                    <div style="min-height: 360px" v-else-if="activeDTI === 1">
                        0
                    </div>
                    <div style="min-height: 360px" v-else-if="activeDTI === 2">
                        <el-form label-position="left" v-model="skullRemove" label-width="180px">
                            <h1>Skull Remove</h1>
                            <el-form-item label="fractional intensity">
                                <el-input v-model="skullRemove.fractionalIntensity" style="width: 100px"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="min-height: 360px" v-else-if="activeDTI === 3">
                        2
                    </div>
                    <div style="min-height: 360px" v-else-if="activeDTI === 4">
                        3
                    </div>
                    <div style="min-height: 360px" v-else-if="activeDTI === 5">
                        4
                    </div>
                    <div style="min-height: 360px" v-else-if="activeDTI === 6">
                        <el-form label-position="left" v-model="normalizeToTarget" label-width="280px">
                            <h1>Normalize To Target</h1>
                            <el-form-item label="registration">
                                <el-select v-model="normalizeToTarget.registration">
                                    <el-option label="fsl" value="fsl"></el-option>
                                    <el-option label="ants" value="ants"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="FA_template">
                                <el-input v-model="normalizeToTarget.FA_template" style="max-width: 500px" readonly>
                                    <i class="iconfont icon-dir" slot="append" @click="setFileList(['normalizeToTarget','FA_template'], 'template')"></i>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="min-height: 360px" v-else-if="activeDTI === 7">
                        <el-form label-position="left" v-model="tbss" label-width="180px">
                            <h1>TBSS</h1>
                            <el-form-item label="Applying TBSS">
                                <el-select v-model="tbss.applyingtbss">
                                    <el-option label="off" value="off"></el-option>
                                    <el-option label="on" value="on"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Skeleton_cutoff">
                                <el-input v-model="tbss.skeletoncutoff" style="width: 100px"></el-input>
                            </el-form-item>
                            <el-form-item label="Run TBSSRandomise">
                                <el-select v-model="tbss.runtbssRandomise">
                                    <el-option label="off" value="off"></el-option>
                                    <el-option label="on" value="on"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="times">
                                <el-input v-model="tbss.times" style="width: 100px"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="min-height: 360px" v-else-if="activeDTI === 8">
                        <el-form label-position="left" v-model="atlasStatistics" label-width="180px">
                            <h1>Atlas Statistics</h1>
                            <el-form-item label="WM_Label_Atlas">
                                <el-input v-model="atlasStatistics.wmLabelAtlas" style="max-width: 550px" readonly>
                                    <i class="iconfont icon-dir" slot="append" @click="setFileList(['atlasStatistics','wmLabelAtlas'], 'atlas')"></i>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="WM_Probtract_Atlas">
                                <el-input v-model="atlasStatistics.wmProbtractAtlas" style="max-width: 550px" readonly>
                                    <i class="iconfont icon-dir" slot="append" @click="setFileList(['atlasStatistics','wmProbtractAtlas'], 'atlas')"></i>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="min-height: 360px" v-else-if="activeDTI === 9">
                        <el-form label-position="left" v-model="fiberTracking" label-width="230px">
                            <h1>Fiber Tracking</h1>
                            <el-form-item label="runDeterministicFiberTracking">
                                <el-select v-model="fiberTracking.runDeterministicFiberTracking">
                                    <el-option label="off" value="off"></el-option>
                                    <el-option label="on" value="on"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Propagetion_Algorithm">
                                <el-select v-model="fiberTracking.propagetionAlgorithm" @change="onPropagetionAlgorithmChange">
                                    <el-option label="FACT" value="FACT"></el-option>
                                    <el-option label="2nd-order Runge-Kutta" value="2nd-order Runge-Kutta"></el-option>
                                    <el-option label="Interpolated Streamline" value="Interpolated Streamline"></el-option>
                                    <el-option label="Tensorline" value="Tensorline"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="FA_mask_Threshold">
                                <el-input v-model="fiberTracking.FA_mask_Threshold[0]" style="width: 50px;margin-right: 20px"></el-input>
                                <el-input v-model="fiberTracking.FA_mask_Threshold[1]" style="width: 50px"></el-input>
                            </el-form-item>
                            <el-form-item label="Angle_Threshold">
                                <el-input v-model="fiberTracking.Angle_Threshold" style="width: 100px;"></el-input>
                            </el-form-item>
                            <el-form-item label="Step_Length">
                                <el-input v-model="fiberTracking.Step_Length" style="width: 100px;"></el-input>
                            </el-form-item>
                            <el-form-item label="Apply_Random_seed">
                                <el-select v-model="fiberTracking.Apply_Random_seed">
                                    <el-option label="off" value="off"></el-option>
                                    <el-option label="on" value="on"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Random_seed">
                                <el-input v-model="fiberTracking.Random_seed" style="width: 100px;"></el-input>
                            </el-form-item>
                            <el-form-item label="Orientation patch">
                                <el-select v-model="fiberTracking.orientationPatchInvertOption">
                                    <el-option label="No Inversion" value="No Inversion"></el-option>
                                    <el-option label="Invert X" value="Invert X"></el-option>
                                    <el-option label="Invert Y" value="Invert Y"></el-option>
                                    <el-option label="Invert Z" value="Invert Z"></el-option>
                                </el-select>
                                <el-select v-model="fiberTracking.orientationPatchSwapOption">
                                    <el-option label="No Swap" value="No Swap"></el-option>
                                    <el-option label="Swap X/Y" value="Swap X/Y"></el-option>
                                    <el-option label="Swap Y/Z" value="Swap Y/Z"></el-option>
                                    <el-option label="Swap Z/X" value="Swap Z/X"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Apply Spline Filter">
                                <el-select v-model="fiberTracking.applySplineFilter">
                                    <el-option label="on" value="on"></el-option>
                                    <el-option label="off" value="off"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-row type="flex" justify="center" align="center" style="width: 100%">
                        <el-button type="primary" style="font-size: 1.5rem" @click="onDTIsubmit">run</el-button>
                    </el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane label="TBSS Result display" name="TBSS" style="justify-content: space-around;">
                <el-row type="flex" justify="center" align="center">
                    <el-form label-position="left" v-model="tbssResultDisplay" label-width="180px">
                        <h1>TBSS Result display</h1>
                        <el-form-item label="Task">
                            <!--<el-input v-model="tbssResultDisplay.task" style="width: 100px"></el-input>-->
                            <!--<el-autocomplete :fetch-suggestions="querySearch" v-model="taskname" style="width: 300px"></el-autocomplete>-->
                            <el-select v-model="tbssname" @focus="gettbssList">
                                <el-option v-for="item in tbssList" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="p_map">
                            <el-select v-model="tbssResultDisplay.p_map">
                                <el-option label="tbss_tfce_corrp_stat1" value="tbss_tfce_corrp_stat1"></el-option>
                                <el-option label="tbss_tfce_corrp_stat2" value="tbss_tfce_corrp_stat2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="4D_skeleton">
                            <el-select v-model="tbssResultDisplay._4D_skeleton">
                                <el-option label="FA" value="FA"></el-option>
                                <el-option label="MD" value="MD"></el-option>
                                <el-option label="L1" value="L1"></el-option>
                                <el-option label="L2" value="L2"></el-option>
                                <el-option label="L3" value="L3"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <fsl-view ref="fslView" style="margin-left: 20px;"></fsl-view>
                </el-row>
                <el-row type="flex" justify="center" align="center">
                    <el-button type="primary" style="font-size: 1.5rem;margin-top:60px" @click="onTBSSsubmit">Display Result</el-button>
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :title=" dialogTitle " :visible.sync="dialogTableVisible" :modal-append-to-body="false">
            <el-tree
                    :data="dialogData"
                    node-key="id"
                    :expand-on-click-node="true"
                    :modal-append-to-body='false'>
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span v-if="data.children === undefined" @click="() => setFile(node)"><img src="@/assets/img/wendang.png" height="16" width="16"/>{{ node.label }}</span>
                    <span v-else><img src="@/assets/img/wenjianjia.png" height="16" width="16"/>{{ node.label }}</span>
                </span>
            </el-tree>
            <span slot="footer">
                <!--<el-button>从本地导入</el-button>-->
                <el-button @click="dialogTableVisible = false">取 消</el-button>
            </span>
        </el-dialog >
    </div>
</template>

<script>
    /* eslint-disable */
    import cache from "@/utils/cache"
    import fslView from "./fslView"
    import { dti_templates, dti_atlases } from '../data-index'
    export default {
        name: 'dti',
        components: {fslView},
        data() {
            return {
                activeTab: 'DTI',
                activeDTI: 0,
                activeTBSS: 0,
                taskname: '',
                tbssname: '',
                showuploading: false,
                uploading: false,
                uploadmsg: '上传',
                taskList: [],
                tbssList: [],
                skullRemove: {
                    fractionalIntensity: 0.3
                },
                normalizeToTarget: {
                    registration: 'fsl',
                    FA_template: '/public/DTI/Templates/FMRIB58_FA_1mm.nii.gz'
                },
                tbss: {
                    applyingtbss: 'off',
                    skeletoncutoff: 0.2,
                    runtbssRandomise: 'off',
                    times: 5000
                },
                atlasStatistics: {
                    wmLabelAtlas: '/public/DTI/atlases/JHU/JHU-ICBM-labels-1mm.nii.gz',
                    wmProbtractAtlas: '/public/DTI/atlases/JHU/JHU-ICBM-tracts-maxprob-thr25-1mm.nii.gz'
                },
                fiberTracking: {
                  runDeterministicFiberTracking: 'off',
                  propagetionAlgorithm: 'FACT',
                  FA_mask_Threshold: ['0.2','1'],
                  Angle_Threshold: '35',
                  Step_Length: '0',
                  Apply_Random_seed: 'off',
                  Random_seed: '1',
                  orientationPatchInvertOption: 'No Inversion',
                  orientationPatchSwapOption: 'No Swap',
                  applySplineFilter: 'on'
                },
                tbssResultDisplay: {
                    p_map: 'tbss_tfce_corrp_stat1',
                    _4D_skeleton: 'FA'
                },
                dialogTitle: '',
                dialogTableVisible: false,
                dialogData: [],
                setPathEle: [],
                fileListType: '',
            }
        },
        mounted() {
            this.initUploadField()
            this.$axios.get('/getdirlist/dti').then(res => {
                let taskList = []
                res.data.data.forEach(v=>taskList.push({value:v.name}))
                this.taskList = taskList
                this.taskname = taskList.length === 0? 'default_task':taskList[0].value
            })
        },
        methods: {
            onDTIsubmit: function () {
                this.$axios.get('/getdirlist/dti/'+this.taskname+'/data').then(res=>{
                    let data = res.data.data
                    if(data.length === 0) return Promise.reject('you have no upload DTI data yet')
                    if (this.tbss.applyingtbss === 'on' && this.tbss.runtbssRandomise === 'on'){
                        let flag1 = data.filter(d=>!/^con_sub|^pat_sub/.test(d.name)).length !== 0
                        let flag2 = data.filter(d=>/^con_sub/.test(d.name)).length !== 0 && data.filter(d=>/^pat_sub/.test(d.name)).length !== 0
                        if(flag1) return Promise.reject('The name of subject dir should have prefix like "con" or "pat" since applying TBSS')
                        if(!flag2) return Promise.reject('There is only one type data')
                    }
                    return Promise.resolve()
                }).then(() => {
                    let parameterList = {}
                    parameterList['skull_f'] = this.skullRemove.fractionalIntensity.toString()
                    parameterList['registration'] = this.normalizeToTarget.registration
                    parameterList['template'] = this.normalizeToTarget.FA_template
                    parameterList['apply_tbss'] = this.tbss.applyingtbss === 'on'
                    parameterList['skeleton_cutoff'] = this.tbss.skeletoncutoff.toString()
                    parameterList['runRandomise'] = this.tbss.runtbssRandomise === 'on'
                    parameterList['times'] = this.tbss.times.toString()
                    parameterList['wm_label_atlas'] = this.atlasStatistics.wmLabelAtlas
                    parameterList['wm_tract_atlas'] = this.atlasStatistics.wmProbtractAtlas
                    parameterList['runTracking'] = this.fiberTracking.runDeterministicFiberTracking === 'on'
                    parameterList['track_method'] = this.fiberTracking.propagetionAlgorithm
                    parameterList['famask_thres'] = this.fiberTracking.FA_mask_Threshold.map(d=>parseFloat(d))
                    parameterList['angle_thres'] = this.fiberTracking.Angle_Threshold
                    parameterList['step_length'] = this.fiberTracking.Step_Length
                    parameterList['apply_random'] = this.fiberTracking.Apply_Random_seed === 'on'
                    parameterList['random_seed'] = this.fiberTracking.Random_seed
                    parameterList['invert_flag'] = this.fiberTracking.orientationPatchInvertOption
                    parameterList['swap_flag'] = this.fiberTracking.orientationPatchSwapOption
                    parameterList['apply_spline_filter'] = this.fiberTracking.applySplineFilter === 'on'
                    // console.log(parameterList)
                    this.$axios.post('/dti/'+this.taskname+'/'+cache.getToken(), {jsonstr:JSON.stringify(parameterList)})
                        .then(res => this.$message({message: res.data.message, type: 'info'}))
                }).catch(err=>this.$message({message: err, type: 'warning'}))
            },
            onTBSSsubmit: function () {
                if (this.tbssname === '') {
                    this.$message({message: 'please select Task', type: 'warning'})
                    return;
                }
                this.$refs.fslView.loadAllImage(
                    '/MyFile/dti/'+this.tbssname+'/working_dwi/TBSS/MeanData/mean_FA.nii.gz',
                    '/MyFile/dti/'+this.tbssname+'/working_dwi/TBSS/MeanData/mean_FA_skeleton.nii.gz',
                    '/MyFile/dti/'+this.tbssname+'/working_dwi/TBSS/TBSS_Randomise/FA/tbss_tfce_corrp_tstat1_tbssfill.nii.gz'
                )
                // this.$axios.post('/find',['/dti/'+this.tbssname+'/working_dwi/TBSS/TBSS_Randomise']).then(res=>{
                //         if(res.data.data[0].match(/-find\s(.+)/)[1] === 'success') return Promise.resolve();
                //         else return Promise.reject('This task does not exist TBSS_Randomise, there is no TFCE p-value images')
                //     }).then(() => {
                //     let parameterList = {}
                //     parameterList['task'] = '%s'
                //     parameterList['p_map'] = this.tbssResultDisplay.p_map
                //     parameterList['4d_skeleton'] = this.tbssResultDisplay._4D_skeleton
                //     // console.log(parameterList)
                //     this.$axios.post('/tbss/'+this.tbssname+'/'+cache.getToken(), {jsonstr:JSON.stringify(parameterList)})
                //         .then(res => this.$message({message: res.data.message, type: 'info'}))
                // }).catch(err=>this.$message({message: err, type: 'warning'}))
            },
            onPropagetionAlgorithmChange(){
                const op = this.fiberTracking.propagetionAlgorithm
                switch (op){
                    case 'FACT': this.fiberTracking.Step_Length = '0'; break;
                    case '2nd-order Runge-Kutta': this.fiberTracking.Step_Length = '0.1'; break;
                    case 'Interpolated Streamline': this.fiberTracking.Step_Length = '0.5'; break;
                    case 'Tensorline': this.fiberTracking.Step_Length = '0.1'; break;
                    default:
                        break;
                }
            },
            querySearch(queryString, cb) {
                let restaurants = this.taskList;
                let results = queryString ? restaurants.filter(data => !queryString || data.value.toLowerCase().includes(queryString.toLowerCase())) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            setFileList: function (ele, fileList) {
                this.setPathEle = ele
                this.fileListType = fileList
                if (fileList === 'template')  this.dialogData = dti_templates
                else if (fileList === 'atlas')  this.dialogData = dti_atlases
                this.dialogTableVisible = true
            },
            setFile(node){
                let url;
                if (this.fileListType === 'template')  url = '/public/DTI/Templates/'+node.data.label;
                else if (this.fileListType === 'atlas')  url = node.parent.data.url + '/' + node.data.label;
                let p = this
                for (let i = 0; i < this.setPathEle.length - 1; i++) p = p[this.setPathEle[i]]
                p[this.setPathEle[this.setPathEle.length - 1]] = url
                this.dialogTableVisible = false
            },
            gettbssList: function () {
                let findlist = []
                this.taskList.forEach(v=>findlist.push('/dti/'+v.value+'/working_dwi/TBSS/TBSS_Randomise'))
                this.tbssList = []
                this.$axios.post('/find',findlist).then(res=>{
                    res.data.data.forEach(v=>{
                        if(v.match(/-find\s(.+)/)[1] === 'success') this.tbssList.push(v.match(/\/dti\/(\w+)\/working_dwi/)[1])
                    })
                })
            },
            initUploadField: function () {
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
                            self.$axios.get('/getdirlist/dti').then(res => {
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
                        self.$axios.post('/uploadfiles/dti', formData, {
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
                        if (pathArr[1] !== 'session_1'||pathArr[2] !== 'dwi_1'){
                            self.uploading=false
                            self.$refs['select_frame'].setAttribute('element-loading-spinner','el-icon-error')
                            self.$refs['select_frame'].getElementsByClassName('el-loading-spinner')[0].getElementsByTagName('i')[0].setAttribute('class','el-icon-error')
                            self.uploadmsg='文件上传失败, 数据路径不正确'
                            return;
                        }
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
                        self.$axios.delete('/MyFile/dti/' + self.taskname)
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

<style scoped>
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
</style>
