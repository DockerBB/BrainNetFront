/* eslint-disable */
/**
 * @author mrdoob / http://mrdoob.com/
 * @author Alex Pletzer
 *
 * Updated on 22.03.2017
 * VTK header is now parsed and used to extract all the compressed data
 * @author Andrii Iudin https://github.com/andreyyudin
 * @author Paul Kibet Korir https://github.com/polarise
 * @author Sriram Somasundharam https://github.com/raamssundar
 */
import { DefaultLoadingManager, EventDispatcher, FileLoader, Geometry, Line } from 'three'

function EdgeLoader( manager ) {

  this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

};

Object.assign( EdgeLoader.prototype ,{

  constructor: EdgeLoader,

  addEventListener: EventDispatcher.prototype.addEventListener,
  hasEventListener: EventDispatcher.prototype.hasEventListener,
  removeEventListener: EventDispatcher.prototype.removeEventListener,
  dispatchEvent: EventDispatcher.prototype.dispatchEvent,

  load: function ( data, onload ) {
      var scope = this;
      scope.parse( data, onload )
  },

  parse: function ( data, onload ) {
      var list = [];
      var i = 0;
      data.split(/\n/g).forEach(function(row){
          if (row[0] != '#' && row[0]) {
              row.split(/\s/g).forEach(function (cell, j) {
                  if (cell && cell != 0) {
                      list.push([i, j, parseFloat(cell)]);
                  }
              });
              i++;
          }
      });
      list.forEach(function (item) {
          onload( item[0], item[1], item[2] );
      })
  },

  loadMatrix: function (data) {
      var matrix = [];
      var i = 0;
      data.split(/\n/g).forEach(function(row){
          if (row[0] != '#' && row[0]) {
              let mrow = []
              row.split(/\s+|,/g).forEach(function (cell, j) {
                  if (cell !== '') mrow.push(parseFloat(cell));
              });
              matrix[i] = mrow;
              i++;
          }
      });
      return matrix;
  },
  loadAList: function (data) {
      var list = [];
      var i = 0, vf = 0,
          max = -100,
          min = 100;
      data.split(/\n/g).forEach(function(row){
          if (row[0] != '#' && row[0]) {
              row.split(/\s|,/g).filter(v=>v !== '').forEach(function (cell, j) {
                  if (parseFloat(cell) !== 0.0){
                      vf = parseFloat(cell);
                      list.push([i, j, vf]);
                  }
                  max = max >= vf ? max : vf;
                  min = min <= vf ? min : vf;
              });
              i++;
          }
      });
      return {
          n: i,
          list: list,
          max: max,
          min: min
      }
  }

} );
export { EdgeLoader };
