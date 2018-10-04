/* eslint-disable */
import * as NIFTI from 'nifti-reader-js'
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
    // console.log(buffer);
    if (NIFTI.isNIFTI(buffer)) {
      this.niftiHeader = NIFTI.readHeader(buffer);
      console.log(this.niftiHeader.toFormattedString());
      var imageBuffer = NIFTI.readImage(this.niftiHeader, buffer);
      console.log(imageBuffer);
      console.log("Is Extentalbe:" + NIFTI.hasExtension(this.niftiHeader));
    } else console.log('fail');
    var niftiCanvas = document.createElement("canvas");
    var ctx = niftiCanvas.getContext("2d");
    var cols = this.niftiHeader.dims[1];
    var rows = this.niftiHeader.dims[2];
    var slices = this.niftiHeader.dims[3];
    var timepoints = this.niftiHeader.dims[4] || 1;
    var imageData = ctx.createImageData(cols, rows);
    niftiCanvas.width = cols;
    niftiCanvas.height = rows;
    this.niftiImage = new Uint8Array(imageBuffer, 0, imageBuffer.byteLength);
    for (var ctrZ = 0; ctrZ < slices; ctrZ += 1) {
      // var outputArr = [];
      for (var ctrY = 0; ctrY < rows; ctrY += 1) {
        for (var ctrX = 0; ctrX < cols; ctrX += 1) {
          var offset = ((((ctrZ * rows) + ctrY) * cols) + ctrX);
          var index = ((ctrY * cols) + ctrX) * 4;
          var value = this.niftiImage[offset];
          // imageData.data[index] = (value >> 16) & 0xff;
          // imageData.data[index + 1] = (value >> 8) & 0xff;
          // imageData.data[index + 2] = (value) & 0xff;
          imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = value;
          imageData.data[index + 3] = 255;
          // outputArr[outputArr.length] = value;
        }
        // console.log(outputArr)
      }
      // console.log(ctrZ)
      ctx.putImageData(imageData, 0, 0);
      this.z_slice[ctrZ] = niftiCanvas.toDataURL();
    }
    var imageData = ctx.createImageData(cols, rows);
    niftiCanvas.width = cols;
    niftiCanvas.height = rows;
    for (var ctrY = 0; ctrY < rows; ctrY += 1) {
      for (var ctrZ = 0; ctrZ < slices; ctrZ += 1) {
        for (var ctrX = 0; ctrX < cols; ctrX += 1) {
          var offset = ((((ctrZ * rows) + ctrY) * cols) + ctrX);
          var index = ((ctrZ * cols) + ctrX) * 4;
          var value = this.niftiImage[offset];
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
    for (var ctrX = 0; ctrX < cols; ctrX += 1) {
      for (var ctrZ = 0; ctrZ < slices; ctrZ += 1) {
        for (var ctrY = 0; ctrY < rows; ctrY += 1) {
          var offset = ((((ctrZ * rows) + ctrY) * cols) + ctrX);
          var index = ((ctrZ * rows) + ctrY) * 4;
          var value = this.niftiImage[offset];
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
