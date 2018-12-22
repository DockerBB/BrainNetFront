<template>
    <div id="net">
        <el-dialog :title=" translations('dialogTitle') " :visible.sync="dialogTableVisible">
            <el-tree
                    :data="dialogData"
                    node-key="id"
                    :expand-on-click-node="true">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span v-if="data.children === undefined" @click="() => downloadMatrix(node)"><img src="@/assets/img/wendang.png" height="16" width="16"/>{{ node.label }}</span>
                    <span v-else><img src="@/assets/img/wenjianjia.png" height="16" width="16"/>{{ node.label }}</span>
                </span>
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-button @click="setfilelist">{{ translations('importLabel') }}</el-button>
        <chord :chord-data="chordData"></chord>
        <heatmap :heatmap-data="heatmapData"></heatmap>
    </div>
</template>

<script>
    /* eslint-disable */
    import Chord from './chord'
    import Heatmap from './heatmap'
    import i18nLang from './i18n-lang'
    import { request } from '@/utils/request'
    import { EdgeLoader } from '@/utils/EdgeLoader'
    const keyName = 'networkViewer'
    export default {
        name: "networkviewer",
        components: { Heatmap, Chord },
        data() {
            return {
                dialogTableVisible: false,
                dialogData: null,
                chordData: null,
                heatmapData: null,
            }
        },
        mounted() {
            this.initLocal();
        },
        methods: {
            initLocal() {
                if (!this.$te(keyName)) {
                    this.$i18n.mergeLocaleMessage('zh', i18nLang.zh)
                    this.$i18n.mergeLocaleMessage('en', i18nLang.en)
                }
            },
            downloadMatrix: function(node) {
                var url = node.label;
                let all90label = [
                    'PreCG.L',
                    'PreCG.R',
                    'SFGdor.L',
                    'SFGdor.R',
                    'ORBsup.L',
                    'ORBsup.R',
                    'MFG.L',
                    'MFG.R',
                    'ORBmid.L',
                    'ORBmid.R',
                    'IFGoperc.L',
                    'IFGoperc.R',
                    'IFGtriang.L',
                    'IFGtriang.R',
                    'ORBinf.L',
                    'ORBinf.R',
                    'ROL.L',
                    'ROL.R',
                    'SMA.L',
                    'SMA.R',
                    'OLF.L',
                    'OLF.R',
                    'SFGmed.L',
                    'SFGmed.R',
                    'ORBsupmed.L',
                    'ORBsupmed.R',
                    'REC.L',
                    'REC.R',
                    'INS.L',
                    'INS.R',
                    'ACG.L',
                    'ACG.R',
                    'DCG.L',
                    'DCG.R',
                    'PCG.L',
                    'PCG.R',
                    'HIP.L',
                    'HIP.R',
                    'PHG.L',
                    'PHG.R',
                    'AMYG.L',
                    'AMYG.R',
                    'CAL.L',
                    'CAL.R',
                    'CUN.L',
                    'CUN.R',
                    'LING.L',
                    'LING.R',
                    'SOG.L',
                    'SOG.R',
                    'MOG.L',
                    'MOG.R',
                    'IOG.L',
                    'IOG.R',
                    'FFG.L',
                    'FFG.R',
                    'PoCG.L',
                    'PoCG.R',
                    'SPG.L',
                    'SPG.R',
                    'IPL.L',
                    'IPL.R',
                    'SMG.L',
                    'SMG.R',
                    'ANG.L',
                    'ANG.R',
                    'PCUN.L',
                    'PCUN.R',
                    'PCL.L',
                    'PCL.R',
                    'CAU.L',
                    'CAU.R',
                    'PUT.L',
                    'PUT.R',
                    'PAL.L',
                    'PAL.R',
                    'THA.L',
                    'THA.R',
                    'HES.L',
                    'HES.R',
                    'STG.L',
                    'STG.R',
                    'TPOsup.L',
                    'TPOsup.R',
                    'MTG.L',
                    'MTG.R',
                    'TPOmid.L',
                    'TPOmid.R',
                    'ITG.L',
                    'ITG.R'
                ];
                this[ this.fileType + 'Label' ] = node.label;
                while(node.parent.label){
                    url = node.parent.label + '/' + url;
                    node = node.parent
                }
                const self = this;
                request(url, 'get').then(data => {
                    if (data){
                        self.chordData = {
                            matrix: new EdgeLoader().loadMatrix(data),
                            label: all90label
                        };
                        self.heatmapData = {
                            data: new EdgeLoader().loadAList(data),
                            label: all90label
                        };
                    }
                });
                this.dialogTableVisible = false;
            },
            setfilelist: function () {
                this.dialogData = [];
                request('/getfilelist','POST',['*.edge']).then(data => {
                    this.dialogData = data.data;
                });
                this.dialogTableVisible = true;
            },
            loadmatrix: function () {
                let all90label = [
                    'PreCG.L',
                    'PreCG.R',
                    'SFGdor.L',
                    'SFGdor.R',
                    'ORBsup.L',
                    'ORBsup.R',
                    'MFG.L',
                    'MFG.R',
                    'ORBmid.L',
                    'ORBmid.R',
                    'IFGoperc.L',
                    'IFGoperc.R',
                    'IFGtriang.L',
                    'IFGtriang.R',
                    'ORBinf.L',
                    'ORBinf.R',
                    'ROL.L',
                    'ROL.R',
                    'SMA.L',
                    'SMA.R',
                    'OLF.L',
                    'OLF.R',
                    'SFGmed.L',
                    'SFGmed.R',
                    'ORBsupmed.L',
                    'ORBsupmed.R',
                    'REC.L',
                    'REC.R',
                    'INS.L',
                    'INS.R',
                    'ACG.L',
                    'ACG.R',
                    'DCG.L',
                    'DCG.R',
                    'PCG.L',
                    'PCG.R',
                    'HIP.L',
                    'HIP.R',
                    'PHG.L',
                    'PHG.R',
                    'AMYG.L',
                    'AMYG.R',
                    'CAL.L',
                    'CAL.R',
                    'CUN.L',
                    'CUN.R',
                    'LING.L',
                    'LING.R',
                    'SOG.L',
                    'SOG.R',
                    'MOG.L',
                    'MOG.R',
                    'IOG.L',
                    'IOG.R',
                    'FFG.L',
                    'FFG.R',
                    'PoCG.L',
                    'PoCG.R',
                    'SPG.L',
                    'SPG.R',
                    'IPL.L',
                    'IPL.R',
                    'SMG.L',
                    'SMG.R',
                    'ANG.L',
                    'ANG.R',
                    'PCUN.L',
                    'PCUN.R',
                    'PCL.L',
                    'PCL.R',
                    'CAU.L',
                    'CAU.R',
                    'PUT.L',
                    'PUT.R',
                    'PAL.L',
                    'PAL.R',
                    'THA.L',
                    'THA.R',
                    'HES.L',
                    'HES.R',
                    'STG.L',
                    'STG.R',
                    'TPOsup.L',
                    'TPOsup.R',
                    'MTG.L',
                    'MTG.R',
                    'TPOmid.L',
                    'TPOmid.R',
                    'ITG.L',
                    'ITG.R'
                ];
                let self = this;
                var input = document.createElement('input');
                input.type = 'file';
                input.onchange = function(ev) {
                    const file = ev.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var text = reader.result;
                        self.chordData = {
                            matrix: new EdgeLoader().loadMatrix(text),
                            label: all90label
                        };
                        self.heatmapData = {
                            data: new EdgeLoader().loadAList(text),
                            label: all90label
                        };
                    };
                    reader.readAsText(file);
                    return false;
                };
                input.click();
            },
            translations(key){
                return this.$t(keyName + '.' + key)
            }
        }
    }
</script>

<style scoped>
#net{

}
</style>