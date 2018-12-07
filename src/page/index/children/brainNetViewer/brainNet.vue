<template>
    <div id="brainNet" style="height: 100%;width: 100%;">
        <div id="importfile">
            <el-button style="width: 100%" @click="setfilelist(surfResForDialog)">{{ surfLabel }}</el-button>
            <br/>
            <el-button style="width: 100%" @click="setfilelist(nodeResForDialog)">{{ nodeLabel }}</el-button>
            <br/>
            <el-button style="width: 100%" @click="setfilelist(edgeResForDialog)">{{ edgeLabel }}</el-button>
            <br/>
            <el-button style="width: 100%" @click="setfilelist(niftiResForDialog)">{{ niftiLabel }}</el-button>
        </div>
        <div id="controlpanel">
            <el-popover
                    placement="right"
                    width="300"
                    trigger="hover">
                <h3>设置脑曲面的属性</h3>
                <el-form v-if="bnOption.allMaterial.surfMaterial" :label-position="'left'" label-width="100px" :model="bnOption.allMaterial.surfMaterial">
                    <el-form-item label="脑曲面颜色">
                        <el-color-picker v-model="bnOption.allMaterial.surfMaterial.color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="脑曲面透明度">
                        <el-slider v-model="bnOption.allMaterial.surfMaterial.opacity" :min="0.0" :max="1.0" :step="0.01"></el-slider>
                    </el-form-item>
                    <el-form-item label="脑曲切面">
                        <el-switch
                                v-model="bnOption.allMaterial.surfMaterial.clip"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </el-form-item>
                    <el-button @click="getPhoto">屏幕快照</el-button>
                </el-form>
                <el-button slot="reference" type="text">脑曲面</el-button>
            </el-popover>
            <br/>
            <el-popover
                    placement="right"
                    width="300"
                    trigger="hover">
                <h3>设置节点的属性</h3>
                <div v-if="bnOption.allMaterial.nodeMaterial" style="text-align: right; margin: 0">
                </div>
                <el-button slot="reference" type="text">节点</el-button>
            </el-popover>
            <br/>
            <el-popover
                    placement="right"
                    width="300"
                    trigger="hover">
                <h3>设置联结的属性</h3>
                <div v-if="bnOption.allMaterial.lineMaterial" style="text-align: right; margin: 0">
                    <el-slider v-model="bnOption.allMaterial.lineMaterial.lineWidth" :max="50" :step="5" show-input show-stops></el-slider>
                    <el-color-picker v-model="bnOption.allMaterial.lineMaterial.color"></el-color-picker>
                    <el-slider v-model="bnOption.allMaterial.lineMaterial.opacity" :min="0.0" :max="1.0" :step="0.01"></el-slider>
                </div>
                <el-button slot="reference" type="text">联结</el-button>
            </el-popover>
            <br/>
            <el-popover
                    placement="right"
                    width="300"
                    trigger="hover">
                <img v-if="bnOption.NIFTIModel" :src="bnOption.NIFTIModel.z_slice[numOfslice]" width="240px" height="330"/>
                <el-slider v-model="numOfslice" :max="180"></el-slider>
                <el-button slot="reference" type="text">容器</el-button>
            </el-popover>
        </div>
        <el-dialog :title=" dialogTitle " :visible.sync="dialogTableVisible">
            <el-tree
                    :data="dialogData"
                    node-key="id"
                    :expand-on-click-node="true">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <!--<i v-if="data.children === undefined" class="el-icon-document"><span>{{ node.label }}</span></i>-->
                    <!--<i v-else class="el-icon-news" ><span>{{ node.label }}</span></i>-->
                    <span v-if="data.children === undefined"><img src="@/assets/img/wendang.png" height="16" width="16"/>{{ node.label }}</span>
                    <span v-else><img src="@/assets/img/wenjianjia.png" height="16" width="16"/>{{ node.label }}</span>
                    <el-button v-if="data.children === undefined" type="text" size="mini" @click="() => downloadData(node)">添加</el-button>
                </span>
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="localfileinput">从本地导入</el-button>
                <el-button @click="dialogTableVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    /* eslint-disable */
    import { NIFTILoader } from '@/utils/NIFTILoader'
    import { request } from '@/utils/request'
    export default {
    name: 'brainSide',
    data() {
      return {
          dialogTableVisible: false,
          surfResForDialog: {
              dialogTitle: '导入脑曲面文件*.nv',
              fileType: 'surf',
              acceptType: ['*.nv']
          },
          nodeResForDialog: {
              dialogTitle: '导入节点文件*.node',
              fileType: 'node',
              acceptType: ['*.node']
          },
          edgeResForDialog: {
              dialogTitle: '导入连接文件*.edge',
              fileType: 'edge',
              acceptType: ['*.edge']
          },
          niftiResForDialog: {
              dialogTitle: '导入容器文件*.nii',
              fileType: 'nifti',
              acceptType: ['*.nii']
          },
          dialogTitle: null,
          dialogData: null,
          fileType: '',
          numOfslice: 0,
          surfLabel: '导入脑曲面文件*.nv',
          nodeLabel: '导入节点文件*.node',
          edgeLabel: '导入连接文件*.edge',
          niftiLabel: '导入容器文件*.nii',
          bnOption: this.$store.state.bnOption
      }
    },
    methods: {
      init: function() {
          // document.getElementById('menuItem').style.display = 'none';
      },
      getPhoto: function() {
          var canvas = document.getElementById('WebGL-output').children[0];
          // var canvas = URL.createObjectURL(document.getElementById('WebGL-output').children[0]);
          var gl = canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});
          console.log(canvas.toDataURL());
      },
      downloadData: function(node) {
          var url = node.label;
          this[ this.fileType + 'Label' ] = node.label;
          while(node.parent.label){
              url = node.parent.label + '/' + url;
              node = node.parent
          }
          const self = this;
          if (this.fileType === 'nifti') request(url, 'arrayBuffer').then(data => {
              if (data) {
                  delete self.bnOption.NIFTIModel;
                  var loader = self.bnOption.NIFTIModel = new NIFTILoader();
                  loader.load(data);
                  self.bnOption.flag = true;
              }
          });
          else request(url, 'get').then(data => {
              if (data){
                  delete self.bnOption.allDATA[ self.fileType + 'DATA' ];
                  self.bnOption.allDATA[ self.fileType + 'DATA' ] = data;
                  self.bnOption.flag = true;
              }
          });
          this.dialogTableVisible = false;
      },
      localfileinput: function(){
          let self = this;
          var input = document.createElement('input');
          input.type = 'file';
          input.onchange = function(ev) {
              const file = ev.target.files[0];
              var reader = new FileReader();
              reader.onload = function (e) {
                  delete self.bnOption.allDATA[ self.fileType + 'DATA' ];
                  var text = reader.result;
                  self.bnOption.allDATA[ self.fileType + 'DATA' ] = text;
                  self.bnOption.flag = true;
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
              input.accept = '.nii';
              input.onchange = function(ev) {
                  delete self.bnOption.NIFTIModel;
                  var loader = self.bnOption.NIFTIModel = new NIFTILoader();
                  const file = ev.target.files[0];
                  var reader = new FileReader();
                  reader.onload = function (e) {
                      var buffer = reader.result;
                      loader.load(buffer);
                      self.bnOption.flag = true;
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
          this.dialogData = [];
          request('/getfilelist','POST',resForDialog.acceptType).then(data => {
              this.dialogData = data.data;
          });
          this.dialogTitle = resForDialog.title;
          this.fileType = resForDialog.fileType;
          this.dialogTableVisible = true;
      }
    },
    mounted() {
      this.bnOption.flag = false;
      this.bnOption.allDATA = {};
      this.bnOption.allMaterial = {
          surfMaterial: {
              color: '#f8f8ff',
              opacity: 0.55,
              clip: false
          },
          lineMaterial: {
              color: '#ffffe0',
              opacity: 1,
              lineWidth: 1
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
</style>
