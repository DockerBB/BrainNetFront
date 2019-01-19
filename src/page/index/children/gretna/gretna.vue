<template>
    <div id="gretna" :style="background">
        <el-row type="flex" justify="center">
            <el-col type="flex" style="width: auto!important;">
                <el-card class="box-card">
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
                <el-card class="box-card">
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
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>{{ NetworkCard.title }}</span>
                    <div style="float: right; padding: 3px 0" >
                        <el-button icon="el-icon-arrow-left" @click="removeOption()" circle></el-button>
                    </div>
                </div>
                <el-table :data="fileList" style="width: 100%" type="selection">
                    <el-table-column type="selection" width="55" ></el-table-column>
                    <el-table-column
                            label="file"
                            prop="name">
                    </el-table-column>
                    <el-table-column align="right">
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mini"
                                    placeholder="输入关键字搜索"/>
                        </template>
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.$index)">Delete</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-upload
                        class="upload matrix file"
                        action="http://47.107.40.143:8080/uploadsinglefile"
                        :with-credentials='true'
                        :on-preview="handlePreview"
                        :auto-upload="true"
                        :show-file-list="false"
                        multiple
                        :limit="5"
                        :file-list="fileList">
                    <el-button slot="trigger" size="small" type="primary" round>{{ translations('importMatrix') }}</el-button>
                    <div slot="tip" class="el-upload__tip">{{ translations('uploadtip') }}</div>
                </el-upload>
                <el-form :inline="true" :model="NetworkConfiguration" :hidden="NetworkCard.optionCount < 1">
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
                        <el-input :value="NetworkConfiguration.thresSequence.toString()"></el-input>
                    </el-form-item>
                    <p class="item text"> . Network Type</p>
                    <el-form-item label=" . . Type:  ">
                        <el-select v-model="NetworkConfiguration.netType">
                            <el-option label="Binary" :value="1"></el-option>
                            <el-option label="Weighted" :value="2"></el-option>
                        </el-select>
                    </el-form-item>

                    <div :hidden="GlobalNetworkMetrics.showable.reduce((total, v) => v === true ? total + 1 : total + 0, 0) < 1">
                        <p class="item text"> . Random Network Generation</p>
                        <el-form-item label=" . . Random Network Number:  ">
                            <el-input :value="NetworkConfiguration.randNetworkNum"></el-input>
                        </el-form-item>
                        <p class="item text">{{ GlobalNetworkMetrics.title }}</p>
                        <div v-for="(value,key) in GlobalNetworkMetrics.item" :key="key" class="text item">
                            <el-radio v-model="GlobalNetworkMetrics.selected" :label="key" :hidden="!GlobalNetworkMetrics.showable[key]">{{ value }}</el-radio>
                        </div>
                    </div>
                    <div :hidden="NodalandModularNetworkMetrics.showable.reduce((total, v) => v === true ? total + 1 : total + 0, 0) < 1">
                        <p class="item text">{{ NodalandModularNetworkMetrics.title }}</p>
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
                        </div>
                    </div>
                    <el-row type="flex" justify="end">
                        <el-button type="primary" @click="onSubmit">RUN</el-button>
                    </el-row>
                </el-form>
            </el-card>
        </el-row>
        <el-dialog :title="translations('displayDiagTitle')" :visible.sync="dialogTableVisible">
            <el-checkbox-group v-model="checkboxGroup" @change="()=>console.log('checkboxGroup')">
                <el-checkbox-button label="Chord Graph"></el-checkbox-button>
                <el-checkbox-button label="Heat Map Graph"></el-checkbox-button>
            </el-checkbox-group>
            <div :hidden="checkboxGroup.indexOf('Chord Graph') === -1">
                <chord :chord-data="chordData" :size="500"></chord>
            </div>
            <div :hidden="checkboxGroup.indexOf('Heat Map Graph') === -1">
                <heatmap :heatmap-data="heatmapData" :size="500"></heatmap>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    /* eslint-disable */
    import { request } from '@/utils/request'
    import { EdgeLoader } from '@/utils/EdgeLoader'
    import i18nLang from './i18n-lang'
    import Chord from './chord'
    import Heatmap from './heatmap'
    const keyName = 'netAnalysis'
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
                dialogTableVisible: false,
                runDialogTableVisible: false,
                chordData: null,
                heatmapData: null,
                checkboxGroup: [],
                fileListGroup:[],
                isIndeterminate: false,
                checkAll: false,
                NetworkCard:{
                    title: 'Network Configuration',
                    optionCount: 0,
                    globalOptionCount:0,
                    nodalOptionCount:0,
                    selected: 0,
                },
                NetworkConfiguration: {
                    signType:1,
                    thresMethod:1,
                    thresSequence:[0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.3,0.45,0.5],
                    netType:1,
                    randNetworkNum: 100,
                    clustAlgor: 1,
                    modulAlgor: 1,
                    dDPcFlag: 1,
                    toDoList:[],
                    fileListGroup: [],
                    realNetURI: null
                },
                GlobalNetworkMetrics: {
                    title: 'Global Network Metrics',
                    selected: 0,
                    showable: [false,false,false,false,false,false],
                    item: ['Global - Small-World','Global - Efficiency','Global - Rich-Club','Global - Assortativity','Global - Synchronization','Global - Hierarchy']
                },
                NodalandModularNetworkMetrics: {
                    title: 'Nodal and Modular Network Metrics',
                    selected: 0,
                    showable: [false,false,false,false,false,false,false,false,false],
                    item: ['Nodal - Clustering Coefficient','Nodal - Shortest Path Length','Nodal - Efficiency','Nodal - Local Efficiency','Nodal - Degree Centrality','Nodal - Betweenness Centrality','Nodal - Community Index','Nodal - Participant Coefficient','Modular - Interaction']
                },
                fileList: [{name: 'Edge_AAL90_Binary.edge', url: 'http://www.aknifezndx.top:8080/public/AAL90/Edge_AAL90_Binary.edge'}, {name: 'Edge_Fair34_Binary.edge', url: 'http://www.aknifezndx.top:8080/public/Fair34/Edge_Fair34_Binary.edge'}]
            }
        },
        created() {
            this.initLocal();
        },
        mounted() {
        },
        methods: {
            inputOption: function (card) {
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
                this.NetworkConfiguration.toDoList = [];
                let arr = this.NetworkConfiguration.toDoList;
                for(let i = 0;i < g.item.length;i++) if (g.showable[i]) arr[arr.length] = g.item[i];
                for(let i = 0;i < n.item.length;i++) if (n.showable[i]) arr[arr.length] = n.item[i];
                if (this.NetworkConfiguration.realNetURI != null) request('/gretna', 'POST', this.NetworkConfiguration);
                else this.$message({
                    message: '未选择矩阵文件',
                    type: 'warning'
                });
            },
            getRealNetURI: function(node) {
                let url = node.label;
                this.selectLabel = node.label;
                while (node.parent.label) {
                    url = node.parent.label + '/' + url;
                    node = node.parent
                }
                this.NetworkConfiguration.realNetURI = url;
                this.dialogTableVisible = false;
            },
            handlePreview(file) {
                const self = this;
                let roiLabel;
                request('http://brainSci.tools/aal90label', 'GET').then(res => {
                    roiLabel = res.data.label;
                    return request(file.url, 'get')
                }).then(data => {
                    if (data){
                        self.chordData = {
                            matrix: new EdgeLoader().loadMatrix(data),
                            label: roiLabel
                        };
                        self.heatmapData = {
                            data: new EdgeLoader().loadAList(data),
                            label: roiLabel
                        };
                    }
                })
                this.dialogTableVisible = true;
            },
            handleDelete(index) {
                this.$confirm(`确定从服务器移除文件 ${ this.fileList[index].name }？`).then(() =>{
                    let li = this.fileList;
                    let len = this.fileList.length - 1;
                    this.fileList = [];
                    li.filter((v,i) => i !== index).forEach(v => this.fileList.push(v))
                }).catch(() => {});
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
</style>
