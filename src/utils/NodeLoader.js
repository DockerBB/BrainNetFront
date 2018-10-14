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
import { DefaultLoadingManager, EventDispatcher, FileLoader, MeshBasicMaterial, SphereBufferGeometry, Mesh, Vector3 } from 'three'

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

      var Object = [];
      var ObjectRadius = [];
      var ObjectColorId = [];
      var pattern, result;

      // float float float int float string

      pattern = /([\+|\-]?[\d]+\.?[\d|\-|e]*)[\s]+([\+|\-]?[\d]+\.?[\d|\-|e]*)[\s]+([\+|\-]?[\d]+\.?[\d|\-|e]*)[\s]+([\d]+)[\s]+([\d]+\.?[\d|\-|e]*)[\s]+([a-zA-Z]+[\.][LR])[\s]+/g;

      var sphereMaterial = new MeshBasicMaterial({ color: 0x3a8ee6 });
      var shpereGeometry = new SphereBufferGeometry();
      while ( ( result = pattern.exec( data ) ) != null ) {

          // ["-38.65	-5.68	50.94	4	4.96	PreCG.L", "x", "y", "z", "color", "size", "Label"]new THREE.SphereGeometry(radius)

          var mesh = new Mesh(
              shpereGeometry.clone(),
              sphereMaterial.clone()
          );
          mesh.position.set( parseFloat( result[ 1 ] ), parseFloat( result[ 2 ] ), parseFloat( result[ 3 ] ) );
          mesh.name = result[ 6 ];
          Object.push( mesh );
          ObjectRadius.push( parseFloat( result[ 5 ] ) );
          ObjectColorId.push( parseInt( result[ 4 ] ) );
      }
      onLoad( Object, ObjectRadius, ObjectColorId );
  }

} );
export { NodeLoader };
