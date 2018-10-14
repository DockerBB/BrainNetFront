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
      data.split(/\n/g).splice(1).forEach(function(row, i){
          row.split(/\s/g).forEach(function(cell, j){
              if (cell != 0) {
                  list.push([i, j, parseFloat( cell )]);
                  // onload( i, j, parseFloat( cell ) );
                  // onload( i - 1, j, cell );
              }
          });
      });
      list.forEach(function (item) {
          onload( item[0], item[1], item[2] );
      })
  }

} );
export { EdgeLoader };
