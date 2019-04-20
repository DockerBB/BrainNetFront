/* eslint-disable */
import * as NIFTI from 'nifti-reader-js'
import * as d3 from 'd3'
function NIFTILoader() {
  this.x_slice = [];
  this.y_slice = [];
  this.z_slice = [];
  this.niftiHeader = null;
  this.niftiImage = null;
}
Object.assign( NIFTILoader.prototype , {
  constructor: NIFTILoader,
  load: function (buffer) {
    let imageBuffer
    if (NIFTI.isNIFTI(buffer)) {
      this.niftiHeader = NIFTI.readHeader(buffer);
      console.log(this.niftiHeader.toFormattedString());
      imageBuffer = NIFTI.readImage(this.niftiHeader, buffer);
      console.log(imageBuffer);
      console.log("Is Extentalbe:" + NIFTI.hasExtension(this.niftiHeader));
    } else console.log('fail');
    let a = d3.rgb(0,0,255),	//蓝色
        b = d3.rgb(255,0,0);	//红色
    let color = d3.interpolateHslLong(b,a);
    let niftiCanvas = document.createElement("canvas");
    let ctx = niftiCanvas.getContext("2d");
    let cols = this.niftiHeader.dims[1];
    let rows = this.niftiHeader.dims[2];
    let slices = this.niftiHeader.dims[3];
    let timepoints = this.niftiHeader.dims[4] || 1;
    var imageData = ctx.createImageData(cols, rows);
    niftiCanvas.width = cols;
    niftiCanvas.height = rows;
    this.niftiImage = new Uint8Array(imageBuffer, 0, imageBuffer.byteLength);
    for (let ctrZ = 0; ctrZ < slices; ctrZ += 1) {
      // let outputArr = [];
      for (let ctrY = 0; ctrY < rows; ctrY += 1) {
        for (let ctrX = 0; ctrX < cols; ctrX += 1) {
          let offset = ((((ctrZ * rows) + ctrY) * cols) + ctrX);
          let index = ((ctrY * cols) + ctrX) * 4;
          let roi = this.niftiImage[offset];
          let rgb
          if (roi > 0) {
            rgb = color(roi/116).match(/\d+/g)
            imageData.data[index] = parseInt(rgb[0]);
            imageData.data[index + 1] = parseInt(rgb[1]);
            imageData.data[index + 2] = parseInt(rgb[2]);
          } else imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = roi;
          imageData.data[index + 3] = 255;//透明度
        }
      }
      ctx.putImageData(imageData, 0, 0);
      this.z_slice[ctrZ] = niftiCanvas.toDataURL();
    }
    var imageData = ctx.createImageData(cols, rows);
    niftiCanvas.width = cols;
    niftiCanvas.height = rows;
    for (let ctrY = 0; ctrY < rows; ctrY += 1) {
      for (let ctrZ = 0; ctrZ < slices; ctrZ += 1) {
        for (let ctrX = 0; ctrX < cols; ctrX += 1) {
          let offset = ((((ctrZ * rows) + ctrY) * cols) + ctrX);
          let index = ((ctrZ * cols) + ctrX) * 4;
          let value = this.niftiImage[offset];
          // imageData.data[index] = (value >> 16) & 0xff;
          // imageData.data[index + 1] = (value >> 8) & 0xff;
          // imageData.data[index + 2] = (value) & 0xff;
          imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = value;
          imageData.data[index + 3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      this.y_slice[ctrY] = niftiCanvas.toDataURL();
    }
    var imageData = ctx.createImageData(cols, rows);
    niftiCanvas.width = cols;
    niftiCanvas.height = rows;
    for (let ctrX = 0; ctrX < cols; ctrX += 1) {
      for (let ctrZ = 0; ctrZ < slices; ctrZ += 1) {
        for (let ctrY = 0; ctrY < rows; ctrY += 1) {
          let offset = ((((ctrZ * rows) + ctrY) * cols) + ctrX);
          let index = ((ctrZ * rows) + ctrY) * 4;
          let value = this.niftiImage[offset];
          // imageData.data[index] = (value >> 16) & 0xff;
          // imageData.data[index + 1] = (value >> 8) & 0xff;
          // imageData.data[index + 2] = (value) & 0xff;
          imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = value;
          imageData.data[index + 3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      this.x_slice[ctrX] = niftiCanvas.toDataURL();
    }
  }
} );

export { NIFTILoader };
