<template>
    <div id="brainNet" style="height: 100%;width: 100%;">
        <div id="importfile">
            <el-button style="width: 100%;text-align: left" @click="setfilelist(surfResForDialog)">{{ surfLabel || translations('surfLabel') }}</el-button>
            <br/>
            <el-button style="width: 100%;text-align: left" @click="setfilelist(nodeResForDialog)">{{ nodeLabel || translations('nodeLabel') }}</el-button>
            <br/>
            <el-button style="width: 100%;text-align: left" @click="setfilelist(edgeResForDialog)">{{ edgeLabel || translations('edgeLabel') }}</el-button>
            <br/>
            <el-button style="width: 100%;text-align: left" @click="setfilelist(niftiResForDialog)">{{ niftiLabel || translations('niftiLabel') }}</el-button>
        </div>
        <div id="controlpanel">
            <el-popover
                    placement="right"
                    width="400"
                    trigger="hover">
                <h3>{{ translations('surfAttr') }}</h3>
                <el-form v-if="bnOption.allMaterial.surfMaterial" :label-position="'left'" label-width="200px" :model="bnOption.allMaterial.surfMaterial">
                    <el-form-item label="Surface Color">
                        <el-color-picker v-model="bnOption.allMaterial.surfMaterial.color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="Surface Opacity">
                        <el-slider v-model="bnOption.allMaterial.surfMaterial.opacity" :min="0.0" :max="1.0" :step="0.01"></el-slider>
                    </el-form-item>
                    <el-form-item label="Surface Clip">
                        <el-switch
                                v-model="bnOption.allMaterial.surfMaterial.clip"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                        <el-slider v-model="bnOption.allMaterial.surfMaterial.clipOffset" :min="-100.0" :max="100.0" :step="0.1" range></el-slider>
                    </el-form-item>
                </el-form>
                <el-button slot="reference" type="text">{{ translations('surfAttr') }}</el-button>
            </el-popover>
            <br/>
            <el-popover
                    placement="right"
                    width="300"
                    trigger="hover">
                <h3>{{ translations('nodeAttr') }}</h3>
                <div v-if="bnOption.allMaterial.nodeMaterial" style="text-align: right; margin: 0">
                </div>
                <el-button slot="reference" type="text">{{ translations('nodeAttr') }}</el-button>
            </el-popover>
            <br/>
            <el-popover
                    placement="right"
                    width="400"
                    trigger="hover">
                <h3>{{ translations('edgeAttr') }}</h3>
                <div v-if="bnOption.allMaterial.lineMaterial" style="text-align: right; margin: 0">
                    <el-form v-if="bnOption.allMaterial.lineMaterial" :label-position="'left'" label-width="200px" :model="bnOption.allMaterial.lineMaterial">
                        <span style="float: left">Connection Weight Range</span>
                        <br/>
                        <el-row>
                            <el-input-number style="float: left" v-model="bnOption.allMaterial.lineMaterial.lineWidth[0]" :precision="2" :step="0.01" :min="bnOption.allMaterial.lineMaterial.minWeight" :max="bnOption.allMaterial.lineMaterial.lineWidth[1]" @change="refreashSlider()"></el-input-number>
                            <el-input-number v-model="bnOption.allMaterial.lineMaterial.lineWidth[1]" :precision="2" :step="0.01" :min="bnOption.allMaterial.lineMaterial.lineWidth[0]" :max="bnOption.allMaterial.lineMaterial.maxWeight" @change="refreashSlider()"></el-input-number>
                        </el-row>
                        <el-slider v-model="bnOption.allMaterial.lineMaterial.lineWidth" :min="bnOption.allMaterial.lineMaterial.minWeight" :step="0.01" :max="bnOption.allMaterial.lineMaterial.maxWeight" :range="true"></el-slider>
                        <el-button @click="() => bnOption.lflag = true">Set Range</el-button>
                        <!--<el-form-item label="Connection Opacity">-->
                            <!--<el-slider v-model="bnOption.allMaterial.lineMaterial.opacity" :min="0.0" :max="1.0" :step="0.01"></el-slider>-->
                        <!--</el-form-item>-->
                        <el-form-item label="Connection Size">
                            <el-input-number v-model="bnOption.allMaterial.lineMaterial.size" @change="() => bnOption.lflag = true" :min="1" :max="10"></el-input-number>
                        </el-form-item>
                        <el-form-item label="Connection Color">
                            <el-color-picker v-model="bnOption.allMaterial.lineMaterial.color" @change="()=> bnOption.lflag = true"></el-color-picker>
                        </el-form-item>
                    </el-form>
                </div>
                <el-button slot="reference" type="text">{{ translations('edgeAttr') }}</el-button>
            </el-popover>
            <br/>
            <el-popover
                    placement="right"
                    width="350"
                    trigger="click">
                <div v-if="bnOption.NIFTIModel" style="width: 320px;" v-loading="niftizoomflag">
                    <el-row type="flex">
                        <img @click="imgClickEvent('z', $event)" style="display: block;background-color: black" :src="bnOption.NIFTIModel.z_img" width="160" height="220"/>
                        <img @click="imgClickEvent('x', $event)" style="display: block;background-color: black" :src="bnOption.NIFTIModel.x_img" width="160" height="220"/>
                    </el-row>
                    <img @click="imgClickEvent('y', $event)" style="display: block;background-color: black" :src="bnOption.NIFTIModel.y_img" width="160" height="160"/>
                </div>
                <el-slider style="float: bottom" v-model="numOfslice" :max="180"></el-slider>
                <el-button slot="reference" type="text">{{ translations('niftiAttr') }}</el-button>
            </el-popover>
        </div>
        <el-dialog :title=" dialogTitle " :visible.sync="dialogTableVisible" :modal-append-to-body="false">
            <el-tree
                    :data="dialogData"
                    node-key="id"
                    :expand-on-click-node="true"
                    :modal-append-to-body='false'>
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span v-if="data.children == undefined" @click="() => downloadData(node)"><i class="el-icon-document"></i>{{ node.label }}</span>
                    <span v-else><i class="iconfont icon-dir"></i>{{ node.label }}</span>
                </span>
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="localfileinput">{{translations('importfile')}}</el-button>
                <el-button @click="dialogTableVisible = false">{{$t('el.messagebox.cancel')}}</el-button>
            </span>
        </el-dialog>
        <!--<el-dialog title="Connection Chord" custom-class="connection" :visible.sync="chordVisible" :modal-append-to-body="false">-->
            <!--<chord></chord>-->
            <!--&lt;!&ndash;<heatmap></heatmap>&ndash;&gt;-->
        <!--</el-dialog>-->
    </div>
