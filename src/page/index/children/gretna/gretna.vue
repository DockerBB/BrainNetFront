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
                <el-form :inline="true" :model="NetworkConfiguration" :hidden="NetworkCard.optionCount < 1">
                    <el-form-item label="Brain Connectivity Matrix">
                        <el-button style="width: 100%" @click="setfilelist()">{{ selectLabel == null ? '请选择矩阵文件':selectLabel }}</el-button>
                    </el-form-item>
                    <p class="item text"> . Sign of Matrix</p>
                    <el-form-item label=" . . Sign:  ">
                        <el-select v-model="NetworkConfiguration.signType">
                            <el-option label="Postive" value="POSTIVE"></el-option>
                            <el-option label="Nagtive" value="NAGTIVE"></el-option>
                            <el-option label="Absolute" value="ABSOLUTE"></el-option>
                        </el-select>
                    </el-form-item>
                    <p class="item text"> . Thresholding Method</p>
                    <el-form-item label=" . . Method:  ">
                        <el-select v-model="NetworkConfiguration.thresMethod">
                            <el-option label="Network Sparsity" value="NETWORKSPARSITY"></el-option>
                            <el-option label="Value of Matrix Elemnt" value="MATRIXELEMENT"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" . . Threshold Sequence:  ">
                        <el-input :value="NetworkConfiguration.thresSequence"></el-input>
                    </el-form-item>
                    <p class="item text"> . Network Type</p>
                    <el-form-item label=" . . Type:  ">
                        <el-select v-model="NetworkConfiguration.netType">
                            <el-option label="Binary" value="BINARY"></el-option>
                            <el-option label="Weighted" value="WEIGHTED"></el-option>
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
                        </div>
                    </div>
                    <el-row type="flex" justify="end">
                        <el-button type="primary" @click="onSubmit">RUN</el-button>
                    </el-row>
                </el-form>
            </el-card>
        </el-row>
        <el-dialog title="Brain Connectivity Matrix" :visible.sync="dialogTableVisible">
            <el-tree
                    :data="dialogData"
                    node-key="id"
                    :expand-on-click-node="true">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span v-if="data.children === undefined" @click="() => getRealNetURI(node)"><img src="@/assets/img/wendang.png" height="16" width="16"/>{{ node.label }}</span>
                    <span v-else><img src="@/assets/img/wenjianjia.png" height="16" width="16"/>{{ node.label }}</span>
                </span>
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    /* eslint-disable */
    import { request } from '@/utils/request'
    export default {
        name: 'gretna',
        data() {
            return {
                background: {
                    backgroundImage: "url(" + require("@/assets/img/background.jpg") + ")",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                },
                dialogTableVisible: false,
                dialogData: null,
                selectLabel: null,
                NetworkCard:{
                    title: 'Network Configuration',
                    optionCount: 0,
                    globalOptionCount:0,
                    nodalOptionCount:0,
                    selected: 0,
                },
                NetworkConfiguration: {
                    signType:'POSTIVE',
                    thresMethod:'NETWORKSPARSITY',
                    thresSequence:[0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.3,0.45,0.5],
                    netType:'BINARY',
                    randNetworkNum: 100,
                    toDoList:[],
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
                    showable: [false,false,false,false,false,false,false,false],
                    item: ['Nodal - Shortest Path Length','Nodal - Efficiency','Nodal - Local Efficiency','Nodal - Degree Centrality','Nodal - Betweenness Centrality','Nodal - Community Index','Nodal - Participant Coefficient','Modular - Interaction']
                }
            }
        },

        mounted() {
        },
        methods: {
            inputOption: function (card) {
                card.showable[card.selected] = true;
                for(card.selected = 0;card.showable[card.selected];card.selected++);
                this.updateOptionCount();
            },
            removeOption: function () {
                let g = this.GlobalNetworkMetrics;
                let n = this.NodalandModularNetworkMetrics;
                if (g.showable[g.selected]) {
                    g.showable[g.selected] = false;
                    for(g.selected = 0;g.showable[g.selected] == false;g.selected++);
                }
                if (n.showable[n.selected]) {
                    n.showable[n.selected] = false;
                    for(n.selected = 0;n.showable[n.selected] == false;n.selected++);
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
            setfilelist: function () {
                this.dialogData = [];
                this.NetworkConfiguration.realNetURI = null;
                this.selectLabel = null;
                request('/getfilelist','POST',[]).then(data => {
                    this.dialogData = data.data;
                });
                this.dialogTableVisible = true;
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
