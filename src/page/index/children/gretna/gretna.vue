9<template>
    <div id="gretna" :style="background">
        <el-row type="flex" justify="center">
            <el-col type="flex" style="width: auto!important;">
                <el-card class="box-card" style="height: 350px">
                    <div slot="header" class="clearfix">
                        <span>{{ GlobalNetworkMetrics.title }}</span>
                        <div style="float: right; padding: 3px 0" >
                            <el-button icon="el-icon-arrow-right" @click="inputOption(GlobalNetworkMetrics)" circle></el-button>
                        </div>
                    </div>
                    <div v-for="(value,key) in GlobalNetworkMetrics.item" :key="key" class="text item">
                        <el-radio v-model="GlobalNetworkMetrics.selected" :label="key" :disabled="GlobalNetworkMetrics.showable[key]">{{ value }}</el-radio>
                    </div>
                </el-card>
                <el-card class="box-card" style="height: 450px">
                    <div slot="header" class="clearfix">
                        <span>{{ NodalandModularNetworkMetrics.title }}</span>
                        <div style="float: right; padding: 3px 0" >
                            <el-button icon="el-icon-arrow-right" @click="inputOption(NodalandModularNetworkMetrics)" circle></el-button>
                        </div>
                    </div>
                    <div v-for="(value,key) in NodalandModularNetworkMetrics.item" :key="key" class="text item">
                        <el-radio v-model="NodalandModularNetworkMetrics.selected" :label="key" :disabled="NodalandModularNetworkMetrics.showable[key]">{{ value }}</el-radio>
                    </div>
                </el-card>
            </el-col>
            <el-card class="box-card" style="height: 800px">
                <div slot="header" class="clearfix" style="height: 60px">
                    <div :hidden="active !== 2" style="float: left; padding: 3px 0" >
                        <el-button icon="el-icon-arrow-left" @click="removeOption()" circle></el-button>
                    </div>
                    <el-steps :active="active" process-status="process" align-center>
                        <el-step title="select Matrix" @click.native="()=>active = 1"></el-step>
                        <el-step title="select Attribute" @click.native="()=>active = 2"></el-step>
                        <el-step title="Run" @click.native="()=>active = mtextarea === '' ? active : 3"></el-step>
                    </el-steps>
                </div>
                <el-scrollbar id="scrollpanel" style="height: 740px">
                    <div :hidden="active !== 1">
                        <el-row>
                            <el-input
                                    style="width: 50%"
                                    placeholder="Search By File Name"
                                    prefix-icon="el-icon-search"
                                    v-model="search"></el-input>
                            <el-button style="float: right;" size="mini" type="danger" @click="handleBatchDelete">Batch Delete <i class="el-icon-delete"></i></el-button>
                        </el-row>
                        <el-table
                                :data="tableDataList"
                                style="width: 100%"
                                type="selection"
                                max-height="280"
                                :default-sort = "{prop: 'name', order: 'ascending'}"
                                @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55" ></el-table-column>
                            <el-table-column
                                    label="file"
                                    prop="name">
                            </el-table-column>
                            <el-table-column align="right">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="handlePreview(scope.row)">Preview</el-button>
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            @click="handleDelete(scope.row)"><i class="el-icon-delete"></i></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--<el-upload-->
                                <!--class="upload matrix file"-->
                                <!--action="/uploadfiles"-->
                                <!--accept=".txt,.edge,.csv,.xlsx,.xlsx,.mat"-->
                                <!--:http-request="handleUpload"-->
                                <!--:with-credentials='true'-->
                                <!--:on-success="handleSuccess"-->
                                <!--:auto-upload="true"-->
                                <!--:show-file-list="false"-->
                                <!--multiple-->
                                <!--:file-list="fileList">-->
                            <!--&lt;!&ndash;<div style="text-align:center;float: right;" slot="tip" class="el-upload__tip">{{ translations('uploadtip') }}</div>&ndash;&gt;-->
                            <!--<el-button style="margin-top: 10px;margin-left: 30px" slot="trigger" size="small" type="primary" round><i class="iconfont icon-wenjianshangchuan"></i></el-button>-->
                            <!--<el-autocomplete :fetch-suggestions="querySearch" style="float: left; margin-top: 10px;width: 350px" v-model="taskname" placeholder="task name"><span slot="prepend" style="color: black">/MyFile/netAnalysis/${Task Name}</span></el-autocomplete>-->
                        <!--</el-upload>-->

                        <el-button style="margin-top: 10px;margin-left: 30px" @click="handleUpload" size="small" type="primary" round><i class="iconfont icon-wenjianshangchuan"></i></el-button>
                        <el-autocomplete :fetch-suggestions="querySearch" style="float: left; margin-top: 10px;width: 350px" v-model="taskname" placeholder="task name"><span slot="prepend" style="color: black">Select or Create a Task</span></el-autocomplete>
                        {{ translations('uploadtip') }}
                        <h3>Result of last submit</h3>
                        <div v-if="historyResult.length > 0" v-for="(value,key) in historyResult" :key="key">
                            <li><a style="cursor: pointer" @click="showResult(value.uri+'/'+value.name+'.mat', value.name+'.mat')">{{value.name}}</a><br/><br/></li>
                        </div>
                    </div>
                    <el-form style="min-height: 1030px;" :inline="true" :model="NetworkConfiguration" :hidden="NetworkCard.optionCount < 1||active === 1">
                        <p class="item text"> . Sign of Matrix</p>
                        <el-form-item label=" . . Sign:  ">
                            <el-select v-model="NetworkConfiguration.signType">
                                <el-option label="Postive" :value="1"></el-option>
                                <el-option label="Nagtive" :value="2"></el-option>
                                <el-option label="Absolute" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <p class="item text"> . Thresholding Method</p>
                        <el-form-item label=" . . Method:  ">
                            <el-select v-model="NetworkConfiguration.thresMethod">
                                <el-option label="Network Sparsity" :value="1"></el-option>
                                <el-option label="Value of Matrix Elemnt" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label=" . . Threshold Sequence:  ">
                            <el-input v-model="thresField"></el-input>
                        </el-form-item>
                        <p class="item text"> . Network Type</p>
                        <el-form-item label=" . . Type:  ">
                            <el-select v-model="NetworkConfiguration.netType">
                                <el-option label="Binary" :value="1"></el-option>
                                <el-option label="Weighted" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <div style="height: 100px">
                            <div :hidden="GlobalNetworkMetrics.showable.reduce((total, v) => v === true ? total + 1 : total + 0, 0) < 1">
                                <p class="item text"> . Random Network Generation</p>
                                <el-form-item label=" . . Random Network Number:  ">
                                    <el-input :value="NetworkConfiguration.randNetworkNum"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                        <div :hidden="GlobalNetworkMetrics.showable.reduce((total, v) => v === true ? total + 1 : total + 0, 0) < 1">
                            <hr/>
                            <strong class="item text">{{ GlobalNetworkMetrics.title }}</strong>
                            <hr/>
                            <div v-for="(value,key) in GlobalNetworkMetrics.item" :key="key" class="text item">
                                <el-radio v-model="GlobalNetworkMetrics.selected" :label="key" :hidden="!GlobalNetworkMetrics.showable[key]">{{ value }}</el-radio>
                                <!--<span style="float: right;color: #409EFF;cursor: pointer;" :hidden="!GlobalNetworkMetrics.showable[key] || !GlobalNetworkMetrics.resultShow[key]" @click="showResult('/MyFile/result/'+GlobalNetworkMetrics.resultFile[key]+'/'+GlobalNetworkMetrics.resultFile[key]+'.mat',GlobalNetworkMetrics.resultFile[key]+'.mat')">show</span>-->
                            </div>
                        </div>
                        <div :hidden="NodalandModularNetworkMetrics.showable.reduce((total, v) => v === true ? total + 1 : total + 0, 0) < 1">
                            <hr/>
                            <strong class="item text">{{ NodalandModularNetworkMetrics.title }}</strong>
                            <hr/>
                            <div v-for="(value,key) in NodalandModularNetworkMetrics.item" :key="key" class="text item">
                                <el-radio v-model="NodalandModularNetworkMetrics.selected" :label="key" :hidden="!NodalandModularNetworkMetrics.showable[key]">{{ value }}</el-radio>
                                <div v-if="NodalandModularNetworkMetrics.item[key] === 'Nodal - Community Index'" :label="key" style="margin-left: 20px" :hidden="!NodalandModularNetworkMetrics.showable[key]">
                                    <p class="item text"> . . Modularity Algorithm:</p>
                                    <el-select v-model="NetworkConfiguration.modulAlgor">
                                        <el-option label="Modified Greedy Optimization" :value="1"></el-option>
                                        <el-option label="Spectral Optimization" :value="2"></el-option>
                                    </el-select>
                                    <p class="item text"> . . Estimating Participant Coefficient:</p>
                                    <el-select v-model="NetworkConfiguration.dDPcFlag">
                                        <el-option label="TRUE" :value="1"></el-option>
                                        <el-option label="FALSE" :value="2"></el-option>
                                    </el-select>
                                </div>
                                <div v-if="NodalandModularNetworkMetrics.item[key] === 'Nodal - Participant Coefficient'||NodalandModularNetworkMetrics.item[key] === 'Modular - Interaction'" :label="key" style="margin-left: 20px" :hidden="!NodalandModularNetworkMetrics.showable[key]">
                                    <p class="item text"> . . Community Index:</p>
                                    <el-input v-model="cIndexField" placeholder="<-X"></el-input>
                                </div>
                                <!--<span style="float: right;color: #409EFF;cursor: pointer;" :hidden="!NodalandModularNetworkMetrics.showable[key] || !NodalandModularNetworkMetrics.resultShow[key]" @click="showResult('/MyFile/result/'+NodalandModularNetworkMetrics.resultFile[key]+'/'+NodalandModularNetworkMetrics.resultFile[key]+'.mat',NodalandModularNetworkMetrics.resultFile[key]+'.mat')">show</span>-->
                            </div>
                        </div>
                        <div style="float: right">
                            <el-button @click="()=>runDialogTableVisible=true" :hidden="mtextarea === ''">Report</el-button>
                            <el-button type="primary" @click="onSubmit">RUN</el-button>
                        </div>
                    </el-form>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </el-scrollbar>
            </el-card>
        </el-row>
        <el-dialog :title="translations('displayDiagTitle')" :visible.sync="dialogTableVisible">
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
        <el-dialog title="MATLAB REPORT" :visible.sync="runDialogTableVisible">
            <div style="white-space: pre-wrap;">
                <p v-html="mtextarea" @click="handlelink($event)"></p>
            </div>
        </el-dialog>
        <el-dialog :title="'COMPUTE RESULT {'+downloadName+'}'" :visible.sync="resultDialogVisible">
            <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 20}"
                    :readonly="true"
                    v-model="resultData">
            </el-input>
            <a style="float: right;cursor: pointer" @click="downloadResult(downloadUrl, downloadName)">download</a>
        </el-dialog>
    </div>
