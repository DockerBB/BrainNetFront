<template>
    <!--<div id="home" :style="background">-->
    <div id="home">
        <!--<el-button @click="loadfile" round></el-button>-->
        <el-card style="width: 50%;float: left;">
            <div slot="header" class="clearfix">
                <h2>Network Analysis</h2>
            </div>
            <el-row>
                <el-input
                        style="width: 40%"
                        placeholder="Search By File Name"
                        prefix-icon="el-icon-search"
                        v-model="search"></el-input>
                <el-autocomplete :fetch-suggestions="querySearch" style="float: right; margin-left: 5px;margin-top: 0;width: 50%" v-model="netAnalysisTaskname" placeholder="task name" readonly>
                    <span slot="prepend" style="color: black">Analysis Task Name</span>
                    <!--<i slot="suffix" class="el-icon-arrow-down"></i>-->
                </el-autocomplete>
                <!--<el-button style="float: right;" size="mini" type="danger" @click="handleBatchDelete">Batch Delete <i class="el-icon-delete"></i></el-button>-->
            </el-row>
            <el-table
                    :data="tableDataList"
                    style="width: 100%"
                    type="selection"
                    max-height="280"
                    :default-sort = "{prop: 'name', order: 'ascending'}"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        label="Subject"
                        prop="name">
                </el-table-column>
                <el-table-column align="right">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handlePreview(scope.row)">Preview</el-button>
                        <!--<el-button-->
                                <!--size="mini"-->
                                <!--type="danger"-->
                                <!--@click="handleDelete(scope.row)"><i class="el-icon-delete"></i></el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <h3>Result of {{ netAnalysisTaskname }}</h3>
            <el-collapse v-loading="loadingNetAnalysisResult">
                <el-collapse-item v-for="(result_item, idx) in netAnalysisResult" :key="idx">
                    <template slot="title" style="text-align: center">
                       {{result_item.date}}
                        <a class="el-icon-download" style="font-size: 1.2rem;" :href="'http://202.197.66.217:18080'+result_item.uri" :download="result_item.uri.substring(result_item.uri.lastIndexOf('/')+1)"></a>
                    </template>
                    <li v-for="(_, key) in result_item.content" :key="key"><a style="cursor: pointer" @click="showResult(idx,key)">{{ key }}</a><br/><br/></li>
                </el-collapse-item>
            </el-collapse>
            <!--<div v-if="historyResult.length > 0" v-for="(value,key) in historyResult" :key="key">-->
                <!--<li><a style="cursor: pointer" @click="showResult(value.uri+'/'+value.name+'.mat', value.name+'.mat')">{{value.name}}</a><br/><br/></li>-->
            <!--</div>-->
            <!--<el-card style="opacity: 0.8;" shadow="hover">-->
                <!--<div slot="header" class="clearfix">-->
                    <!--<h2>Matlab log of last submit</h2>-->
                <!--</div>-->
                <!--<el-scrollbar style="height: 500px">-->
                    <!--<div style="white-space: pre-wrap;float: right;">-->
                        <!--<p v-html="logtextarea"></p>-->
                    <!--</div>-->
                <!--</el-scrollbar>-->
            <!--</el-card>-->
        </el-card>
        <el-card style="width: 50%;float: left;">
            <div slot="header" class="clearfix">
                <h2>fMRI Preprocess Result</h2>
            </div>
            <el-row>
                <el-input
                        style="width: 50%"
                        placeholder="Search By File Name"
                        prefix-icon="el-icon-search"
                        v-model="fmriTaskSearch"></el-input>
                <el-button style="float: right;" size="mini" type="primary" @click="showfmriData">Show Data</el-button>
            </el-row>
            <el-table
                    :data="fmriTableDataList"
                    style="width: 100%"
                    type="selection"
                    max-height="280"
                    :default-sort = "{prop: 'name', order: 'ascending'}">
                <el-table-column
                        label="Preprocess Task Name"
                        prop="name">
                </el-table-column>
                <el-table-column
                        label="Preprocess Result">
                    <template slot-scope="scope">
                        {{scope.row.workingzip}}
                    </template>
                </el-table-column>
                <el-table-column align="right">
                    <template slot-scope="scope">
                        <el-popover
                                :hidden="!scope.row.done"
                                placement="right"
                                title="Select fMRI Result Attribute"
                                width="400"
                                trigger="click">
                            <el-checkbox-group v-model="selectfMRIResultAttr" style="margin-right: 20px">
                                <el-checkbox label="anat_registration_mni"></el-checkbox>
                                <br/>
                                <el-checkbox label="anatomical_brain"></el-checkbox>
                                <br/>
                                <el-checkbox label="anatomical_native_segment"></el-checkbox>
                                <br/>
                                <el-checkbox label="FCMatrixR"></el-checkbox>
                                <br/>
                                <el-checkbox label="fristons_parameter_24"></el-checkbox>
                                <br/>
                                <el-checkbox label="func2anat"></el-checkbox>
                                <br/>
                                <el-checkbox label="functional_brain"></el-checkbox>
                                <br/>
                                <el-checkbox label="functional_freq_filtered"></el-checkbox>
                                <br/>
                                <el-checkbox label="functional_motion"></el-checkbox>
                                <br/>
                                <el-checkbox label="functional_motionA"></el-checkbox>
                                <br/>
                                <el-checkbox label="functional_Normalize"></el-checkbox>
                                <br/>
                                <el-checkbox label="functional_slice_timing"></el-checkbox>
                                <br/>
                                <el-checkbox label="functional_to_standard"></el-checkbox>
                                <br/>
                                <el-checkbox label="nuisance"></el-checkbox>
                                <br/>
                                <el-checkbox label="segment_mask"></el-checkbox>
                                <br/>
                                <el-checkbox label="TimeSeries"></el-checkbox>
                                <br/>
                                <el-checkbox label="tissuePrior_mni2t1"></el-checkbox>
                            </el-checkbox-group>
                            <el-button type="primary" style="float: right;" @click="downloadfMRIResult(scope.row)">Download</el-button>
                            <el-button
                                    slot="reference"
                                    size="mini"
                                    type="primary">View Result</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="Network Viewer" :visible.sync="dialogTableVisible">
            <el-checkbox-group v-model="checkboxGroup">
                <el-checkbox-button label="Chord Graph"></el-checkbox-button>
                <el-checkbox-button label="Heat Map Graph"></el-checkbox-button>
                <el-select v-model="atlasData" style="float: right" placeholder="atlas">
                    <el-option
                            v-for="item in atlasOptions"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                    <!--<el-option :label="'import atlas file'" @click.native="loadAtlas()" :value="''"></el-option>-->
                </el-select>
            </el-checkbox-group>
            <div :hidden="checkboxGroup.indexOf('Chord Graph') === -1">
                <chord :chord-data="chordData" :atlas="atlasData" :size="500"></chord>
            </div>
            <div :hidden="checkboxGroup.indexOf('Heat Map Graph') === -1">
                <heatmap :heatmap-data="heatmapData" :size="500"></heatmap>
            </div>
        </el-dialog>
        <el-dialog :title="'COMPUTE RESULT {'+downloadName+'}'" :visible.sync="resultDialogVisible">
            <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 20}"
                    :readonly="true"
                    v-model="resultData">
            </el-input>
            <!--<a style="float: right;cursor: pointer" ref="resultDownload">download</a>-->
        </el-dialog>
        <el-dialog title="fMRI Preprocess Data" :visible.sync="fmriDataVisible">
            <!--<a style="float: right;cursor: pointer" ref="resultDownload">download</a>-->
            <!--<div style="text-align: center">-->
                <!--<h1>未完工</h1>-->
            <!--</div><br/>-->
            <el-tree
                :data="fmriData"
                node-key="id"
                :expand-on-click-node="true"
                :modal-append-to-body='false'>
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span v-if="data.children == undefined" @click="() => downloadData(node)"><i class="el-icon-document"></i>{{ node.label }}</span>
                    <span v-else><i class="iconfont icon-dir"></i>{{ node.label }}</span>
                </span>
            </el-tree>
        </el-dialog>
        <iframe style="display: none" name="if_down"></iframe>
        <form id="forpostdownload"></form>
    </div>
