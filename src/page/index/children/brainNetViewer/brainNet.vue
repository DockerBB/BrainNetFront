<template>
    <div id="brainNet" style="height: 100%;width: 100%;">
        <div id="importfile">
          <el-row type="flex">
            <el-col class="select">
              <a href="javascript:;" class="file" style="width: 100%;">{{ surfLabel }}<input type="file" accept=".nv" @change="uploadsurf"></a>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col class="select">
              <a href="javascript:;" class="file" style="width: 100%;">{{ nodeLabel }}<input type="file" accept=".node" @change="uploadnode"></a>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col class="select">
              <a href="javascript:;" class="file" style="width: 100%;">{{ edgeLabel }}<input type="file" accept=".edge" @change="uploadedge"></a>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col class="select">
              <a href="javascript:;" class="file" style="width: 100%;">{{ volLabel }}<input type="file" accept=".nii" @change="uploadnifti"></a>
            </el-col>
          </el-row>
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
    </div>
</template>
<script>
  /* eslint-disable */
  import { NIFTILoader } from '@/utils/NIFTILoader'
  export default {
      name: 'brainSide',
      data() {
          return {
              numOfslice: 0,
              surfLabel: '导入脑曲面文件*.nv',
              nodeLabel: '导入节点文件*.node',
              edgeLabel: '导入连接文件*.edge',
              volLabel: '导入容器文件*.nii',
              bnOption: this.$store.state.bnOption
          }
      },
      methods: {
          init: function() {
              // document.getElementById('menuItem').style.display = 'none';
          },
          getPhoto: function() {
              var canvas = document.getElementById('WebGL-output').children[0];
              var gl = canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});
              console.log(canvas.toDataURL());
          },
          uploadsurf: function(ev) {
              let self = this;
              const file = ev.target.files[0];
              var reader = new FileReader();
              reader.onload = function (e) {
                  delete self.bnOption.allDATA['surfDATA'];
                  var text = reader.result;
                  self.bnOption.allDATA['surfDATA'] = text;
                  self.bnOption.flag = true;
              };
              reader.readAsText(file);
              this.surfLabel = file.name;
              return false;
          },
          uploadnode: function(ev) {
              let self = this;
              const file = ev.target.files[0];
              var reader = new FileReader();
              reader.onload = function (e) {
                  delete self.bnOption.allDATA['nodeDATA'];
                  var text = reader.result;
                  self.bnOption.allDATA['nodeDATA'] = text;
                  self.bnOption.flag = true;
              };
              reader.readAsText(file);
              this.nodeLabel = file.name;
              return false;
          },
          uploadedge: function(ev) {
              let self = this;
              const file = ev.target.files[0];
              var reader = new FileReader();
              reader.onload = function (e) {
                  delete self.bnOption.allDATA['edgeDATA'];
                  var text = reader.result;
                  self.bnOption.allDATA['edgeDATA'] = text;
                  self.bnOption.flag = true;
              };
              reader.readAsText(file);
              this.edgeLabel = file.name;
              return false;
          },
          uploadnifti: function(ev) {
              let self = this;
              var loader = this.bnOption.NIFTIModel = new NIFTILoader();
              const file = ev.target.files[0];
              var reader = new FileReader();
              reader.onload = function (e) {
                  var buffer = reader.result;
                  loader.load(buffer);
                  self.bnOption.flag = true;
              };
              reader.readAsArrayBuffer(file);
              this.volLabel = file.name;
              return false;
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
    .file {
        position: relative;
        display: inline-block;
        /*background: #ffffff;*/
        border: 1px solid #99D3F5;
        border-radius: 4px;
        padding: 4px 12px;
        overflow: hidden;
        /*color: #1E88C7;*/
        text-decoration: none;
        text-indent: 0;
        line-height: 20px;
    }
    .file input {
        position: absolute;
        /*font-size: 100px;*/
        cursor: pointer;
        right: 0;
        top: 0;
        opacity: 0;
    }
    .file:hover {
        /*background: #AADFFD;*/
        border-color: #1E88C7;
        color: #1E88C7 !important;
        /*text-decoration: none;*/
    }
</style>