</template>
<script>
    /* eslint-disable */
    import { NIFTILoader } from '@/utils/NIFTILoader'
    import chord from './chord'
    import heatmap from './heatmap'
    import { surfIndex, nodeIndex, edgeIndex, niftiIndex } from '../data-index'
    import i18nLang from './i18n-lang'
    const keyName = 'brainViewer'
    export default {
    name: 'brainSide',
    data() {
      return {
          dialogTableVisible: false,
          surfResForDialog: {
              fileType: 'surf',
              acceptType: ['*.nv']
          },
          nodeResForDialog: {
              fileType: 'node',
              acceptType: ['*.node']
          },
          edgeResForDialog: {
              fileType: 'edge',
              acceptType: ['*.edge']
          },
          niftiResForDialog: {
              fileType: 'nifti',
              acceptType: ['*.nii']
          },
          dialogTitle: null,
          dialogData: null,
          fileType: '',
          numOfslice: 0,
          surfLabel: null,
          nodeLabel: null,
          edgeLabel: null,
          niftiLabel: null,
          atlasSelect: 'aal',
          chordData: [],
          // chordVisible: true,
          bnOption: this.$store.state.bnOption,
          niftizoomflag: false
      }
    },
    components: {chord,heatmap},
    methods: {
        init: function() {
          // document.getElementById('menuItem').style.display = 'none';
        },
        downloadData: function(node) {
          let url = node.data.uri;
          const self = this;
          if (this.fileType === 'nifti') fetch('http:' + window.g.API_URL + '/' + url, {
              headers: {
                  'Accept': 'application/octet-stream',
                  'content-type': 'application/octet-stream'
              },
              method: 'GET',
              credentials: 'include'
          }).then(data => data.arrayBuffer()).then(data => {
              if (data) {
                  delete self.bnOption.NIFTIModel;
                  let loader = self.bnOption.NIFTIModel = new NIFTILoader();
                  loader.load(data);
                  self.bnOption.sflag = true;
              }
          })
          else this.$axios.get(url).then(data => {
              if (data){
                  delete self.bnOption.allDATA[ self.fileType + 'DATA' ];
                  self.bnOption.allDATA[ self.fileType + 'DATA' ] = data.data;
                  self.bnOption.sflag = true;
              }
          });
          this.dialogTableVisible = false;
        },
        localfileinput: function(){
          let self = this;
          let input = document.createElement('input');
          input.type = 'file';
          input.onchange = function(ev) {
              const file = ev.target.files[0];
              var reader = new FileReader();
              reader.onload = function (e) {
                  delete self.bnOption.allDATA[ self.fileType + 'DATA' ];
                  var text = reader.result;
                  self.bnOption.allDATA[ self.fileType + 'DATA' ] = text;
                  self.bnOption.sflag = true;
              };
              reader.readAsText(file);
              self[ self.fileType + 'Label' ] = file.name;
              return false;
          };
          if (this.fileType === 'surf') {
              input.accept = '.nv';
          } else if (this.fileType === 'node') {
              input.accept = '.node';
          } else if (this.fileType === 'edge') {
              input.accept = '.edge';
          } else if (this.fileType === 'nifti') {
              input.accept = '.nii,.nii.gz';
              input.onchange = function(ev) {
                  delete self.bnOption.NIFTIModel;
                  let loader = self.bnOption.NIFTIModel = new NIFTILoader();
                  const file = ev.target.files[0];
                  let reader = new FileReader();
                  reader.onload = function (e) {
                      let buffer = reader.result;
                      loader.load(buffer);
                      self.bnOption.sflag = true;
                  };
                  reader.readAsArrayBuffer(file);
                  self.niftiLabel = file.name;
                  return false;
              };
          } else return;
          input.click();
          this.dialogTableVisible = false;
        },
        setfilelist: function (resForDialog) {
            if (resForDialog.fileType === 'surf') this.dialogData = surfIndex;
            if (resForDialog.fileType === 'node') this.dialogData = nodeIndex;
            if (resForDialog.fileType === 'edge') this.dialogData = edgeIndex;
            if (resForDialog.fileType === 'nifti') this.dialogData = niftiIndex;
            this.dialogTitle = this.translations(resForDialog.fileType + 'Label');
            this.fileType = resForDialog.fileType;
            this.dialogTableVisible = true;
        },
        initLocal() {
            if (!this.$te(keyName)) {
                this.$i18n.mergeLocaleMessage('zh', i18nLang.zh)
                this.$i18n.mergeLocaleMessage('en', i18nLang.en)
            }
        },
        translations(key){
            return this.$t('brainViewer.' + key)
        },
        refreashSlider(){
            let lineWidth = this.bnOption.allMaterial.lineMaterial.lineWidth
            // this.$refs['myslider'].value = [0,10]
            this.bnOption.allMaterial.lineMaterial.lineWidth = null
            this.bnOption.allMaterial.lineMaterial.lineWidth = lineWidth
            // this.$set(lineWidth, 0, 0.5)
        },
        imgClickEvent(tag, event){
            const nifti = this.bnOption.NIFTIModel
            let cols = nifti.niftiHeader.dims[1];
            let rows = nifti.niftiHeader.dims[2];
            let slices = nifti.niftiHeader.dims[3];
            let offsetX = event.offsetX;
            let offsetY = event.offsetY;
            switch (tag){
                case 'x':
                    nifti.py = offsetY / 220 * rows;
                    nifti.pz = offsetX / 160 * slices;
                    break;
                case 'y':
                    nifti.px = offsetX / 160 * cols;
                    nifti.pz = (160 - offsetY) / 160 * slices;
                    break;
                case 'z':
                    nifti.px = offsetX / 160 * cols;
                    nifti.py = offsetY / 220 * rows;
                    break;
                default: break;
            }
            nifti.px = parseInt(nifti.px)
            nifti.py = parseInt(nifti.py)
            nifti.pz = parseInt(nifti.pz)
            nifti.drawAuxiliary()
            this.numOfslice++
            this.niftizoomflag = true
            setTimeout(()=>this.niftizoomflag = false, 100)
        }
    },
    created() {
        this.initLocal();
    },
    mounted() {
        this.bnOption.sflag = false;
        this.bnOption.allDATA = {};
        this.bnOption.allMaterial = {
          surfMaterial: {
              color: '#f8f8ff',
              opacity: 0.55,
              clip: false,
              clipOffset: [-100,0]
          },
          lineMaterial: {
              color: '#ffff00',
              // opacity: 1,
              lineWidth: [0,1],
              minWeight:0,
              maxWeight:10,
              size: 1
          }
        }
        this.bnOption.NIFTIModel = null;
        this.init();
    }
  }
</script>
<style scoped>
    #importfile{
        padding-right: 5px;
        padding-left: 5px;
    }
    #controlpanel{
        border: 1px solid #99D3F5;
        border-radius: 4px;
        margin: 5px;
        background-color: #304156;
    }
    .file input {
        position: absolute;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    /*.connection{*/
        /*width: 80%;*/
    /*}*/
</style>