</template>
<script>
    /* eslint-disable */
    // import i18n from '@/language'
    import { MatFileLoader } from '@/utils/MatFileLoader'
    import * as labeldata from '../data-index'
    import Chord from '../gretna/chord'
    import Heatmap from '../gretna/heatmap'
    import { EdgeLoader } from '@/utils/EdgeLoader'
    import JSZip from 'jszip'
    export default {
        name: 'home',
        components: { Heatmap, Chord },
        data() {
            return {
                background: {
                    backgroundImage: "url(" + require("@/assets/img/background.jpg") + ")",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                },
                dialogTableVisible: false,
                resultDialogVisible: false,
                fmriDataVisible: false,
                search: '',
                selectfMRIResultAttr: [],
                fmriTaskSearch: '',
                historyResult: [],
                checkboxGroup: [],
                atlasData: [],
                resultData: '',
                chordData: null,
                heatmapData: null,
                atlasOptions: [
                    {label: 'AAL90', value: labeldata.aal90label},
                    {label: 'Brodmann82', value: labeldata.Brodmann82label},
                    {label: 'CustomROI6', value: labeldata.CustomROI6label},
                    {label: 'Desikan-Killiany68', value: labeldata.DesikanKilliany68label},
                    {label: 'Dos160', value: labeldata.Dos160label},
                    {label: 'Fair34', value: labeldata.Fair34label},
                    {label: 'HOA112', value: labeldata.HOA112label},
                    {label: 'LPBA56', value: labeldata.LPBA56label},
                ],
                downloadUrl: '',
                downloadName: '',
                fileList: [],
                fmriTaskList: [],
                tableDataList: [],
                fmriTableDataList: [],
                fmriData: [],
                logtextarea: '',
                selectFiles: [],
                netAnalysisTaskname: '',
                netAnalysisResult: [],
                loadingNetAnalysisResult: false,
                netAnalysisTaskList: [],
            }
        },
        watch: {
            '$store.state.netAnalysis.netAnalysisState': function () {
                if (this.$store.state.netAnalysis.netAnalysisState === 'finish') this.updateNetAnalysisResult();
            },
            // '$store.state.outputText': function () {
            //     let line = this.$store.state.outputText
            //     this.logtextarea += '\n' + line
            // },
            'search': function () {
                this.updateTableDataList()
            },
            'netAnalysisTaskname': function () {
                if (this.netAnalysisTaskname === '') return;
                let taskList = []
                this.netAnalysisTaskList.forEach(v=>taskList.push(v.value))
                if (taskList.indexOf(this.netAnalysisTaskname)<0) {
                    this.fileList = []
                    this.netAnalysisResult = []
                    this.updateTableDataList()
                    return;
                }
                this.handleSuccess();
                this.updateNetAnalysisResult();
            },
            'fmriTaskSearch': function () {
                this.updateTableDataList()
            }
        },
        mounted() {
            if (this.$store.state.user.nickname === 'public')return;
            this.$axios.get('/getdirlist/netAnalysis').then(res => {
                let taskList = []
                res.data.data.forEach(v=>taskList.push({value:v.name}))
                this.netAnalysisTaskList = taskList
                this.netAnalysisTaskname = taskList.length === 0? 'default':taskList[0].value
            })
            this.loadfmriTask();
        },
        methods: {
            getURI: function(node) {
                let url = node.label;
                while (node.parent.label) {
                    url = node.parent.label + '/' + url;
                    node = node.parent
                }
                return url;
            },
            loadfile: function () {
                let input = document.createElement('input');
                input.type = 'file';
                input.accept = '.mat';
                input.onchange = function(ev) {
                    // let loader = new MatFileLoader(buffer);
                    const file = ev.target.files[0];
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        let buffer = reader.result;
                        // console.log(new Uint8Array(buffer))
                        console.log(new MatFileLoader(buffer));
                    };
                    reader.readAsArrayBuffer(file);
                    return false;
                };
                input.click();
            },
            updateOptionCount: function () {
                this.NetworkCard.globalOptionCount = this.GlobalNetworkMetrics.showable.reduce((total, v) => v === true ? total + 1 : total + 0, 0);
                this.NetworkCard.nodalOptionCount = this.NodalandModularNetworkMetrics.showable.reduce((total, v) => v === true ? total + 1 : total + 0, 0);
                this.NetworkCard.optionCount = this.NetworkCard.globalOptionCount + this.NetworkCard.nodalOptionCount;
            },
            loadAtlas(){
                let input = document.createElement('input');
                let result
                const self = this
                input.type = 'file';
                input.accept = '.mat';
                input.onchange = function(ev) {
                    const file = ev.target.files[0];
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        result = reader.result;
                        self.atlasData = ['PreCG.L', 'PreCG.R', 'SFGdor.L', 'SFGdor.R', 'ORBsup.L', 'ORBsup.R', 'MFG.L', 'MFG.R', 'ORBmid.L', 'ORBmid.R', 'IFGoperc.L', 'IFGoperc.R', 'IFGtriang.L', 'IFGtriang.R', 'ORBinf.L', 'ORBinf.R', 'ROL.L', 'ROL.R', 'SMA.L', 'SMA.R', 'OLF.L', 'OLF.R', 'SFGmed.L', 'SFGmed.R', 'ORBsupmed.L', 'ORBsupmed.R', 'REC.L', 'REC.R', 'INS.L', 'INS.R', 'ACG.L', 'ACG.R', 'DCG.L', 'DCG.R', 'PCG.L', 'PCG.R', 'HIP.L', 'HIP.R', 'PHG.L', 'PHG.R', 'AMYG.L', 'AMYG.R', 'CAL.L', 'CAL.R', 'CUN.L', 'CUN.R', 'LING.L', 'LING.R', 'SOG.L', 'SOG.R', 'MOG.L', 'MOG.R', 'IOG.L', 'IOG.R', 'FFG.L', 'FFG.R', 'PoCG.L', 'PoCG.R', 'SPG.L', 'SPG.R', 'IPL.L', 'IPL.R', 'SMG.L', 'SMG.R', 'ANG.L', 'ANG.R', 'PCUN.L', 'PCUN.R', 'PCL.L', 'PCL.R', 'CAU.L', 'CAU.R', 'PUT.L', 'PUT.R', 'PAL.L', 'PAL.R', 'THA.L', 'THA.R', 'HES.L', 'HES.R', 'STG.L', 'STG.R', 'TPOsup.L', 'TPOsup.R', 'MTG.L', 'MTG.R', 'TPOmid.L', 'TPOmid.R', 'ITG.L', 'ITG.R']
                    };
                    reader.readAsText(file);
                    return false;
                };
                input.click();
                return 'My Atlas'
            },
            showResult(idx, key){
                this.resultDialogVisible = true;
                let zipObj = this.netAnalysisResult[idx].zipEntity.file(this.netAnalysisResult[idx].content[key])
                const self = this;
                this.resultData = '';
                zipObj.async("arraybuffer").then(ab=>{
                    this.resultData = new MatFileLoader(ab).toJSON();
                })
            },
            updateNetAnalysisResult(){
                let ziplist = []
                this.netAnalysisResult = []
                this.loadingNetAnalysisResult = true
                const self = this
                let downloadZipLoop = function () {
                    if (ziplist.length === 0) {
                        self.loadingNetAnalysisResult = false
                        return;
                    }
                    let url = ziplist.pop()
                    fetch('http:' + window.g.API_URL + url, {
                        headers: {
                            'Accept': 'application/octet-stream',
                            'content-type': 'application/octet-stream'
                        },
                        method: 'GET',
                        credentials: 'include'
                    }).then(data => data.arrayBuffer())
                        .then(data =>new JSZip().loadAsync(data))
                        .then(zip=>{
                            self.netAnalysisResult[ziplist.length].zipEntity = zip
                            let content = {}
                            for (let key in zip.files){
                                if (/\/[\w_]+\.mat/.test(key)) content[key.substring(key.lastIndexOf('/')+1)] = key
                            }
                            self.netAnalysisResult[ziplist.length].content = content
                            downloadZipLoop()
                        })
                }
                this.$axios.get('/getfilelist/netAnalysis/'+this.netAnalysisTaskname).then(res => {
                    res.data.data.sort((a,b)=>a.name < b.name ? 1 : -1).forEach(v=>{
                        let timestamp = parseInt(v.name.match(/result_(\d+)\.zip/)[1]+'000')
                        this.netAnalysisResult.push({date: new Date(timestamp).toDateString()+' '+new Date(timestamp).toTimeString(),content:{},uri:v.uri})
                        ziplist.push(v.uri)
                    })
                    return Promise.resolve()
                }).then(()=>downloadZipLoop())
            },
            handlePreview(item) {
                const self = this;
                let uri = item.uri;
                let suffix=uri.substring(uri.lastIndexOf("."))
                if (suffix === '.txt'||suffix === '.edge'||suffix === '.csv') this.$axios.get(uri).then(res => {
                    if (res.data){
                        let data = res.data
                        self.chordData = {
                            matrix: new EdgeLoader().loadMatrix(data)
                        };
                        self.heatmapData = {
                            data: new EdgeLoader().loadAList(data)
                        };
                    }
                })
                else if (suffix === '.mat') fetch('http:' + window.g.API_URL + uri, {
                    headers: {
                        'Accept': 'application/octet-stream',
                        'content-type': 'application/octet-stream'
                    },
                    method: 'GET',
                    credentials: 'include'
                }).then(data => data.arrayBuffer()).then(data => {
                    if (data){
                        let mat = new MatFileLoader(data).data[0].data
                        let list = []
                        let max=[],min=[]
                        mat.forEach((row,i)=>{
                            row.forEach((v,j)=>{
                                list.push([i, j, v])
                            })
                            max.push(Math.max.apply(Math,row))
                            min.push(Math.min.apply(Math,row))
                        })
                        max = Math.max.apply(Math,max)
                        min = Math.min.apply(Math,min)
                        self.chordData = {
                            matrix: mat
                        };
                        self.heatmapData = {
                            data: {
                                n: mat.length,
                                max: max,
                                min: min,
                                list: list
                            }
                        };
                    }
                })
                else {
                    this.$message({message: 'This type of matrix(*'+suffix+') dose not support visualization', type: 'info'});
                    return;
                }
                this.dialogTableVisible = true;
            },
            handleSuccess:function(){
                this.fileList = []
                this.$axios.get('/getfilelist/netAnalysis/'+this.netAnalysisTaskname+'/FCMatrixR').then(res => {
                    this.fileList = res.data.data
                    this.updateTableDataList()
                }).catch(()=>this.updateTableDataList())
            },
            loadfmriTask:function(){
                this.fmriTaskList = []
                this.$axios.get('/getdirlist/fmri').then(res => {
                    let taskList = []
                    res.data.data.forEach(v=>taskList.push('/fmri/'+v.name+'/working.zip'))
                    this.fmriTaskList = res.data.data
                    return this.$axios.post('/find',taskList)
                }).then(res=>{
                    const data = res.data.data
                    for (let i = 0;i < data.length;i++){
                        this.fmriTaskList[i].done = data[i].match(/-find\s(.+)/)[1] === 'success'
                        if (this.fmriTaskList[i].done) this.fmriTaskList[i].workingzip = this.fmriTaskList[i].name+'_working.zip'
                    }
                    this.updateTableDataList()
                })
            },
            handleUpload:function(content){
                let param = new FormData()
                param.append('uploadfile',content.file, encodeURIComponent('FCMatrixR/'+content.file.name))
                this.$axios.post('/uploadfiles/netAnalysis/', param)
                    .then(res=> content.onSuccess('文件上传成功'))
                    .catch(err=> this.$message.error(err))
            },
            handleSelectionChange(val) {
                let uri = [];
                this.selectFiles = uri;
                val.forEach(v=>uri.push(v.uri))
                // console.log(uri)
            },
            handleDelete(item) {
                if (item.isPubllic) {
                    let li = this.tableDataList;
                    this.tableDataList = [];
                    li.filter(v => v.name !== item.name).forEach(v => this.tableDataList.push(v))
                } else this.$confirm(`确定从服务器移除文件 ${ item.name }？`).then(() =>{
                    this.$axios.delete('/MyFile/netAnalysis/FCMatrixR/' + item.name).then(res => {
                        this.handleSuccess()
                    }).catch(() => this.handleSuccess())
                }).catch(() => {});
            },
            downloadfMRIResult(item){
                let taskname = item.name;
                let root = '/fmri/'+taskname+'/working';
                // let form = document.getElementById('forpostdownload');//定义一个form表单
                // form.target = 'if_down'
                // form.method = 'post';
                // form.action = 'http:'+window.g.API_URL+'/MyFile';
                console.log('downloadfMRIResult')
                this.$axios.get('/getdirlist'+root).then(res=>{
                    let urilist = []
                    let attr = this.selectfMRIResultAttr
                    res.data.data.forEach(v=>{
                        for (let i in attr) urilist.push(root+'/'+v.name+'/'+attr[i])
                    })
                    if (urilist.length === 0) return Promise.reject();
                    else return this.$axios.post('/MyFile',urilist)
                }).then(()=>{
                    let link = document.createElement('a')
                    link.href = 'http:' + window.g.API_URL + '/downloadzip'
                    link.download = taskname+'-working.zip'
                    link.click()
                })
            },
            querySearch(queryString, cb) {
                let restaurants = this.netAnalysisTaskList;
                // let results = queryString ? restaurants.filter(data => !queryString || data.value.toLowerCase().includes(queryString.toLowerCase())) : restaurants;
                // // 调用 callback 返回建议列表的数据
                // cb(results);
                cb(restaurants)
            },
            updateTableDataList() {
                this.tableDataList = []
                this.fmriTableDataList = []
                this.fileList
                    .filter(data => !this.search || data.name.toLowerCase().includes(this.search.toLowerCase()))
                    .forEach(v=>this.tableDataList.push(v))
                this.fmriTaskList
                    .filter(data => !this.fmriTaskSearch || data.name.toLowerCase().includes(this.fmriTaskSearch.toLowerCase()))
                    .filter(data => data.done)
                    .forEach(v=>this.fmriTableDataList.push(v))
            },
            showfmriData() {
                this.fmriDataVisible = true
                let fmriData = []
                // let fmriTaskList = []
                this.fmriData = fmriData
                this.fmriTaskList.forEach((v,i)=>{
                    let taskname = v.name
                    this.$axios.get('/getdirlist/fmri/'+taskname+'/data').then(res=>{
                        let children = []
                        res.data.data.forEach(v=>children.push({label:v.name}))
                        fmriData.push({label:taskname,children:children})
                    })
                })
                const self = this
                setTimeout(()=>
                    fmriData.sort((a,b)=>a.label < b.label ? 1 : -1),1000)
            }
        }
    }
</script>
<style lang='stylus'>
#home {
    position: relative;
    width: 100%;
    height: 100vh;
}
.select_label {
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
textarea {
    white-space: pre;
}
</style>
