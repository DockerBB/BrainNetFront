(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d79302ce"],{"0037":function(t,i,e){"use strict";var n=n||{};n.NIFTI1=n.NIFTI1||e("e148"),n.NIFTI2=n.NIFTI2||e("6e06"),n.Utils=n.Utils||e("eb9f");var s=s||e("d7ac");n.isNIFTI1=function(t){var i,e,s,a;return!(t.byteLength<n.NIFTI1.STANDARD_HEADER_SIZE)&&(i=new DataView(t),i&&(e=i.getUint8(n.NIFTI1.MAGIC_NUMBER_LOCATION)),s=i.getUint8(n.NIFTI1.MAGIC_NUMBER_LOCATION+1),a=i.getUint8(n.NIFTI1.MAGIC_NUMBER_LOCATION+2),!(e!==n.NIFTI1.MAGIC_NUMBER[0]||s!==n.NIFTI1.MAGIC_NUMBER[1]||a!==n.NIFTI1.MAGIC_NUMBER[2]))},n.isNIFTI2=function(t){var i,e,s,a;return!(t.byteLength<n.NIFTI1.STANDARD_HEADER_SIZE)&&(i=new DataView(t),e=i.getUint8(n.NIFTI2.MAGIC_NUMBER_LOCATION),s=i.getUint8(n.NIFTI2.MAGIC_NUMBER_LOCATION+1),a=i.getUint8(n.NIFTI2.MAGIC_NUMBER_LOCATION+2),!(e!==n.NIFTI2.MAGIC_NUMBER[0]||s!==n.NIFTI2.MAGIC_NUMBER[1]||a!==n.NIFTI2.MAGIC_NUMBER[2]))},n.isNIFTI=function(t){return n.isNIFTI1(t)||n.isNIFTI2(t)},n.isCompressed=function(t){var i,e,s;if(t){if(i=new DataView(t),e=i.getUint8(0),s=i.getUint8(1),e===n.Utils.GUNZIP_MAGIC_COOKIE1)return!0;if(s===n.Utils.GUNZIP_MAGIC_COOKIE2)return!0}return!1},n.decompress=function(t){return s.inflate(t).buffer},n.readHeader=function(t){var i=null;return n.isCompressed(t)&&(t=n.decompress(t)),n.isNIFTI1(t)?i=new n.NIFTI1:n.isNIFTI2(t)&&(i=new n.NIFTI2),i?i.readHeader(t):console.error("That file does not appear to be NIFTI!"),i},n.hasExtension=function(t){return 0!=t.extensionFlag[0]},n.readImage=function(t,i){var e=t.vox_offset,n=1,s=1;t.dims[4]&&(n=t.dims[4]),t.dims[5]&&(s=t.dims[5]);var a=t.dims[1]*t.dims[2]*t.dims[3]*n*s*(t.numBitsPerVoxel/8);return i.slice(e,e+a)},n.readExtension=function(t,i){var e=t.getExtensionLocation(),n=t.extensionSize;return i.slice(e,e+n)},n.readExtensionData=function(t,i){var e=t.getExtensionLocation(),n=t.extensionSize;return i.slice(e+8,e+n-8)};var a=typeof t;"undefined"!==a&&t.exports&&(t.exports=n)},"22ee":function(t,i,e){"use strict";e.r(i);var n=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticStyle:{height:"100%",width:"100%"},attrs:{id:"brainNet"}},[e("div",{attrs:{id:"importfile"}},[e("el-button",{staticStyle:{width:"100%","text-align":"left"},on:{click:function(i){t.setfilelist(t.surfResForDialog)}}},[t._v(t._s(t.surfLabel||t.translations("surfLabel")))]),e("br"),e("el-button",{staticStyle:{width:"100%","text-align":"left"},on:{click:function(i){t.setfilelist(t.nodeResForDialog)}}},[t._v(t._s(t.nodeLabel||t.translations("nodeLabel")))]),e("br"),e("el-button",{staticStyle:{width:"100%","text-align":"left"},on:{click:function(i){t.setfilelist(t.edgeResForDialog)}}},[t._v(t._s(t.edgeLabel||t.translations("edgeLabel")))]),e("br"),e("el-button",{staticStyle:{width:"100%","text-align":"left"},on:{click:function(i){t.setfilelist(t.niftiResForDialog)}}},[t._v(t._s(t.niftiLabel||t.translations("niftiLabel")))])],1),e("div",{attrs:{id:"controlpanel"}},[e("el-popover",{attrs:{placement:"right",width:"400",trigger:"hover"}},[e("h3",[t._v(t._s(t.translations("surfAttr")))]),t.bnOption.allMaterial.surfMaterial?e("el-form",{attrs:{"label-position":"left","label-width":"200px",model:t.bnOption.allMaterial.surfMaterial}},[e("el-form-item",{attrs:{label:"Surface Color"}},[e("el-color-picker",{model:{value:t.bnOption.allMaterial.surfMaterial.color,callback:function(i){t.$set(t.bnOption.allMaterial.surfMaterial,"color",i)},expression:"bnOption.allMaterial.surfMaterial.color"}})],1),e("el-form-item",{attrs:{label:"Surface Opacity"}},[e("el-slider",{attrs:{min:0,max:1,step:.01},model:{value:t.bnOption.allMaterial.surfMaterial.opacity,callback:function(i){t.$set(t.bnOption.allMaterial.surfMaterial,"opacity",i)},expression:"bnOption.allMaterial.surfMaterial.opacity"}})],1),e("el-form-item",{attrs:{label:"Surface Clip"}},[e("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:t.bnOption.allMaterial.surfMaterial.clip,callback:function(i){t.$set(t.bnOption.allMaterial.surfMaterial,"clip",i)},expression:"bnOption.allMaterial.surfMaterial.clip"}}),e("el-slider",{attrs:{min:-100,max:100,step:.1,range:""},model:{value:t.bnOption.allMaterial.surfMaterial.clipOffset,callback:function(i){t.$set(t.bnOption.allMaterial.surfMaterial,"clipOffset",i)},expression:"bnOption.allMaterial.surfMaterial.clipOffset"}})],1)],1):t._e(),e("el-button",{attrs:{slot:"reference",type:"text"},slot:"reference"},[t._v(t._s(t.translations("surfAttr")))])],1),e("br"),e("el-popover",{attrs:{placement:"right",width:"300",trigger:"hover"}},[e("h3",[t._v(t._s(t.translations("nodeAttr")))]),t.bnOption.allMaterial.nodeMaterial?e("div",{staticStyle:{"text-align":"right",margin:"0"}}):t._e(),e("el-button",{attrs:{slot:"reference",type:"text"},slot:"reference"},[t._v(t._s(t.translations("nodeAttr")))])],1),e("br"),e("el-popover",{attrs:{placement:"right",width:"400",trigger:"hover"}},[e("h3",[t._v(t._s(t.translations("edgeAttr")))]),t.bnOption.allMaterial.lineMaterial?e("div",{staticStyle:{"text-align":"right",margin:"0"}},[t.bnOption.allMaterial.lineMaterial?e("el-form",{attrs:{"label-position":"left","label-width":"200px",model:t.bnOption.allMaterial.lineMaterial}},[e("span",{staticStyle:{float:"left"}},[t._v("Connection Weight Range")]),e("br"),e("el-row",[e("el-input-number",{staticStyle:{float:"left"},attrs:{precision:2,step:.01,min:t.bnOption.allMaterial.lineMaterial.minWeight,max:t.bnOption.allMaterial.lineMaterial.lineWidth[1]},on:{change:function(i){t.refreashSlider()}},model:{value:t.bnOption.allMaterial.lineMaterial.lineWidth[0],callback:function(i){t.$set(t.bnOption.allMaterial.lineMaterial.lineWidth,0,i)},expression:"bnOption.allMaterial.lineMaterial.lineWidth[0]"}}),e("el-input-number",{attrs:{precision:2,step:.01,min:t.bnOption.allMaterial.lineMaterial.lineWidth[0],max:t.bnOption.allMaterial.lineMaterial.maxWeight},on:{change:function(i){t.refreashSlider()}},model:{value:t.bnOption.allMaterial.lineMaterial.lineWidth[1],callback:function(i){t.$set(t.bnOption.allMaterial.lineMaterial.lineWidth,1,i)},expression:"bnOption.allMaterial.lineMaterial.lineWidth[1]"}})],1),e("el-slider",{attrs:{min:t.bnOption.allMaterial.lineMaterial.minWeight,step:.01,max:t.bnOption.allMaterial.lineMaterial.maxWeight,range:!0},model:{value:t.bnOption.allMaterial.lineMaterial.lineWidth,callback:function(i){t.$set(t.bnOption.allMaterial.lineMaterial,"lineWidth",i)},expression:"bnOption.allMaterial.lineMaterial.lineWidth"}}),e("el-button",{on:{click:function(){return t.bnOption.lflag=!0}}},[t._v("Set Range")]),e("el-form-item",{attrs:{label:"Connection Size"}},[e("el-input-number",{attrs:{min:1,max:10},on:{change:function(){return t.bnOption.lflag=!0}},model:{value:t.bnOption.allMaterial.lineMaterial.size,callback:function(i){t.$set(t.bnOption.allMaterial.lineMaterial,"size",i)},expression:"bnOption.allMaterial.lineMaterial.size"}})],1),e("el-form-item",{attrs:{label:"Connection Color"}},[e("el-color-picker",{on:{change:function(){return t.bnOption.lflag=!0}},model:{value:t.bnOption.allMaterial.lineMaterial.color,callback:function(i){t.$set(t.bnOption.allMaterial.lineMaterial,"color",i)},expression:"bnOption.allMaterial.lineMaterial.color"}})],1)],1):t._e()],1):t._e(),e("el-button",{attrs:{slot:"reference",type:"text"},slot:"reference"},[t._v(t._s(t.translations("edgeAttr")))])],1),e("br"),e("el-popover",{attrs:{placement:"right",width:"300",trigger:"hover"}},[t.bnOption.NIFTIModel?e("img",{attrs:{src:t.bnOption.NIFTIModel.z_slice[t.numOfslice],width:"240px",height:"330"}}):t._e(),e("el-slider",{attrs:{max:180},model:{value:t.numOfslice,callback:function(i){t.numOfslice=i},expression:"numOfslice"}}),e("el-button",{attrs:{slot:"reference",type:"text"},slot:"reference"},[t._v(t._s(t.translations("niftiAttr")))])],1)],1),e("el-dialog",{attrs:{title:t.dialogTitle,visible:t.dialogTableVisible,"modal-append-to-body":!1},on:{"update:visible":function(i){t.dialogTableVisible=i}}},[e("el-tree",{attrs:{data:t.dialogData,"node-key":"id","expand-on-click-node":!0,"modal-append-to-body":!1},scopedSlots:t._u([{key:"default",fn:function(i){var n=i.node,s=i.data;return e("span",{staticClass:"custom-tree-node"},[void 0==s.children?e("span",{on:{click:function(){return t.downloadData(n)}}},[e("i",{staticClass:"el-icon-document"}),t._v(t._s(n.label))]):e("span",[e("i",{staticClass:"iconfont icon-dir"}),t._v(t._s(n.label))])])}}])}),e("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{on:{click:t.localfileinput}},[t._v(t._s(t.translations("importfile")))]),e("el-button",{on:{click:function(i){t.dialogTableVisible=!1}}},[t._v(t._s(t.$t("el.messagebox.cancel")))])],1)],1)],1)},s=[],a=(e("7f7f"),e("cadf"),e("551c"),e("097d"),e("4917"),e("34ef"),e("f751"),e("0037")),l=e("5698");function r(){this.x_slice=[],this.y_slice=[],this.z_slice=[],this.niftiHeader=null,this.niftiImage=null}Object.assign(r.prototype,{constructor:r,load:function(t){var i;a["isNIFTI"](t)?(this.niftiHeader=a["readHeader"](t),console.log(this.niftiHeader.toFormattedString()),i=a["readImage"](this.niftiHeader,t),console.log(i),console.log("Is Extentalbe:"+a["hasExtension"](this.niftiHeader))):console.log("fail");var e=l["f"](0,0,255),n=l["f"](255,0,0),s=l["d"](n,e),r=document.createElement("canvas"),o=r.getContext("2d"),h=this.niftiHeader.dims[1],f=this.niftiHeader.dims[2],d=this.niftiHeader.dims[3],c=(this.niftiHeader.dims[4],o.createImageData(h,f));r.width=h,r.height=f,this.niftiImage=new Uint8Array(i,0,i.byteLength);for(var I=0;I<d;I+=1){for(var p=0;p<f;p+=1)for(var u=0;u<h;u+=1){var g=(I*f+p)*h+u,_=4*(p*h+u),T=this.niftiImage[g],m=void 0;T>0?(m=s(T/116).match(/\d+/g),c.data[_]=parseInt(m[0]),c.data[_+1]=parseInt(m[1]),c.data[_+2]=parseInt(m[2])):c.data[_]=c.data[_+1]=c.data[_+2]=T,c.data[_+3]=255}o.putImageData(c,0,0),this.z_slice[I]=r.toDataURL()}c=o.createImageData(h,f);r.width=h,r.height=f;for(var N=0;N<f;N+=1){for(var b=0;b<d;b+=1)for(var F=0;F<h;F+=1){var A=(b*f+N)*h+F,M=4*(b*h+F),U=this.niftiImage[A];c.data[M]=c.data[M+1]=c.data[M+2]=U,c.data[M+3]=255}o.putImageData(c,0,0),this.y_slice[N]=r.toDataURL()}c=o.createImageData(h,f);r.width=h,r.height=f;for(var E=0;E<h;E+=1){for(var x=0;x<d;x+=1)for(var y=0;y<f;y+=1){var S=(x*f+y)*h+E,O=4*(x*f+y),v=this.niftiImage[S];c.data[O]=c.data[O+1]=c.data[O+2]=v,c.data[O+3]=255}o.putImageData(c,0,0),this.x_slice[E]=r.toDataURL()}}});for(var o=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{attrs:{id:"chord"}})},h=[],f=(e("c5f6"),e("6c7b"),e("0be3")),d=new Array(90),c=0;c<d.length;c++)d[c]=new Array(d.length).fill(0),d[c][c]=1;var I={name:"chord",props:{matrix:Array,atlas:String,size:Number},mounted:function(){this.draw();this.ribbons},watch:{matrix:function(){this.draw()},atlas:function(){this.draw()}},data:function(){return{chordsize:1e3,label:f["h"],ribbons:null}},methods:{draw:function(){if(document.getElementById("chord").innerHTML="",null!==this.chordData&&""!==this.chordData){var t=this.label,i=d;this.chordsize=i.length<100?1e3:16*i.length;var e=l["j"]("#chord").append("svg").attr("id","chord-svg").attr("width",this.chordsize).attr("height",this.chordsize),n=+e.attr("width"),s=+e.attr("height"),a=.5*Math.min(n,s)-120,r=a-30,o=l["b"]().padAngle(.01).sortSubgroups(l["c"]),h=l["a"]().innerRadius(r).outerRadius(a),f=(l["g"]().radius(r),l["i"]().domain(l["e"](4)).range(["#ff0000","#eb4310","#f6941d","#fbb417","#ffff00","#cdd541","#99cc33","#3f9337","#219167","#239676","#24998d","#1f9baa","#0080ff","#3366cc","#333399","#003366","#800080","#a1488e","#c71585","#bd2158"])),c=e.append("g").attr("transform","translate("+n/2+","+s/2+")").datum(o(i)),I=c.append("g").attr("class","groups").selectAll("g").data(function(t){return t.groups}).enter().append("g");I.append("path").style("fill",function(t){return f(t.index)}).style("stroke",function(t){return l["f"](f(t.index)).darker()}).attr("d",h),I.append("text").attr("x",8).attr("dy",".35em").attr("transform",function(t){var i=(t.startAngle+t.endAngle)/2;return i<Math.PI?"rotate("+(180*i/Math.PI-90)+") translate("+a+",0)":"rotate("+(180*i/Math.PI+90)+") translate(-"+(a+16)+",0)"}).style("text-anchor",function(t){return(t.startAngle+t.endAngle)/2<Math.PI?"start":"end"}).text(function(i){return void 0===t?null:t[i.index]})}}}},p=I,u=(e("5897"),e("2877")),g=Object(u["a"])(p,o,h,!1,null,"4f5d4089",null);g.options.__file="chord.vue";var _=g.exports,T={zh:{brainViewer:{surfLabel:"导入脑曲面文件*.nv",nodeLabel:"导入节点文件*.node",edgeLabel:"导入连接文件*.edge",niftiLabel:"导入容器文件*.nii",surfAttr:"设置脑曲面属性",nodeAttr:"设置节点属性",edgeAttr:"设置联结属性",niftiAttr:"设置容器属性",importfile:"本地导入"}},en:{brainViewer:{surfLabel:"import surface(*.nv)",nodeLabel:"import nodal/ROI(*.node)",edgeLabel:"import connectivity(*.edge)",niftiLabel:"import volume(*.nii)",surfAttr:"Setting surface",nodeAttr:"Setting nodal",edgeAttr:"Setting connectivity",niftiAttr:"Setting volume",importfile:"Import From Local"}}},m="brainViewer",N={name:"brainSide",data:function(){return{dialogTableVisible:!1,surfResForDialog:{fileType:"surf",acceptType:["*.nv"]},nodeResForDialog:{fileType:"node",acceptType:["*.node"]},edgeResForDialog:{fileType:"edge",acceptType:["*.edge"]},niftiResForDialog:{fileType:"nifti",acceptType:["*.nii"]},dialogTitle:null,dialogData:null,fileType:"",numOfslice:0,surfLabel:null,nodeLabel:null,edgeLabel:null,niftiLabel:null,atlasSelect:"aal",chordData:[],chordVisible:!0,bnOption:this.$store.state.bnOption}},components:{chord:_},methods:{init:function(){},downloadData:function(t){var i=t.data.uri,e=this;"nifti"===this.fileType?fetch("http:"+window.g.API_URL+"/"+i,{headers:{Accept:"application/octet-stream","content-type":"application/octet-stream"},method:"GET"}).then(function(t){return t.arrayBuffer()}).then(function(t){if(t){delete e.bnOption.NIFTIModel;var i=e.bnOption.NIFTIModel=new r;i.load(t),e.bnOption.sflag=!0}}):this.$axios.get(i).then(function(t){t&&(delete e.bnOption.allDATA[e.fileType+"DATA"],e.bnOption.allDATA[e.fileType+"DATA"]=t.data,e.bnOption.sflag=!0)}),this.dialogTableVisible=!1},localfileinput:function(){var t=this,i=document.createElement("input");if(i.type="file",i.onchange=function(i){var e=i.target.files[0],n=new FileReader;return n.onload=function(i){delete t.bnOption.allDATA[t.fileType+"DATA"];var e=n.result;t.bnOption.allDATA[t.fileType+"DATA"]=e,t.bnOption.sflag=!0},n.readAsText(e),t[t.fileType+"Label"]=e.name,!1},"surf"===this.fileType)i.accept=".nv";else if("node"===this.fileType)i.accept=".node";else if("edge"===this.fileType)i.accept=".edge";else{if("nifti"!==this.fileType)return;i.accept=".nii",i.onchange=function(i){delete t.bnOption.NIFTIModel;var e=t.bnOption.NIFTIModel=new r,n=i.target.files[0],s=new FileReader;return s.onload=function(i){var n=s.result;e.load(n),t.bnOption.sflag=!0},s.readAsArrayBuffer(n),t.niftiLabel=n.name,!1}}i.click(),this.dialogTableVisible=!1},setfilelist:function(t){"surf"===t.fileType&&(this.dialogData=f["q"]),"node"===t.fileType&&(this.dialogData=f["p"]),"edge"===t.fileType&&(this.dialogData=f["i"]),"nifti"===t.fileType&&(this.dialogData=f["o"]),this.dialogTitle=this.translations(t.fileType+"Label"),this.fileType=t.fileType,this.dialogTableVisible=!0},initLocal:function(){this.$te(m)||(this.$i18n.mergeLocaleMessage("zh",T.zh),this.$i18n.mergeLocaleMessage("en",T.en))},translations:function(t){return this.$t("brainViewer."+t)},refreashSlider:function(){var t=this.bnOption.allMaterial.lineMaterial.lineWidth;this.bnOption.allMaterial.lineMaterial.lineWidth=null,this.bnOption.allMaterial.lineMaterial.lineWidth=t}},created:function(){this.initLocal()},mounted:function(){this.bnOption.sflag=!1,this.bnOption.allDATA={},this.bnOption.allMaterial={surfMaterial:{color:"#f8f8ff",opacity:.55,clip:!1,clipOffset:[-100,0]},lineMaterial:{color:"#ffff00",lineWidth:[0,1],minWeight:0,maxWeight:10,size:1}},this.bnOption.NIFTIModel=null,this.init()}},b=N,F=(e("9f30"),Object(u["a"])(b,n,s,!1,null,"c5519864",null));F.options.__file="brainNet.vue";i["default"]=F.exports},"3e63":function(t,i,e){},5897:function(t,i,e){"use strict";var n=e("b415"),s=e.n(n);s.a},"6c7b":function(t,i,e){var n=e("5ca1");n(n.P,"Array",{fill:e("36bd")}),e("9c6c")("fill")},"6e06":function(t,i,e){"use strict";var n=n||{};n.Utils=n.Utils||e("eb9f"),n.NIFTI1=n.NIFTI1||e("e148"),n.NIFTI2=n.NIFTI2||function(){this.littleEndian=!1,this.dim_info=0,this.dims=[],this.intent_p1=0,this.intent_p2=0,this.intent_p3=0,this.intent_code=0,this.datatypeCode=0,this.numBitsPerVoxel=0,this.slice_start=0,this.slice_end=0,this.slice_code=0,this.pixDims=[],this.vox_offset=0,this.scl_slope=1,this.scl_inter=0,this.xyzt_units=0,this.cal_max=0,this.cal_min=0,this.slice_duration=0,this.toffset=0,this.description="",this.aux_file="",this.intent_name="",this.qform_code=0,this.sform_code=0,this.quatern_b=0,this.quatern_c=0,this.quatern_d=0,this.qoffset_x=0,this.qoffset_y=0,this.qoffset_z=0,this.affine=[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]],this.magic=0,this.extensionFlag=[0,0,0,0]},n.NIFTI2.MAGIC_COOKIE=540,n.NIFTI2.MAGIC_NUMBER_LOCATION=4,n.NIFTI2.MAGIC_NUMBER=[110,43,50,0,13,10,26,10],n.NIFTI2.prototype.readHeader=function(t){var i,e,s,a,l=new DataView(t),r=n.Utils.getIntAt(l,0,this.littleEndian);if(r!==n.NIFTI2.MAGIC_COOKIE&&(this.littleEndian=!0,r=n.Utils.getIntAt(l,0,this.littleEndian)),r!==n.NIFTI2.MAGIC_COOKIE)throw new Error("This does not appear to be a NIFTI file!");for(this.datatypeCode=n.Utils.getShortAt(l,12,this.littleEndian),this.numBitsPerVoxel=n.Utils.getShortAt(l,14,this.littleEndian),i=0;i<8;i+=1)a=16+8*i,this.dims[i]=n.Utils.getLongAt(l,a,this.littleEndian);for(this.intent_p1=n.Utils.getDoubleAt(l,80,this.littleEndian),this.intent_p2=n.Utils.getDoubleAt(l,88,this.littleEndian),this.intent_p3=n.Utils.getDoubleAt(l,96,this.littleEndian),i=0;i<8;i+=1)a=104+8*i,this.pixDims[i]=n.Utils.getDoubleAt(l,a,this.littleEndian);for(this.vox_offset=n.Utils.getLongAt(l,168,this.littleEndian),this.scl_slope=n.Utils.getDoubleAt(l,176,this.littleEndian),this.scl_inter=n.Utils.getDoubleAt(l,184,this.littleEndian),this.cal_max=n.Utils.getDoubleAt(l,192,this.littleEndian),this.cal_min=n.Utils.getDoubleAt(l,200,this.littleEndian),this.slice_duration=n.Utils.getDoubleAt(l,208,this.littleEndian),this.toffset=n.Utils.getDoubleAt(l,216,this.littleEndian),this.slice_start=n.Utils.getLongAt(l,224,this.littleEndian),this.slice_end=n.Utils.getLongAt(l,232,this.littleEndian),this.description=n.Utils.getStringAt(l,240,320),this.aux_file=n.Utils.getStringAt(l,320,344),this.qform_code=n.Utils.getIntAt(l,344,this.littleEndian),this.sform_code=n.Utils.getIntAt(l,348,this.littleEndian),this.quatern_b=n.Utils.getDoubleAt(l,352,this.littleEndian),this.quatern_c=n.Utils.getDoubleAt(l,360,this.littleEndian),this.quatern_d=n.Utils.getDoubleAt(l,368,this.littleEndian),this.qoffset_x=n.Utils.getDoubleAt(l,376,this.littleEndian),this.qoffset_y=n.Utils.getDoubleAt(l,384,this.littleEndian),this.qoffset_z=n.Utils.getDoubleAt(l,392,this.littleEndian),e=0;e<3;e+=1)for(s=0;s<4;s+=1)a=400+8*(4*e+s),this.affine[e][s]=n.Utils.getDoubleAt(l,a,this.littleEndian);this.affine[3][0]=0,this.affine[3][1]=0,this.affine[3][2]=0,this.affine[3][3]=1,this.slice_code=n.Utils.getIntAt(l,496,this.littleEndian),this.xyzt_units=n.Utils.getIntAt(l,500,this.littleEndian),this.intent_code=n.Utils.getIntAt(l,504,this.littleEndian),this.intent_name=n.Utils.getStringAt(l,508,524),this.dim_info=n.Utils.getByteAt(l,524),l.byteLength>n.NIFTI2.MAGIC_COOKIE&&(this.extensionFlag[0]=n.Utils.getByteAt(l,540),this.extensionFlag[1]=n.Utils.getByteAt(l,541),this.extensionFlag[2]=n.Utils.getByteAt(l,542),this.extensionFlag[3]=n.Utils.getByteAt(l,543),this.extensionFlag[0]&&(this.extensionSize=this.getExtensionSize(l),this.extensionCode=this.getExtensionCode(l)))},n.NIFTI2.prototype.toFormattedString=function(){var t=n.Utils.formatNumber,i="";return i+="Datatype = "+ +this.datatypeCode+" ("+this.getDatatypeCodeString(this.datatypeCode)+")\n",i+="Bits Per Voxel =  = "+this.numBitsPerVoxel+"\n",i+="Image Dimensions (1-8): "+this.dims[0]+", "+this.dims[1]+", "+this.dims[2]+", "+this.dims[3]+", "+this.dims[4]+", "+this.dims[5]+", "+this.dims[6]+", "+this.dims[7]+"\n",i+="Intent Parameters (1-3): "+this.intent_p1+", "+this.intent_p2+", "+this.intent_p3+"\n",i+="Voxel Dimensions (1-8): "+t(this.pixDims[0])+", "+t(this.pixDims[1])+", "+t(this.pixDims[2])+", "+t(this.pixDims[3])+", "+t(this.pixDims[4])+", "+t(this.pixDims[5])+", "+t(this.pixDims[6])+", "+t(this.pixDims[7])+"\n",i+="Image Offset = "+this.vox_offset+"\n",i+="Data Scale:  Slope = "+t(this.scl_slope)+"  Intercept = "+t(this.scl_inter)+"\n",i+="Display Range:  Max = "+t(this.cal_max)+"  Min = "+t(this.cal_min)+"\n",i+="Slice Duration = "+this.slice_duration+"\n",i+="Time Axis Shift = "+this.toffset+"\n",i+="Slice Start = "+this.slice_start+"\n",i+="Slice End = "+this.slice_end+"\n",i+='Description: "'+this.description+'"\n',i+='Auxiliary File: "'+this.aux_file+'"\n',i+="Q-Form Code = "+this.qform_code+" ("+this.getTransformCodeString(this.qform_code)+")\n",i+="S-Form Code = "+this.sform_code+" ("+this.getTransformCodeString(this.sform_code)+")\n",i+="Quaternion Parameters:  b = "+t(this.quatern_b)+"  c = "+t(this.quatern_c)+"  d = "+t(this.quatern_d)+"\n",i+="Quaternion Offsets:  x = "+this.qoffset_x+"  y = "+this.qoffset_y+"  z = "+this.qoffset_z+"\n",i+="S-Form Parameters X: "+t(this.affine[0][0])+", "+t(this.affine[0][1])+", "+t(this.affine[0][2])+", "+t(this.affine[0][3])+"\n",i+="S-Form Parameters Y: "+t(this.affine[1][0])+", "+t(this.affine[1][1])+", "+t(this.affine[1][2])+", "+t(this.affine[1][3])+"\n",i+="S-Form Parameters Z: "+t(this.affine[2][0])+", "+t(this.affine[2][1])+", "+t(this.affine[2][2])+", "+t(this.affine[2][3])+"\n",i+="Slice Code = "+this.slice_code+"\n",i+="Units Code = "+this.xyzt_units+" ("+this.getUnitsCodeString(n.NIFTI1.SPATIAL_UNITS_MASK&this.xyzt_units)+", "+this.getUnitsCodeString(n.NIFTI1.TEMPORAL_UNITS_MASK&this.xyzt_units)+")\n",i+="Intent Code = "+this.intent_code+"\n",i+='Intent Name: "'+this.intent_name+'"\n',i+="Dim Info = "+this.dim_info+"\n",i},n.NIFTI2.prototype.getExtensionLocation=function(){return n.NIFTI2.MAGIC_COOKIE+4},n.NIFTI2.prototype.getExtensionSize=n.NIFTI1.prototype.getExtensionSize,n.NIFTI2.prototype.getExtensionCode=n.NIFTI1.prototype.getExtensionCode,n.NIFTI2.prototype.getDatatypeCodeString=n.NIFTI1.prototype.getDatatypeCodeString,n.NIFTI2.prototype.getTransformCodeString=n.NIFTI1.prototype.getTransformCodeString,n.NIFTI2.prototype.getUnitsCodeString=n.NIFTI1.prototype.getUnitsCodeString,n.NIFTI2.prototype.getQformMat=n.NIFTI1.prototype.getQformMat,n.NIFTI2.prototype.convertNiftiQFormToNiftiSForm=n.NIFTI1.prototype.convertNiftiQFormToNiftiSForm,n.NIFTI2.prototype.convertNiftiSFormToNEMA=n.NIFTI1.prototype.convertNiftiSFormToNEMA,n.NIFTI2.prototype.nifti_mat33_mul=n.NIFTI1.prototype.nifti_mat33_mul,n.NIFTI2.prototype.nifti_mat33_determ=n.NIFTI1.prototype.nifti_mat33_determ;var s=typeof t;"undefined"!==s&&t.exports&&(t.exports=n.NIFTI2)},"9f30":function(t,i,e){"use strict";var n=e("3e63"),s=e.n(n);s.a},b415:function(t,i,e){},e148:function(t,i,e){"use strict";var n=n||{};n.Utils=n.Utils||e("eb9f"),n.NIFTI1=n.NIFTI1||function(){this.littleEndian=!1,this.dim_info=0,this.dims=[],this.intent_p1=0,this.intent_p2=0,this.intent_p3=0,this.intent_code=0,this.datatypeCode=0,this.numBitsPerVoxel=0,this.slice_start=0,this.slice_end=0,this.slice_code=0,this.pixDims=[],this.vox_offset=0,this.scl_slope=1,this.scl_inter=0,this.xyzt_units=0,this.cal_max=0,this.cal_min=0,this.slice_duration=0,this.toffset=0,this.description="",this.aux_file="",this.intent_name="",this.qform_code=0,this.sform_code=0,this.quatern_b=0,this.quatern_c=0,this.quatern_d=0,this.qoffset_x=0,this.qoffset_y=0,this.qoffset_z=0,this.affine=[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]],this.magic=0,this.isHDR=!1,this.extensionFlag=[0,0,0,0],this.extensionSize=0,this.extensionCode=0},n.NIFTI1.TYPE_NONE=0,n.NIFTI1.TYPE_BINARY=1,n.NIFTI1.TYPE_UINT8=2,n.NIFTI1.TYPE_INT16=4,n.NIFTI1.TYPE_INT32=8,n.NIFTI1.TYPE_FLOAT32=16,n.NIFTI1.TYPE_COMPLEX64=32,n.NIFTI1.TYPE_FLOAT64=64,n.NIFTI1.TYPE_RGB24=128,n.NIFTI1.TYPE_INT8=256,n.NIFTI1.TYPE_UINT16=512,n.NIFTI1.TYPE_UINT32=768,n.NIFTI1.TYPE_INT64=1024,n.NIFTI1.TYPE_UINT64=1280,n.NIFTI1.TYPE_FLOAT128=1536,n.NIFTI1.TYPE_COMPLEX128=1792,n.NIFTI1.TYPE_COMPLEX256=2048,n.NIFTI1.XFORM_UNKNOWN=0,n.NIFTI1.XFORM_SCANNER_ANAT=1,n.NIFTI1.XFORM_ALIGNED_ANAT=2,n.NIFTI1.XFORM_TALAIRACH=3,n.NIFTI1.XFORM_MNI_152=4,n.NIFTI1.SPATIAL_UNITS_MASK=7,n.NIFTI1.TEMPORAL_UNITS_MASK=56,n.NIFTI1.UNITS_UNKNOWN=0,n.NIFTI1.UNITS_METER=1,n.NIFTI1.UNITS_MM=2,n.NIFTI1.UNITS_MICRON=3,n.NIFTI1.UNITS_SEC=8,n.NIFTI1.UNITS_MSEC=16,n.NIFTI1.UNITS_USEC=24,n.NIFTI1.UNITS_HZ=32,n.NIFTI1.UNITS_PPM=40,n.NIFTI1.UNITS_RADS=48,n.NIFTI1.MAGIC_COOKIE=348,n.NIFTI1.STANDARD_HEADER_SIZE=348,n.NIFTI1.MAGIC_NUMBER_LOCATION=344,n.NIFTI1.MAGIC_NUMBER=[110,43,49],n.NIFTI1.MAGIC_NUMBER2=[110,105,49],n.NIFTI1.EXTENSION_HEADER_SIZE=8,n.NIFTI1.prototype.readHeader=function(t){var i,e,s,a,l=new DataView(t),r=n.Utils.getIntAt(l,0,this.littleEndian);if(r!==n.NIFTI1.MAGIC_COOKIE&&(this.littleEndian=!0,r=n.Utils.getIntAt(l,0,this.littleEndian)),r!==n.NIFTI1.MAGIC_COOKIE)throw new Error("This does not appear to be a NIFTI file!");for(this.dim_info=n.Utils.getByteAt(l,39),i=0;i<8;i+=1)a=40+2*i,this.dims[i]=n.Utils.getShortAt(l,a,this.littleEndian);for(this.intent_p1=n.Utils.getFloatAt(l,56,this.littleEndian),this.intent_p2=n.Utils.getFloatAt(l,60,this.littleEndian),this.intent_p3=n.Utils.getFloatAt(l,64,this.littleEndian),this.intent_code=n.Utils.getShortAt(l,68,this.littleEndian),this.datatypeCode=n.Utils.getShortAt(l,70,this.littleEndian),this.numBitsPerVoxel=n.Utils.getShortAt(l,72,this.littleEndian),this.slice_start=n.Utils.getShortAt(l,74,this.littleEndian),i=0;i<8;i+=1)a=76+4*i,this.pixDims[i]=n.Utils.getFloatAt(l,a,this.littleEndian);for(this.vox_offset=n.Utils.getFloatAt(l,108,this.littleEndian),this.scl_slope=n.Utils.getFloatAt(l,112,this.littleEndian),this.scl_inter=n.Utils.getFloatAt(l,116,this.littleEndian),this.slice_end=n.Utils.getShortAt(l,120,this.littleEndian),this.slice_code=n.Utils.getByteAt(l,122),this.xyzt_units=n.Utils.getByteAt(l,123),this.cal_max=n.Utils.getFloatAt(l,124,this.littleEndian),this.cal_min=n.Utils.getFloatAt(l,128,this.littleEndian),this.slice_duration=n.Utils.getFloatAt(l,132,this.littleEndian),this.toffset=n.Utils.getFloatAt(l,136,this.littleEndian),this.description=n.Utils.getStringAt(l,148,228),this.aux_file=n.Utils.getStringAt(l,228,252),this.qform_code=n.Utils.getShortAt(l,252,this.littleEndian),this.sform_code=n.Utils.getShortAt(l,254,this.littleEndian),this.quatern_b=n.Utils.getFloatAt(l,256,this.littleEndian),this.quatern_c=n.Utils.getFloatAt(l,260,this.littleEndian),this.quatern_d=n.Utils.getFloatAt(l,264,this.littleEndian),this.qoffset_x=n.Utils.getFloatAt(l,268,this.littleEndian),this.qoffset_y=n.Utils.getFloatAt(l,272,this.littleEndian),this.qoffset_z=n.Utils.getFloatAt(l,276,this.littleEndian),e=0;e<3;e+=1)for(s=0;s<4;s+=1)a=280+4*(4*e+s),this.affine[e][s]=n.Utils.getFloatAt(l,a,this.littleEndian);this.affine[3][0]=0,this.affine[3][1]=0,this.affine[3][2]=0,this.affine[3][3]=1,this.intent_name=n.Utils.getStringAt(l,328,344),this.magic=n.Utils.getStringAt(l,344,348),this.isHDR=this.magic===n.NIFTI1.MAGIC_NUMBER2,l.byteLength>n.NIFTI1.MAGIC_COOKIE&&(this.extensionFlag[0]=n.Utils.getByteAt(l,348),this.extensionFlag[1]=n.Utils.getByteAt(l,349),this.extensionFlag[2]=n.Utils.getByteAt(l,350),this.extensionFlag[3]=n.Utils.getByteAt(l,351),this.extensionFlag[0]&&(this.extensionSize=this.getExtensionSize(l),this.extensionCode=this.getExtensionCode(l)))},n.NIFTI1.prototype.toFormattedString=function(){var t=n.Utils.formatNumber,i="";return i+="Dim Info = "+this.dim_info+"\n",i+="Image Dimensions (1-8): "+this.dims[0]+", "+this.dims[1]+", "+this.dims[2]+", "+this.dims[3]+", "+this.dims[4]+", "+this.dims[5]+", "+this.dims[6]+", "+this.dims[7]+"\n",i+="Intent Parameters (1-3): "+this.intent_p1+", "+this.intent_p2+", "+this.intent_p3+"\n",i+="Intent Code = "+this.intent_code+"\n",i+="Datatype = "+this.datatypeCode+" ("+this.getDatatypeCodeString(this.datatypeCode)+")\n",i+="Bits Per Voxel = "+this.numBitsPerVoxel+"\n",i+="Slice Start = "+this.slice_start+"\n",i+="Voxel Dimensions (1-8): "+t(this.pixDims[0])+", "+t(this.pixDims[1])+", "+t(this.pixDims[2])+", "+t(this.pixDims[3])+", "+t(this.pixDims[4])+", "+t(this.pixDims[5])+", "+t(this.pixDims[6])+", "+t(this.pixDims[7])+"\n",i+="Image Offset = "+this.vox_offset+"\n",i+="Data Scale:  Slope = "+t(this.scl_slope)+"  Intercept = "+t(this.scl_inter)+"\n",i+="Slice End = "+this.slice_end+"\n",i+="Slice Code = "+this.slice_code+"\n",i+="Units Code = "+this.xyzt_units+" ("+this.getUnitsCodeString(n.NIFTI1.SPATIAL_UNITS_MASK&this.xyzt_units)+", "+this.getUnitsCodeString(n.NIFTI1.TEMPORAL_UNITS_MASK&this.xyzt_units)+")\n",i+="Display Range:  Max = "+t(this.cal_max)+"  Min = "+t(this.cal_min)+"\n",i+="Slice Duration = "+this.slice_duration+"\n",i+="Time Axis Shift = "+this.toffset+"\n",i+='Description: "'+this.description+'"\n',i+='Auxiliary File: "'+this.aux_file+'"\n',i+="Q-Form Code = "+this.qform_code+" ("+this.getTransformCodeString(this.qform_code)+")\n",i+="S-Form Code = "+this.sform_code+" ("+this.getTransformCodeString(this.sform_code)+")\n",i+="Quaternion Parameters:  b = "+t(this.quatern_b)+"  c = "+t(this.quatern_c)+"  d = "+t(this.quatern_d)+"\n",i+="Quaternion Offsets:  x = "+this.qoffset_x+"  y = "+this.qoffset_y+"  z = "+this.qoffset_z+"\n",i+="S-Form Parameters X: "+t(this.affine[0][0])+", "+t(this.affine[0][1])+", "+t(this.affine[0][2])+", "+t(this.affine[0][3])+"\n",i+="S-Form Parameters Y: "+t(this.affine[1][0])+", "+t(this.affine[1][1])+", "+t(this.affine[1][2])+", "+t(this.affine[1][3])+"\n",i+="S-Form Parameters Z: "+t(this.affine[2][0])+", "+t(this.affine[2][1])+", "+t(this.affine[2][2])+", "+t(this.affine[2][3])+"\n",i+='Intent Name: "'+this.intent_name+'"\n',this.extensionFlag[0]&&(i+="Extension: Size = "+this.extensionSize+"  Code = "+this.extensionCode+"\n"),i},n.NIFTI1.prototype.getDatatypeCodeString=function(t){return t===n.NIFTI1.TYPE_UINT8?"1-Byte Unsigned Integer":t===n.NIFTI1.TYPE_INT16?"2-Byte Signed Integer":t===n.NIFTI1.TYPE_INT32?"4-Byte Signed Integer":t===n.NIFTI1.TYPE_FLOAT32?"4-Byte Float":t===n.NIFTI1.TYPE_FLOAT64?"8-Byte Float":t===n.NIFTI1.TYPE_RGB24?"RGB":t===n.NIFTI1.TYPE_INT8?"1-Byte Signed Integer":t===n.NIFTI1.TYPE_UINT16?"2-Byte Unsigned Integer":t===n.NIFTI1.TYPE_UINT32?"4-Byte Unsigned Integer":t===n.NIFTI1.TYPE_INT64?"8-Byte Signed Integer":t===n.NIFTI1.TYPE_UINT64?"8-Byte Unsigned Integer":"Unknown"},n.NIFTI1.prototype.getTransformCodeString=function(t){return t===n.NIFTI1.XFORM_SCANNER_ANAT?"Scanner":t===n.NIFTI1.XFORM_ALIGNED_ANAT?"Aligned":t===n.NIFTI1.XFORM_TALAIRACH?"Talairach":t===n.NIFTI1.XFORM_MNI_152?"MNI":"Unknown"},n.NIFTI1.prototype.getUnitsCodeString=function(t){return t===n.NIFTI1.UNITS_METER?"Meters":t===n.NIFTI1.UNITS_MM?"Millimeters":t===n.NIFTI1.UNITS_MICRON?"Microns":t===n.NIFTI1.UNITS_SEC?"Seconds":t===n.NIFTI1.UNITS_MSEC?"Milliseconds":t===n.NIFTI1.UNITS_USEC?"Microseconds":t===n.NIFTI1.UNITS_HZ?"Hz":t===n.NIFTI1.UNITS_PPM?"PPM":t===n.NIFTI1.UNITS_RADS?"Rads":"Unknown"},n.NIFTI1.prototype.getQformMat=function(){return this.convertNiftiQFormToNiftiSForm(this.quatern_b,this.quatern_c,this.quatern_d,this.qoffset_x,this.qoffset_y,this.qoffset_z,this.pixDims[1],this.pixDims[2],this.pixDims[3],this.pixDims[0])},n.NIFTI1.prototype.convertNiftiQFormToNiftiSForm=function(t,i,e,n,s,a,l,r,o,h){var f,d,c,I,p=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],u=t,g=i,_=e;return p[3][0]=p[3][1]=p[3][2]=0,p[3][3]=1,f=1-(u*u+g*g+_*_),f<1e-7?(f=1/Math.sqrt(u*u+g*g+_*_),u*=f,g*=f,_*=f,f=0):f=Math.sqrt(f),d=l>0?l:1,c=r>0?r:1,I=o>0?o:1,h<0&&(I=-I),p[0][0]=(f*f+u*u-g*g-_*_)*d,p[0][1]=2*(u*g-f*_)*c,p[0][2]=2*(u*_+f*g)*I,p[1][0]=2*(u*g+f*_)*d,p[1][1]=(f*f+g*g-u*u-_*_)*c,p[1][2]=2*(g*_-f*u)*I,p[2][0]=2*(u*_-f*g)*d,p[2][1]=2*(g*_+f*u)*c,p[2][2]=(f*f+_*_-g*g-u*u)*I,p[0][3]=n,p[1][3]=s,p[2][3]=a,p},n.NIFTI1.prototype.convertNiftiSFormToNEMA=function(t){var i,e,n,s,a,l,r,o,h,f,d,c,I,p,u,g,_,T,m,N,b,F,A,M,U,E,x,y,S,O,v,C,D,R;if(u=0,x=[[0,0,0],[0,0,0],[0,0,0]],y=[[0,0,0],[0,0,0],[0,0,0]],i=t[0][0],e=t[0][1],n=t[0][2],s=t[1][0],a=t[1][1],l=t[1][2],r=t[2][0],o=t[2][1],h=t[2][2],f=Math.sqrt(i*i+s*s+r*r),0===f)return null;if(i/=f,s/=f,r/=f,f=Math.sqrt(e*e+a*a+o*o),0===f)return null;if(e/=f,a/=f,o/=f,f=i*e+s*a+r*o,Math.abs(f)>1e-4){if(e-=f*i,a-=f*s,o-=f*r,f=Math.sqrt(e*e+a*a+o*o),0===f)return null;e/=f,a/=f,o/=f}if(f=Math.sqrt(n*n+l*l+h*h),0===f?(n=s*o-r*a,l=r*e-o*i,h=i*a-s*e):(n/=f,l/=f,h/=f),f=i*n+s*l+r*h,Math.abs(f)>1e-4){if(n-=f*i,l-=f*s,h-=f*r,f=Math.sqrt(n*n+l*l+h*h),0===f)return null;n/=f,l/=f,h/=f}if(f=e*n+a*l+o*h,Math.abs(f)>1e-4){if(n-=f*e,l-=f*a,h-=f*o,f=Math.sqrt(n*n+l*l+h*h),0===f)return null;n/=f,l/=f,h/=f}if(x[0][0]=i,x[0][1]=e,x[0][2]=n,x[1][0]=s,x[1][1]=a,x[1][2]=l,x[2][0]=r,x[2][1]=o,x[2][2]=h,d=this.nifti_mat33_determ(x),0===d)return null;for(E=-666,m=F=A=M=1,N=2,b=3,I=1;I<=3;I+=1)for(p=1;p<=3;p+=1)if(I!==p)for(u=1;u<=3;u+=1)if(I!==u&&p!==u)for(y[0][0]=y[0][1]=y[0][2]=y[1][0]=y[1][1]=y[1][2]=y[2][0]=y[2][1]=y[2][2]=0,g=-1;g<=1;g+=2)for(_=-1;_<=1;_+=2)for(T=-1;T<=1;T+=2)y[0][I-1]=g,y[1][p-1]=_,y[2][u-1]=T,c=this.nifti_mat33_determ(y),c*d>0&&(U=this.nifti_mat33_mul(y,x),f=U[0][0]+U[1][1]+U[2][2],f>E&&(E=f,m=I,N=p,b=u,F=g,A=_,M=T));switch(S=O=v=C=D=R=0,m*F){case 1:S="X",C="+";break;case-1:S="X",C="-";break;case 2:S="Y",C="+";break;case-2:S="Y",C="-";break;case 3:S="Z",C="+";break;case-3:S="Z",C="-";break}switch(N*A){case 1:O="X",D="+";break;case-1:O="X",D="-";break;case 2:O="Y",D="+";break;case-2:O="Y",D="-";break;case 3:O="Z",D="+";break;case-3:O="Z",D="-";break}switch(b*M){case 1:v="X",R="+";break;case-1:v="X",R="-";break;case 2:v="Y",R="+";break;case-2:v="Y",R="-";break;case 3:v="Z",R="+";break;case-3:v="Z",R="-";break}return S+O+v+C+D+R},n.NIFTI1.prototype.nifti_mat33_mul=function(t,i){var e,n,s=[[0,0,0],[0,0,0],[0,0,0]];for(e=0;e<3;e+=1)for(n=0;n<3;n+=1)s[e][n]=t[e][0]*i[0][n]+t[e][1]*i[1][n]+t[e][2]*i[2][n];return s},n.NIFTI1.prototype.nifti_mat33_determ=function(t){var i,e,n,s,a,l,r,o,h;return i=t[0][0],e=t[0][1],n=t[0][2],s=t[1][0],a=t[1][1],l=t[1][2],r=t[2][0],o=t[2][1],h=t[2][2],i*a*h-i*o*l-s*e*h+s*o*n+r*e*l-r*a*n},n.NIFTI1.prototype.getExtensionLocation=function(){return n.NIFTI1.MAGIC_COOKIE+4},n.NIFTI1.prototype.getExtensionSize=function(t){return n.Utils.getIntAt(t,this.getExtensionLocation(),this.littleEndian)},n.NIFTI1.prototype.getExtensionCode=function(t){return n.Utils.getIntAt(t,this.getExtensionLocation()+4,this.littleEndian)};var s=typeof t;"undefined"!==s&&t.exports&&(t.exports=n.NIFTI1)},eb9f:function(t,i,e){"use strict";var n=n||{};n.Utils=n.Utils||{},n.Utils.crcTable=null,n.Utils.GUNZIP_MAGIC_COOKIE1=31,n.Utils.GUNZIP_MAGIC_COOKIE2=139,n.Utils.getStringAt=function(t,i,e){var n,s,a="";for(n=i;n<e;n+=1)s=t.getUint8(n),0!==s&&(a+=String.fromCharCode(s));return a},n.Utils.getByteAt=function(t,i){return t.getInt8(i)},n.Utils.getShortAt=function(t,i,e){return t.getInt16(i,e)},n.Utils.getIntAt=function(t,i,e){return t.getInt32(i,e)},n.Utils.getFloatAt=function(t,i,e){return t.getFloat32(i,e)},n.Utils.getDoubleAt=function(t,i,e){return t.getFloat64(i,e)},n.Utils.getLongAt=function(t,i,e){var s,a=[],l=0;for(s=0;s<8;s+=1)a[s]=n.Utils.getByteAt(t,i+s,e);for(s=a.length-1;s>=0;s--)l=256*l+a[s];return l},n.Utils.toArrayBuffer=function(t){var i,e,n;for(i=new ArrayBuffer(t.length),e=new Uint8Array(i),n=0;n<t.length;n+=1)e[n]=t[n];return i},n.Utils.isString=function(t){return"string"===typeof t||t instanceof String},n.Utils.formatNumber=function(t,i){var e=0;return e=n.Utils.isString(t)?Number(t):t,e=i?e.toPrecision(5):e.toPrecision(7),parseFloat(e)},n.Utils.makeCRCTable=function(){for(var t,i=[],e=0;e<256;e++){t=e;for(var n=0;n<8;n++)t=1&t?3988292384^t>>>1:t>>>1;i[e]=t}return i},n.Utils.crc32=function(t){for(var i=n.Utils.crcTable||(n.Utils.crcTable=n.Utils.makeCRCTable()),e=-1,s=0;s<t.byteLength;s++)e=e>>>8^i[255&(e^t.getUint8(s))];return(-1^e)>>>0};var s=typeof t;"undefined"!==s&&t.exports&&(t.exports=n.Utils)}}]);