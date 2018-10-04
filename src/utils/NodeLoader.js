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
import { DefaultLoadingManager, EventDispatcher, FileLoader, MeshLambertMaterial, SphereGeometry, Mesh, Vector3 } from 'three'

function NodeLoader( manager ) {

  this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

};

Object.assign( NodeLoader.prototype ,{

  constructor: NodeLoader,

  addEventListener: EventDispatcher.prototype.addEventListener,
  hasEventListener: EventDispatcher.prototype.hasEventListener,
  removeEventListener: EventDispatcher.prototype.removeEventListener,
  dispatchEvent: EventDispatcher.prototype.dispatchEvent,

  load: function ( data, onLoad ) {

      var scope = this;
      scope.parse( data, onLoad );

      // var loader = new FileLoader( scope.manager );
      // loader.setResponseType( 'arraybuffer' );
      // loader.load( url, function ( text ) {
      //
      //   onLoad( scope.parse( text, scene ) );
      //   // scope.parse( text, scene )
      //
      // });
  },

  parse: function ( data, onLoad ) {

      var ObjectVertex = [];
      var ObjectRadius = [];
      var ObjectLabel = [];
      var ObjectColorId = [];
      var pattern, result;

      // float float float int float string

      pattern = /([\+|\-]?[\d]+\.?[\d|\-|e]*)[\s]+([\+|\-]?[\d]+\.?[\d|\-|e]*)[\s]+([\+|\-]?[\d]+\.?[\d|\-|e]*)[\s]+([\d]+)[\s]+([\d]+\.?[\d|\-|e]*)[\s]+([a-zA-Z]+[\.][LR])[\s]+/g;

      while ( ( result = pattern.exec( data ) ) != null ) {

          // ["-38.65	-5.68	50.94	4	4.96	PreCG.L", "x", "y", "z", "color", "size", "Label"]

          ObjectVertex[ObjectVertex.length] = new Vector3( result[ 1 ], result[ 2 ], result[ 3 ] );
          ObjectColorId[ObjectColorId.length] = parseInt( result[ 4 ] );
          ObjectRadius[ObjectRadius.length] = parseFloat( result[ 5 ] );
          ObjectLabel[ObjectLabel.length] = result[ 6 ];
      }
      onLoad( ObjectVertex, ObjectColorId, ObjectRadius, ObjectLabel );
  }

} );
export { NodeLoader };