</template>
<script>
    /* eslint-disable */
    import { request } from '@/utils/request'
    import { EdgeLoader } from '@/utils/EdgeLoader'
    import cache from "@/utils/cache";
    import i18nLang from './i18n-lang'
    import * as labeldata from '../data-index'
    import Chord from './chord'
    import Heatmap from './heatmap'
    import {MatFileLoader} from "../../../../utils/MatFileLoader";
    const keyName = 'netAnalysis'
    const publicFileList = [{name: 'Edge_AAL90_Binary.edge', uri: '/public/AAL90/Edge_AAL90_Binary.edge', isPubllic: true}, {name: 'Edge_Fair34_Binary.edge', uri: '/public/Fair34/Edge_Fair34_Binary.edge', isPubllic: true}]

    export default {
        name: 'gretna',
        components: { Heatmap, Chord },
        data() {
            return {
                background: {
                    backgroundImage: "url(" + require("@/assets/img/background.jpg") + ")",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                },
                dialogTitle: 'display matrx',
                FileTableVisible: false,
                dialogTableVisible: false,
                runDialogTableVisible: false,
                resultDialogVisible: false,
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
                active: 1,
                chordData: null,
                heatmapData: null,
                resultData: '',
                atlasData: [],
                checkboxGroup: [],
                mtextarea: '',
                thresField: '',
                cIndexField: '',
                search: '',
                checkAll: false,
                historyResult: [],
                downloadUrl: '',
                downloadName: '',
                taskname: '',
                taskList: [],
                NetworkCard:{
                    title: 'Network Configuration',
                    optionCount: 0,
                    globalOptionCount:0,
                    nodalOptionCount:0,
                    selected: 0,
                },
                NetworkConfiguration: {
                    selPreInd: [],
                    selPostInd: [],
                    signType:1,
                    thresMethod:1,
                    thresSequence:[],
                    netType:1,
                    randNetworkNum: 100,
                    clustAlgor: 1,
                    modulAlgor: 1,
                    dDPcFlag: 1,
                    realNetURI: [],
                    cIndex: [0]
                },
                GlobalNetworkMetrics: {
                    title: 'Global Network Metrics',
                    selected: 0,
                    showable: [false,false,false,false,false,false],
                    resultShow: [false,false,false,false,false,false],
                    item: ['Global - Small-World','Global - Efficiency','Global - Rich-Club','Global - Assortativity','Global - Synchronization','Global - Hierarchy'],
                    resultFile: ['SmallWorld','NetworkEfficiency','RichClub','Assortativity','Synchronization','Hierarchy']
                },
                NodalandModularNetworkMetrics: {
                    title: 'Nodal and Modular Network Metrics',
                    selected: 0,
                    showable: [false,false,false,false,false,false,false,false,false],
                    resultShow: [false,false,false,false,false,false,false,false,false],
                    item: ['Nodal - Clustering Coefficient','Nodal - Shortest Path Length','Nodal - Efficiency','Nodal - Local Efficiency','Nodal - Degree Centrality','Nodal - Betweenness Centrality','Nodal - Community Index','Nodal - Participant Coefficient','Modular - Interaction'],
                    resultFile: ['NodalClustCoeff','NodalShortestPath','NodalEfficiency','NodalLocalEfficiency','DegreeCentrality','BetweennessCentrality','CommunityIndex','ParticipantCoefficient','ModularInteraction']
                },
                fileList: [],
                tableDataList: []
            }
        },
        watch: {
            '$store.state.netAnalysis.netAnalysisState': function () {
                this.historyResult = []
                if (this.$store.state.netAnalysis.netAnalysisState === 'finish')
                    this.$axios.get('/getdirlist/netAnalysis/'+this.taskname+'/result').then(res => {
                        this.historyResult = res.data.data
                    })
            },
            '$store.state.outputText': function () {
                this.runDialogTableVisible = true
                let line = this.$store.state.outputText
                if (line.includes('completed')) {
                    let reg = /\s(\w+)(\d{5})\s/
                    let temp = line.match(reg)
                    if (temp) {
                        let filename = this.NetworkConfiguration.realNetURI[parseInt(line.match(reg)[2])-1]
                        // console.log(filename)
                        filename = filename.substring(filename.lastIndexOf('/')+1, filename.indexOf('.'))
                        // console.log(filename)
                        this.mtextarea += '\n' + line.replace(reg, ' <a name="'+filename+'" style="cursor: pointer">$1$2</a> ')
                    }
                }else this.mtextarea += '\n' + line
            },
            'taskname': function () {
                if (this.taskname === '') return;
                let taskList = []
                this.taskList.forEach(v=>taskList.push(v.value))
                if (taskList.indexOf(this.taskname)<0) {
                    this.fileList = []
                    this.historyResult = []
                    this.updateTableDataList()
                    return;
                }
                this.handleSuccess();
                this.$axios.get('/getdirlist/netAnalysis/'+this.taskname+'/result').then(res => {
                    this.historyResult = res.data.data
                })
            },
            'search': function () {
                this.updateTableDataList()
            }
        },
        created() {
            this.thresField = [0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5].toString()
            this.cIndexField = [0].toString()
            this.initLocal();
        },
        mounted() {
            // this.$store.state.netAnalysisState = 'green'
            if (this.$store.state.user.nickname === 'public')return;
            this.$axios.get('/getdirlist/netAnalysis').then(res => {
                let taskList = []
                res.data.data.forEach(v=>taskList.push({value:v.name}))
                this.taskList = taskList
                this.taskname = taskList.length === 0? 'default':taskList[0].value
            })
        },
        methods: {
            inputOption: function (card) {
                this.active = 2
                if (card.selected >= card.item.length) return;
                card.showable[card.selected] = true;
                for(card.selected = 0;card.showable[card.selected];card.selected++);
                this.updateOptionCount();
            },
            removeOption: function () {
                let g = this.GlobalNetworkMetrics;
                let n = this.NodalandModularNetworkMetrics;
                if (g.showable[g.selected]) {
                    g.showable[g.selected] = false;
                    for(g.selected = 0;g.showable[g.selected] === false;g.selected++);
                }
                if (n.showable[n.selected]) {
                    n.showable[n.selected] = false;
                    for(n.selected = 0;n.showable[n.selected] === false;n.selected++);
                }
                this.updateOptionCount();
            },
            updateOptionCount: function () {
                this.NetworkCard.globalOptionCount = this.GlobalNetworkMetrics.showable.reduce((total, v) => v === true ? total + 1 : total + 0, 0);
                this.NetworkCard.nodalOptionCount = this.NodalandModularNetworkMetrics.showable.reduce((total, v) => v === true ? total + 1 : total + 0, 0);
                this.NetworkCard.optionCount = this.NetworkCard.globalOptionCount + this.NetworkCard.nodalOptionCount;
            },
            onSubmit:function () {
                let g = this.GlobalNetworkMetrics;
                let n = this.NodalandModularNetworkMetrics;
                this.NetworkConfiguration.selPreInd = [];
                this.NetworkConfiguration.selPostInd = [];
                this.NetworkConfiguration.thresSequence = JSON.parse('['+this.thresField+']')
                this.NetworkConfiguration.cIndex = JSON.parse('['+this.cIndexField+']')
                let selG = this.NetworkConfiguration.selPreInd = [];
                let selN = this.NetworkConfiguration.selPostInd = [];
                for(let i = 0;i < g.item.length;i++) if (g.showable[i]) selG[selG.length] = i + 1;
                for(let i = 0;i < n.item.length;i++) if (n.showable[i]) selN[selN.length] = i + 1;
                if (this.NetworkConfiguration.realNetURI.length !== 0) {
                    // console.log(this.NetworkConfiguration)
                    g.resultShow = g.showable.slice(0);
                    n.resultShow = n.showable.slice(0);
                    this.active = 3
                    this.$store.state.netAnalysis.time = 0
                    this.$axios.post('/gretna/'+this.taskname+'/'+cache.getToken(), this.NetworkConfiguration)
                        .then(res => this.$message({message: res.data.message, type: 'info'}));
                    this.mtextarea = ''
                } else {
                    this.$message({message: 'There was no matrix yet', type: 'warning'});
                    this.active = 1
                }
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
            showResult(url, filename){
                this.resultDialogVisible = true;
                // let url = '/MyFile/result/'+filename+'/'+filename+'.mat';
                const self = this;
                self.resultData = '';
                self.downloadUrl = url;
                self.downloadName = filename === undefined ? 'result.mat' : filename;
                fetch('http:' + window.g.API_URL + url, {
                    headers: {
                        'Accept': 'application/octet-stream',
                        'content-type': 'application/octet-stream'
                    },
                    method: 'GET',
                    credentials: 'include'
                }).then(data => data.arrayBuffer()).then(data => {
                    if (data) {
                        self.resultData = new MatFileLoader(data).toJSON();
                    }
                })
            },
            downloadResult(url, filename){
                fetch('http:' + window.g.API_URL + url, {
                    headers: {
                        'Accept': 'application/octet-stream',
                        'content-type': 'application/octet-stream'
                    },
                    method: 'GET',
                    credentials: 'include'
                }).then(data => data.blob()).then(data => {
                    if (data) {
                        let link = document.createElement('a')
                        link.href = window.URL.createObjectURL(data)
                        link.download = filename
                        link.click()
                        window.URL.revokeObjectURL(link.href)
                    }
                })
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
                        console.log(max,min)
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
                this.$axios.get('/getfilelist/netAnalysis/'+this.taskname+'/FCMatrixR').then(res => {
                    this.fileList = res.data.data
                    this.updateTableDataList()
                }).catch(()=>this.updateTableDataList())
            },
            // handleUpload:function(content){
            //     let param = new FormData()
            //     param.append('uploadfile',content.file, encodeURIComponent(this.taskname+'/FCMatrixR/'+content.file.name))
            //     this.$axios.post('/uploadfiles/netAnalysis', param)
            //         .then(res=> {
            //             this.$axios.get('/getdirlist/netAnalysis').then(res => {
            //                 let taskList = []
            //                 res.data.data.forEach(v=>taskList.push({value:v.name}))
            //                 this.taskList = taskList
            //             })
            //             content.onSuccess('文件上传成功')
            //         })
            //         .catch(err=> this.$message.error(err))
            // },
            handleUpload:function(content){
                let self = this;
                let filelist = []
                let input = document.createElement('input');
                input.type = 'file';
                input.multiple = 'multiple'
                input.accept = '.txt,.edge,.csv,.xlsx,.xlsx,.mat'
                function uploadFile(){
                    if (filelist.length === 0) {
                        self.$message.success('upload success')
                        self.handleSuccess()
                        self.$axios.get('/getdirlist/netAnalysis').then(res => {
                            let taskList = []
                            res.data.data.forEach(v=>taskList.push({value:v.name}))
                            self.taskList = taskList
                        })
                        return;
                    }
                    let file = filelist.pop()
                    let param = new FormData()
                    param.append('uploadfile',file, encodeURIComponent(self.taskname+'/FCMatrixR/'+file.name))
                    self.$axios.post('/uploadfiles/netAnalysis', param)
                        .then(()=>uploadFile())
                        .catch(err=> self.$message.error(err))
                }
                input.onchange = function(ev) {
                    let list = ev.target.files;
                    for(let i =0;i < list.length;i++) filelist.push(list[i])
                    uploadFile()
                };
                input.click()
            },
            handleSelectionChange(val) {
                let uri = [];
                this.NetworkConfiguration.realNetURI = uri;
                val.forEach(v=>uri.push(v.uri))
                // console.log(uri)
            },
            handleDelete(item) {
                if (item.isPubllic) {
                    let li = this.tableDataList;
                    this.tableDataList = [];
                    li.filter(v => v.name !== item.name).forEach(v => this.tableDataList.push(v))
                } else this.$confirm(`确定从服务器移除文件 ${ item.name }？`).then(() =>{
                    this.$axios.delete(item.uri).then(res => {
                        this.handleSuccess()
                    }).catch(() => this.handleSuccess())
                }).catch(() => {});
            },
            handleBatchDelete() {
                let files = []
                console.log(this.NetworkConfiguration.realNetURI)
                this.NetworkConfiguration.realNetURI.forEach(v=>files.push(v.replace('/MyFile','')))
                this.$confirm(`确定从服务器移除这${ files.length }个文件`).then(() =>{
                    this.$axios.post('/deleteFile',files).then(res => {
                        console.log(res.data.data)
                        this.handleSuccess()
                    }).catch(() => this.handleSuccess())
                }).catch(() => {});
            },
            handlelink(e){
                if (e.target.nodeName !== 'A') return;
                let filename = e.target.name
                let ele = e.target.innerText
                let uri = '/MyFile/netAnalysis/'+this.taskname+'/result/'+filename
                if (ele.includes('ThresMat')) this.showResult(uri + '/RealNet.mat',filename+'-RealNet.mat')
                if (ele.includes('GenRandNet'))this.downloadResult(uri + '/RandNet.mat', filename+'-RandNet.mat')
                if (ele.includes('SmallWorld')) this.showResult(uri + '/SW.mat', filename+'-SW.mat')
                if (ele.includes('GEfficiency')) this.showResult(uri + '/EFF.mat', filename+'-EFF.mat')
                if (ele.includes('RichClub')) this.showResult(uri + '/RC.mat', filename+'-RC.mat')
                if (ele.includes('Assortativity')) this.showResult(uri + '/ASS.mat', filename+'-ASS.mat')
                if (ele.includes('Synchronization')) this.showResult(uri + '/SYN.mat', filename+'-SYN.mat')
                if (ele.includes('Hierarchy')) this.showResult(uri + '/HIE.mat', filename+'-HIE.mat')
                if (ele.includes('NodalClustCoeff')) this.showResult(uri + '/NCP.mat', filename+'-NCP.mat')
                if (ele.includes('NodalShortestPath')) this.showResult(uri + '/NLP.mat', filename+'-NLP.mat')
                if (ele.includes('NodalEfficiency')) this.showResult(uri + '/NE.mat', filename+'-NE.mat')
                if (ele.includes('NodalLocalEfficiency')) this.showResult(uri + '/NLE.mat', filename+'-NLE.mat')
                if (ele.includes('DegreeCentrality')) this.showResult(uri + '/DC.mat', filename+'-DC.mat')
                if (ele.includes('BetweennessCentrality')) this.showResult(uri + '/BC.mat', filename+'-BC.mat')
                if (ele.includes('CommunityIndex')) this.showResult(uri + '/CI.mat', filename+'-CI.mat')
                if (ele.includes('CommunityIndex')) this.showResult(uri + '/PC.mat', filename+'-PC.mat')
                if (ele.includes('ModularInteraction')) this.showResult(uri + '/MI.mat', filename+'-MI.mat')
            },
            querySearch(queryString, cb) {
                let restaurants = this.taskList;
                let results = queryString ? restaurants.filter(data => !queryString || data.value.toLowerCase().includes(queryString.toLowerCase())) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            updateTableDataList() {
                this.tableDataList = []
                if (this.taskList.length === 0) publicFileList.forEach(v=>this.tableDataList.push(v))
                this.fileList
                    .filter(data => !this.search || data.name.toLowerCase().includes(this.search.toLowerCase()))
                    .forEach(v=>this.tableDataList.push(v))
            },
            initLocal() {
                if (!this.$te(keyName)) {
                    this.$i18n.mergeLocaleMessage('zh', i18nLang.zh)
                    this.$i18n.mergeLocaleMessage('en', i18nLang.en)
                }
            },
            translations(key){
                return this.$t(keyName + '.' + key)
            }
        }
    }
</script>
<style lang='stylus'>
#gretna {
    .box-card {
        opacity: 0.9;
    }
}
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both
}

.box-card {
    width: 480px;
}

.el-scrollbar__wrap{
    overflow-x: hidden;
}

textarea {
    white-space: pre;
}
</style>
