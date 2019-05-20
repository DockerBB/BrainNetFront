<template>
    <div v-loading="isLoading">
        <canvas id="fslpanel"  width="280" height="420" style="background-color: black"
                @mousedown="handleMouseDown($event)"
                @mousemove="handleAxisChange($event)"
                @mouseup="mouseFlag = true"></canvas>
        <el-row type="flex">
            x:{{this.axisX}},y:{{this.axisY}},z:{{this.axisZ}}
        </el-row>
        <el-row type="flex">
            <el-button @click="importBase">Base</el-button>
            <el-button @click="importSkeleton">Skeleton</el-button>
            <el-button @click="importtbssTfceCorrp">TBSS Tfce Corrp</el-button>
        </el-row>
    </div>
</template>

<script>
    /* eslint-disable */
    import * as NIFTI from 'nifti-reader-js'
    import * as d3 from 'd3'
    export default {
        data(){
            return {
                isLoading: false,
                baseHeader: null,
                baseImage: null,
                skeletonImage: null,
                tbssImage: null,
                mouseFlag: true,
                axisX: 90,
                axisY: 100,
                axisZ: 90
            }
        },
        methods: {
            load(buffer) {
                let imageBuffer
                let niftiHeader
                let niftiImage
                if (NIFTI.isCompressed(buffer)) {
                    buffer = NIFTI.decompress(buffer)
                    console.log('isCompressed')
                }
                if (NIFTI.isNIFTI(buffer)) {
                    niftiHeader = NIFTI.readHeader(buffer);
                    imageBuffer = NIFTI.readImage(niftiHeader, buffer);
                } else throw 'fail';
                switch (niftiHeader.datatypeCode){
                    case 1: throw 'don\'t support this data type, 太麻烦不想写';
                    case 2: niftiImage = new Uint8Array(imageBuffer, 0, imageBuffer.byteLength);break;
                    case 4: niftiImage = new Int16Array(imageBuffer);break;
                    case 8: niftiImage = new Int32Array(imageBuffer);break;
                    case 16: niftiImage = new Float32Array(imageBuffer);break;
                    case 32: throw 'don\'t support this data type, 不知道complex是啥格式';
                    case 64: niftiImage = new Float64Array(imageBuffer);break;
                    case 128:
                        let temp = new Uint8Array(imageBuffer)
                        niftiImage = Array(temp.length / 3);
                        for (let i = 0;i < temp.length / 3;i++){
                            niftiImage[i] = d3.rgb(temp[3*i],temp[3*i+1],temp[3*i+2])
                        }
                        break;
                    default:
                        throw 'don\'t support this data type, 先空着';
                }
                return {niftiImage:niftiImage,niftiHeader:niftiHeader}
            },
            loadAllImage(baseImageUri, skeletonImageUri, tbssImageUri){
                this.isLoading = true
                const self = this
                fetch('http:' + window.g.API_URL + baseImageUri, {
                    headers: {
                        'Accept': 'application/octet-stream',
                        'content-type': 'application/octet-stream'
                    },
                    method: 'GET',
                    credentials: 'include'
                }).then(data => data.arrayBuffer()).then(data => {
                    if (data) {
                        let niftiInfo = self.load(data);
                        self.baseHeader = niftiInfo.niftiHeader;
                        self.baseImage = niftiInfo.niftiImage;
                        self.draw();
                    }
                    return fetch('http:' + window.g.API_URL + skeletonImageUri, {
                        headers: {
                            'Accept': 'application/octet-stream',
                            'content-type': 'application/octet-stream'
                        },
                        method: 'GET',
                        credentials: 'include'
                    })
                }).then(data => data.arrayBuffer()).then(data => {
                    if (data) {
                        let niftiInfo = self.load(data);
                        self.skeletonImage = niftiInfo.niftiImage;
                        self.draw();
                    }
                    return fetch('http:' + window.g.API_URL + tbssImageUri, {
                        headers: {
                            'Accept': 'application/octet-stream',
                            'content-type': 'application/octet-stream'
                        },
                        method: 'GET',
                        credentials: 'include'
                    })
                }).then(data => data.arrayBuffer()).then(data => {
                    if (data) {
                        let niftiInfo = self.load(data);
                        self.tbssImage = niftiInfo.niftiImage;
                        self.draw();
                    }
                    self.isLoading = false
                }).catch(err=>self.$message({message: err, type: 'warning'}))
            },
            draw() {
                let x = this.axisX, y = this.axisY, z = this.axisZ
                let canvas = document.getElementById("fslpanel");
                let ctx = canvas.getContext("2d");
                let cols = this.baseHeader.dims[1];
                let rows = this.baseHeader.dims[2];
                let slices = this.baseHeader.dims[3];
                let offset, index, rgb, gray, skeleton, tbss;
                let a = d3.rgb(0,255,0),	//绿色
                    b = d3.rgb(255,0,0),	//红色
                    c = d3.rgb(255,255,0);	//黄色
                let y2rColor = d3.interpolateHslLong(c,b),
                    y2gColor = d3.interpolateHslLong(c,a);
                let imageData = ctx.createImageData(cols, rows);
                ctx.clearRect(0,0,canvas.width,canvas.height)
                for (let ctrY = 0; ctrY < rows; ctrY++) {
                    for (let ctrX = 0; ctrX < cols; ctrX++) {
                        offset = ((((z * rows) + ctrY) * cols) + ctrX);
                        index = (((rows - ctrY) * cols) + ctrX) * 4;
                        gray = this.baseImage == null ? 0:this.baseImage[offset];
                        skeleton = this.skeletonImage == null ? 0:this.skeletonImage[offset];
                        tbss = this.tbssImage == null ? 0:this.tbssImage[offset];
                        if (gray !== 0) {
                            imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = parseInt(gray * 255 * 1.5);
                        }
                        if (skeleton > 0.2 && skeleton < 0.7) {
                            // rgb = y2rColor(skeleton).match(/\d+/g)
                            imageData.data[index] = 0;
                            imageData.data[index + 1] = 255;
                            imageData.data[index + 2] = 0;
                        }
                        if (tbss !== 0) {
                            rgb = y2rColor(tbss).match(/\d+/g)
                            imageData.data[index] = parseInt(rgb[0]);
                            imageData.data[index + 1] = parseInt(rgb[1]);
                            imageData.data[index + 2] = parseInt(rgb[2]);
                        }
                        imageData.data[index + 3] = 255;//透明度
                    }
                }
                for (let i = 0; i < rows; i++) {
                    index = ((i * cols) + x) * 4;
                    imageData.data[index] = imageData.data[index + 1] = 0
                    imageData.data[index + 2] = imageData.data[index + 3] = 255
                }
                for (let i = 0; i < cols; i++) {
                    index = (((rows - y) * cols) + i) * 4;
                    imageData.data[index] = imageData.data[index + 1] = 0
                    imageData.data[index + 2] = imageData.data[index + 3] = 255
                }
                let newCanvas = document.createElement("canvas");
                newCanvas.width = imageData.width
                newCanvas.height = imageData.height
                newCanvas.getContext("2d").putImageData(imageData, 0, 0)
                ctx.drawImage(newCanvas, 0, 0, newCanvas.width, newCanvas.height, 14, 0, 252, 280);

                imageData = ctx.createImageData(cols, slices);
                for (let ctrZ = 0; ctrZ < slices; ctrZ++) {
                    for (let ctrX = 0; ctrX < cols; ctrX++) {
                        offset = ((((ctrZ * rows) + y) * cols) + ctrX);
                        index = (((slices - ctrZ - 1) * cols) + ctrX) * 4;
                        gray = this.baseImage == null ? 0:this.baseImage[offset];
                        skeleton = this.skeletonImage == null ? 0:this.skeletonImage[offset];
                        tbss = this.tbssImage == null ? 0:this.tbssImage[offset];
                        if (gray !== 0) {
                            imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = parseInt(gray * 255 * 1.5);
                        }
                        if (skeleton > 0.2 && skeleton < 0.7) {
                            // rgb = y2rColor(skeleton).match(/\d+/g)
                            imageData.data[index] = 0;
                            imageData.data[index + 1] = 255;
                            imageData.data[index + 2] = 0;
                        }
                        if (tbss !== 0) {
                            rgb = y2rColor(tbss).match(/\d+/g)
                            imageData.data[index] = parseInt(rgb[0]);
                            imageData.data[index + 1] = parseInt(rgb[1]);
                            imageData.data[index + 2] = parseInt(rgb[2]);
                        }
                        imageData.data[index + 3] = 255;//透明度
                    }
                }
                for (let i = 0; i < slices; i++) {
                    index = (((slices - i - 1) * cols) + x) * 4;
                    imageData.data[index] = imageData.data[index + 1] = 0
                    imageData.data[index + 2] = imageData.data[index + 3] = 255
                }
                for (let i = 0; i < cols; i++) {
                    index = (((slices - z - 1) * cols) + i) * 4;
                    imageData.data[index] = imageData.data[index + 1] = 0
                    imageData.data[index + 2] = imageData.data[index + 3] = 255
                }
                newCanvas = document.createElement("canvas");
                newCanvas.width = imageData.width
                newCanvas.height = imageData.height
                newCanvas.getContext("2d").putImageData(imageData, 0, 0)
                ctx.drawImage(newCanvas, 0, 0, newCanvas.width, newCanvas.height, 7, 287, 126, 126);

                imageData = ctx.createImageData(rows, slices);
                for (let ctrZ = 0; ctrZ < slices; ctrZ++) {
                    for (let ctrY = 0; ctrY < rows; ctrY++) {
                        offset = ((((ctrZ * rows) + ctrY) * cols) + x);
                        index = (((slices - ctrZ - 1) * rows) + (rows-ctrY)) * 4;
                        gray = this.baseImage == null ? 0:this.baseImage[offset];
                        skeleton = this.skeletonImage == null ? 0:this.skeletonImage[offset];
                        tbss = this.tbssImage == null ? 0:this.tbssImage[offset];
                        if (gray !== 0) {
                            imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = parseInt(gray * 255 * 1.5);
                        }
                        if (skeleton > 0.2 && skeleton < 0.7) {
                            // rgb = y2rColor(skeleton).match(/\d+/g)
                            imageData.data[index] = 0;
                            imageData.data[index + 1] = 255;
                            imageData.data[index + 2] = 0;
                        }
                        if (tbss !== 0) {
                            rgb = y2rColor(tbss).match(/\d+/g)
                            imageData.data[index] = parseInt(rgb[0]);
                            imageData.data[index + 1] = parseInt(rgb[1]);
                            imageData.data[index + 2] = parseInt(rgb[2]);
                        }
                        imageData.data[index + 3] = 255;//透明度
                    }
                }
                for (let i = 0; i < slices; i++) {
                    index = ((i * rows) + (rows-y)) * 4;
                    imageData.data[index] = imageData.data[index + 1] = 0
                    imageData.data[index + 2] = imageData.data[index + 3] = 255
                }
                for (let i = 0; i < rows; i++) {
                    index = (((slices - z - 1) * rows) + i) * 4;
                    imageData.data[index] = imageData.data[index + 1] = 0
                    imageData.data[index + 2] = imageData.data[index + 3] = 255
                }
                newCanvas = document.createElement("canvas");
                newCanvas.width = imageData.width
                newCanvas.height = imageData.height
                newCanvas.getContext("2d").putImageData(imageData, 0, 0)
                ctx.drawImage(newCanvas, 0, 0, newCanvas.width, newCanvas.height, 140, 287, 140, 126);
                // ctx.putImageData(imageData, 0, 0)
            },
            importBase(){
                let input = document.createElement('input');
                const self = this
                input.type = 'file';
                input.accept = '.nii,.nii.gz';
                input.onchange = function(ev) {
                    const file = ev.target.files[0];
                    let reader = new FileReader();
                    reader.onload = e=> {
                        let buffer = reader.result;
                        let niftiInfo = self.load(buffer);
                        self.baseHeader = niftiInfo.niftiHeader;
                        self.baseImage = niftiInfo.niftiImage;
                        self.draw()
                    };
                    reader.readAsArrayBuffer(file);
                    return false;
                };
                input.click();
            },
            importSkeleton(){
                let input = document.createElement('input');
                const self = this
                input.type = 'file';
                input.accept = '.nii,.nii.gz';
                input.onchange = function(ev) {
                    const file = ev.target.files[0];
                    let reader = new FileReader();
                    reader.onload = e=> {
                        let buffer = reader.result;
                        let niftiInfo = self.load(buffer);
                        self.skeletonImage = niftiInfo.niftiImage;
                        self.draw()
                    };
                    reader.readAsArrayBuffer(file);
                    return false;
                };
                input.click();
            },
            importtbssTfceCorrp(){
                let input = document.createElement('input');
                const self = this
                input.type = 'file';
                input.accept = '.nii,.nii.gz';
                input.onchange = function(ev) {
                    const file = ev.target.files[0];
                    let reader = new FileReader();
                    reader.onload = e=> {
                        let buffer = reader.result;
                        let niftiInfo = self.load(buffer);
                        self.tbssImage = niftiInfo.niftiImage;
                        self.draw()
                    };
                    reader.readAsArrayBuffer(file);
                    return false;
                };
                input.click();
            },
            handleMouseDown(event){
                this.mouseFlag = false;
                this.handleAxisChange(event);
            },
            handleAxisChange(event){
                if (this.mouseFlag) return;
                if (this.baseImage == null&&this.skeletonImage == null&&this.tbssImage == null) return;
                let offsetX = event.offsetX;
                let offsetY = event.offsetY;
                let header = this.baseHeader;
                if (offsetY <= 280) {
                    if (offsetX > 14 && offsetX <= 266)this.axisX = parseInt((offsetX-14)/252*header.dims[1]);
                    else if (offsetX <= 14) this.axisX = 0
                    else if (offsetX > 266) this.axisX = header.dims[1] - 1
                    this.axisY = header.dims[2] - parseInt(offsetY/280*header.dims[2])
                }else if (offsetX < 140) {
                    if (offsetX > 7 && offsetX <= 133)this.axisX = parseInt((offsetX-7)/126*header.dims[1]);
                    else if (offsetX <= 7) this.axisX = 0
                    else if (offsetX > 133) this.axisX = header.dims[1] - 1
                    if (offsetY > 287 && offsetY <= 413)this.axisZ = header.dims[3] - parseInt((offsetY-287)/126*header.dims[3]);
                    else if (offsetY <= 287) this.axisZ = header.dims[3] - 1
                    else if (offsetY > 413) this.axisZ = 0
                }else if (offsetX <= 280){
                    this.axisY = header.dims[2] - parseInt((offsetX-140)/140*header.dims[2]);
                    if (offsetY > 287 && offsetY <= 413)this.axisZ = header.dims[3] - parseInt((offsetY-287)/126*header.dims[3]);
                    else if (offsetY <= 287) this.axisZ = header.dims[3] - 1
                    else if (offsetY > 413) this.axisZ = 0
                }
                this.draw()
            }
        }
    }
</script>

<style scoped>

</style>
