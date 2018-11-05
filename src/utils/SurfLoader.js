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
import { DefaultLoadingManager, EventDispatcher, Geometry, Vector3, Face3, BufferGeometry, BufferAttribute, Float32Array } from 'three'

function SurfLoader( manager ) {

  this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

};

Object.assign( SurfLoader.prototype ,{

  constructor: SurfLoader,

  addEventListener: EventDispatcher.prototype.addEventListener,
  hasEventListener: EventDispatcher.prototype.hasEventListener,
  removeEventListener: EventDispatcher.prototype.removeEventListener,
  dispatchEvent: EventDispatcher.prototype.dispatchEvent,

  load: function ( data, onload ) {

    var scope = this;
    // var geometry = scope.parse( data );
    onload( scope.parse( data ) );
    /**
     * https://www.jianshu.com/p/8aa21a1ae6a6
     */
  },

  parse: function ( data ) {
    var geometry = new Geometry();

    function vertex( x, y, z ) {

      geometry.vertices.push( new Vector3( x, y, z ) );

    }

    function face3( a, b, c ) {

      geometry.faces.push( new Face3( a, b, c ) );

    };

    var pattern, result;

    // float float float

    pattern = /([\+|\-]?[\d]+[\.][\d|\-|e]+)[ ]+([\+|\-]?[\d]+[\.][\d|\-|e]+)[ ]+([\+|\-]?[\d]+[\.][\d|\-|e]+)/g;

    while ( ( result = pattern.exec( data ) ) != null ) {

      // ["1.0 2.0 3.0", "1.0", "2.0", "3.0"]

      vertex( parseFloat( result[ 1 ] ), parseFloat( result[ 2 ] ), parseFloat( result[ 3 ] ) );

    }

    // int int int

    pattern = /([\d]+)[ ]+([\d]+)[ ]+([\d]+)/g;

    while ( ( result = pattern.exec( data ) ) != null ) {

      // ["1 2 3", "1", "2", "3"]

      face3( parseInt( result[ 1 ] ) - 1, parseInt( result[ 2 ] ) - 1, parseInt( result[ 3 ] ) - 1 );

    }

    //geometry.computeCentroids();
    geometry.computeFaceNormals();    //平滑
    geometry.computeVertexNormals();  //平滑
    geometry.computeBoundingBox();

    // let positions = new Float32Array(geometry.vertices.length * 3);
    // let colors = new Float32Array(geometry.vertices.length * 3);
    // geometry.addAttribute('position', new BufferAttribute(positions, 3));
    // geometry.addAttribute('color', new BufferAttribute(colors, 3));

    return new BufferGeometry().fromGeometry(geometry);
    // return geometry;
    // geometry.toJSON()

  }

} );
export { SurfLoader };
