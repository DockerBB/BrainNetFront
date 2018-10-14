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
import { DefaultLoadingManager, EventDispatcher, Geometry, Vector3, Face3, Mesh, Color } from 'three'

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
    /**
    * 相比Geometry，BufferGeometry 会缓存网格模型，性能要高效点。网格模型生成原理

    1、Geometry 生成的模型是这样的 （代码）-> (CUP 进行数据处理，转化成虚拟3D数据) -> (GPU 进行数据组装，转化成像素点，准备渲染) -> 显示器
    第二次操作时重复走这些流程。

    2、BufferGeometry 生成模型流程 (代码) -> (CUP 进行数据处理，转化成虚拟3D数据) -> (GPU 进行数据组装，转化成像素点，准备渲染) -> (丢入缓存区) -> 显示器
    第二次修改时，通过API直接修改缓存区数据，流程就变成了这样
    (代码) -> (CUP 进行数据处理，转化成虚拟3D数据) -> (修改缓存区数据) -> 显示器
    * @type {Geometry}
    */
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
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();

    console.log(geometry);
    return geometry;
    // geometry.toJSON()

  }

} );
export { SurfLoader };
