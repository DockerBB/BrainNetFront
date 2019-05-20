/* eslint-disable */
import * as NIFTI from 'nifti-reader-js'
import * as d3 from 'd3'
function NIFTILoader() {
    this.x_slice = [];
    this.y_slice = [];
    this.z_slice = [];
    this.x_img = null;
    this.y_img = null;
    this.z_img = null;
    this.px = null;
    this.py = null;
    this.pz = null;
    this.niftiHeader = null;
    this.niftiImage = null;
}
Object.assign( NIFTILoader.prototype , {
  constructor: NIFTILoader,
  load: function (buffer) {
    let imageBuffer
    if (NIFTI.isCompressed(buffer)) {
      buffer = NIFTI.decompress(buffer)
      console.log('isCompressed')
    }
    if (NIFTI.isNIFTI(buffer)) {
      this.niftiHeader = NIFTI.readHeader(buffer);
      console.log(this.niftiHeader.toFormattedString());
      console.log(this.niftiHeader);
      imageBuffer = NIFTI.readImage(this.niftiHeader, buffer);
      console.log('image size: '+imageBuffer.byteLength+' byte');
      console.log("Is Extentalbe:" + NIFTI.hasExtension(this.niftiHeader));
    } else console.log('fail');
    switch (this.niftiHeader.datatypeCode){
        case 1: throw 'don\'t support this data type, 太麻烦不想写';
        case 2: this.niftiImage = new Uint8Array(imageBuffer, 0, imageBuffer.byteLength);this.drawWithROI();break;
        case 4: this.niftiImage = new Int16Array(imageBuffer);this.drawWithROI();break;
        case 8: this.niftiImage = new Int32Array(imageBuffer);this.drawWithROI();break;
        case 16: this.niftiImage = new Float32Array(imageBuffer);this.drawWithOpacity();break;
        case 32: throw 'don\'t support this data type, 不知道complex是啥格式';
        case 64: this.niftiImage = new Float64Array(imageBuffer);this.drawWithOpacity();break;
        case 128:
          let temp = new Uint8Array(imageBuffer)
          this.niftiImage = Array(temp.length / 3);
          for (let i = 0;i < temp.length / 3;i++){
            this.niftiImage[i] = d3.rgb(temp[3*i],temp[3*i+1],temp[3*i+2])
          }
          break;
        default:
            throw 'don\'t support this data type, 先空着';
    }
  },
  drawWithROI: function () {
      let a = d3.rgb(0,0,255),	//蓝色
          b = d3.rgb(255,0,0);	//红色
      let color = d3.interpolateHslLong(b,a);
      let niftiCanvas = document.createElement("canvas");
      let ctx = niftiCanvas.getContext("2d");
      let cols = this.niftiHeader.dims[1];
      let rows = this.niftiHeader.dims[2];
      let slices = this.niftiHeader.dims[3];
      let timepoints = this.niftiHeader.dims[4] || 1;
      let imageData = ctx.createImageData(cols, rows);
      niftiCanvas.width = cols;
      niftiCanvas.height = rows;
      for (let ctrZ = 0; ctrZ < slices; ctrZ++) {
          // let outputArr = [];
          for (let ctrY = 0; ctrY < rows; ctrY++) {
              for (let ctrX = 0; ctrX < cols; ctrX++) {
                  let offset = ((((ctrZ * rows) + ctrY) * cols) + ctrX);
                  let index = ((ctrY * cols) + ctrX) * 4;
                  let roi = this.niftiImage[offset];
                  let rgb
                  if (roi > 0) {
                      rgb = color(roi/116).match(/\d+/g)
                      imageData.data[index] = parseInt(rgb[0]);
                      imageData.data[index + 1] = parseInt(rgb[1]);
                      imageData.data[index + 2] = parseInt(rgb[2]);
                  } else {
                      if(imageData.data[index] !== 0)imageData.data[index] = 0;
                      if(imageData.data[index + 1] !== 0)imageData.data[index + 1] = 0;
                      if(imageData.data[index + 2] !== 0)imageData.data[index + 2] = 0;
                  }
                  imageData.data[index + 3] = 255;//透明度
              }
          }
          ctx.putImageData(imageData, 0, 0);
          this.z_slice[ctrZ] = niftiCanvas.toDataURL();
      }
      imageData = ctx.createImageData(cols, rows);
      niftiCanvas.width = cols;
      niftiCanvas.height = slices;
      for (let ctrY = 0; ctrY < rows; ctrY++) {
          for (let ctrZ = 0; ctrZ < slices; ctrZ++) {
              for (let ctrX = 0; ctrX < cols; ctrX++) {
                  let offset = ((((ctrZ * rows) + ctrY) * cols) + ctrX);
                  let index = (((slices - ctrZ - 1) * cols) + ctrX) * 4;
                  let roi = this.niftiImage[offset];
                  let rgb
                  if (roi > 0) {
                      rgb = color(roi/116).match(/\d+/g)
                      imageData.data[index] = parseInt(rgb[0]);
                      imageData.data[index + 1] = parseInt(rgb[1]);
                      imageData.data[index + 2] = parseInt(rgb[2]);
                  } else {
                      if(imageData.data[index] !== 0)imageData.data[index] = 0;
                      if(imageData.data[index + 1] !== 0)imageData.data[index + 1] = 0;
                      if(imageData.data[index + 2] !== 0)imageData.data[index + 2] = 0;
                  }
                  imageData.data[index + 3] = 255;//透明度
              }
          }
          ctx.putImageData(imageData, 0, 0);
          this.y_slice[ctrY] = niftiCanvas.toDataURL();
      }
      imageData = ctx.createImageData(cols, rows);
      niftiCanvas.width = slices;
      niftiCanvas.height = rows;
      for (let ctrX = 0; ctrX < cols; ctrX++) {
          for (let ctrZ = 0; ctrZ < slices; ctrZ++) {
              for (let ctrY = 0; ctrY < rows; ctrY++) {
                  let offset = ((((ctrZ * rows) + ctrY) * cols) + ctrX);
                  let index = ((ctrY * slices) + ctrZ) * 4;
                  let roi = this.niftiImage[offset];
                  let rgb
                  if (roi > 0) {
                      rgb = color(roi/116).match(/\d+/g)
                      imageData.data[index] = parseInt(rgb[0]);
                      imageData.data[index + 1] = parseInt(rgb[1]);
                      imageData.data[index + 2] = parseInt(rgb[2]);
                  } else {
                      if(imageData.data[index] !== 0)imageData.data[index] = 0;
                      if(imageData.data[index + 1] !== 0)imageData.data[index + 1] = 0;
                      if(imageData.data[index + 2] !== 0)imageData.data[index + 2] = 0;
                  }
                  imageData.data[index + 3] = 255;//透明度
              }
          }
          ctx.putImageData(imageData, 0, 0);
      }
      this.drawAuxiliary(parseInt(cols/2),parseInt(rows/2),parseInt(slices/2))
  },
  drawWithOpacity: function () {
      let niftiCanvas = document.createElement("canvas");
      let ctx = niftiCanvas.getContext("2d");
      let cols = this.niftiHeader.dims[1];
      let rows = this.niftiHeader.dims[2];
      let slices = this.niftiHeader.dims[3];
      let timepoints = this.niftiHeader.dims[4] || 1;
      let imageData = ctx.createImageData(cols, rows);
      niftiCanvas.width = cols;
      niftiCanvas.height = rows;
      for (let ctrZ = 0; ctrZ < slices; ctrZ++) {
          // let outputArr = [];
          for (let ctrY = 0; ctrY < rows; ctrY++) {
              for (let ctrX = 0; ctrX < cols; ctrX++) {
                  let offset = ((((ctrZ * rows) + ctrY) * cols) + ctrX);
                  let index = ((ctrY * cols) + ctrX) * 4;
                  let opacity = this.niftiImage[offset];
                  if (opacity === 0&&imageData.data[index] === 0) continue;
                  imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = opacity === 0?0:255;
                  imageData.data[index + 3] = parseInt(opacity*255);//透明度
              }
          }
          ctx.putImageData(imageData, 0, 0);
          this.z_slice[ctrZ] = niftiCanvas.toDataURL();
      }
      imageData = ctx.createImageData(cols, rows);
      niftiCanvas.width = cols;
      niftiCanvas.height = slices;
      for (let ctrY = 0; ctrY < rows; ctrY++) {
          for (let ctrZ = 0; ctrZ < slices; ctrZ++) {
              for (let ctrX = 0; ctrX < cols; ctrX++) {
                  let offset = ((((ctrZ * rows) + ctrY) * cols) + ctrX);
                  let index = (((slices - ctrZ - 1) * cols) + ctrX) * 4;
                  let opacity = this.niftiImage[offset];
                  if (opacity === 0&&imageData.data[index] === 0) continue;
                  imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = opacity === 0?0:255;
                  imageData.data[index + 3] = parseInt(opacity*255);//透明度
              }
          }
          ctx.putImageData(imageData, 0, 0);
          this.y_slice[ctrY] = niftiCanvas.toDataURL();
      }
      imageData = ctx.createImageData(cols, rows);
      niftiCanvas.width = slices;
      niftiCanvas.height = rows;
      for (let ctrX = 0; ctrX < cols; ctrX++) {
          for (let ctrZ = 0; ctrZ < slices; ctrZ++) {
              for (let ctrY = 0; ctrY < rows; ctrY++) {
                  let offset = ((((ctrZ * rows) + ctrY) * cols) + ctrX);
                  let index = ((ctrY * slices) + ctrZ) * 4;
                  let opacity = this.niftiImage[offset];
                  if (opacity === 0&&imageData.data[index] === 0) continue;
                  imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = opacity === 0?0:255;
                  imageData.data[index + 3] = parseInt(opacity*255);//透明度
              }
          }
          ctx.putImageData(imageData, 0, 0);
          this.x_slice[ctrX] = niftiCanvas.toDataURL();
      }
      this.drawAuxiliary(parseInt(cols/2),parseInt(rows/2),parseInt(slices/2))
  },
  drawAuxiliary: function () {
      let x = this.px, y = this.py, z = this.pz;
      let cols = this.niftiHeader.dims[1];
      let rows = this.niftiHeader.dims[2];
      let slices = this.niftiHeader.dims[3];

      let img_x = new Image(),img_y = new Image(),img_z = new Image();

      img_x.src = this.x_slice[x]
      img_x.onload = () => {
          let niftiCanvas = document.createElement("canvas");
          let ctx = niftiCanvas.getContext("2d");
          let imageData
          niftiCanvas.width = slices;
          niftiCanvas.height = rows;
          ctx.drawImage(img_x, 0, 0, slices, rows)
          imageData = ctx.getImageData(0, 0, slices, rows)
          for (let i = 0; i < slices; i++) {
              let index = ((y * slices) + i) * 4;
              imageData.data[index] = imageData.data[index + 2] = 0
              imageData.data[index + 1] = imageData.data[index + 3] = 255
          }
          for (let i = 0; i < rows; i++) {
              let index = ((i * slices) + z) * 4;
              imageData.data[index] = imageData.data[index + 2] = 0
              imageData.data[index + 1] = imageData.data[index + 3] = 255
          }
          ctx.putImageData(imageData, 0, 0);
          this.x_img = niftiCanvas.toDataURL();
      }

      img_y.src = this.y_slice[y]
      img_y.onload = () => {
          let niftiCanvas = document.createElement("canvas");
          let ctx = niftiCanvas.getContext("2d");
          let imageData
          niftiCanvas.width = cols;
          niftiCanvas.height = slices;
          ctx.drawImage(img_y, 0, 0, cols, slices)
          imageData = ctx.getImageData(0, 0, cols, slices)
          for (let i = 0; i < slices; i++) {
              let index = (((slices - i - 1) * cols) + x) * 4;
              imageData.data[index] = imageData.data[index + 2] = 0
              imageData.data[index + 1] = imageData.data[index + 3] = 255
          }
          for (let i = 0; i < cols; i++) {
              let index = (((slices - z - 1) * cols) + i) * 4;
              imageData.data[index] = imageData.data[index + 2] = 0
              imageData.data[index + 1] = imageData.data[index + 3] = 255
          }
          ctx.putImageData(imageData, 0, 0);
          this.y_img = niftiCanvas.toDataURL();
      }

      img_z.src = this.z_slice[z]
      img_z.onload = () => {
          let niftiCanvas = document.createElement("canvas");
          let ctx = niftiCanvas.getContext("2d");
          let imageData
          niftiCanvas.width = cols;
          niftiCanvas.height = rows;
          ctx.drawImage(img_z, 0, 0, cols, rows)
          imageData = ctx.getImageData(0, 0, cols, rows)
          let index
          for (let i = 0; i < rows; i++) {
              index = ((i * cols) + x) * 4;
              imageData.data[index] = imageData.data[index + 2] = 0
              imageData.data[index + 1] = imageData.data[index + 3] = 255
          }
          for (let i = 0; i < cols; i++) {
              index = ((y * cols) + i) * 4;
              imageData.data[index] = imageData.data[index + 2] = 0
              imageData.data[index + 1] = imageData.data[index + 3] = 255
          }
          ctx.putImageData(imageData, 0, 0);
          this.z_img = niftiCanvas.toDataURL();
      }
  }
} );

export { NIFTILoader };
