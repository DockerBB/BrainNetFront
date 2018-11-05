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
import { DefaultLoadingManager, EventDispatcher, MeshBasicMaterial, SphereBufferGeometry, Mesh } from 'three'

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
  },

  parse: function ( data, onLoad ) {

      var Object = [];
      var ObjectRadius = [];
      var ObjectColorId = [];
      var pattern, result;

      // float float float int float string

      pattern = /([\+|\-]?[\d]+\.?[\d|\-|e]*)[\s]+([\+|\-]?[\d]+\.?[\d|\-|e]*)[\s]+([\+|\-]?[\d]+\.?[\d|\-|e]*)[\s]+([\d]+)[\s]+([\d]+\.?[\d|\-|e]*)[\s]+([a-zA-Z]+[\.][LR])[\s]+/g;

      /**
       * 相比Geometry，BufferGeometry 会缓存网格模型，性能要高效点。网格模型生成原理

       1、Geometry 生成的模型是这样的 （代码）-> (CUP 进行数据处理，转化成虚拟3D数据) -> (GPU 进行数据组装，转化成像素点，准备渲染) -> 显示器
       第二次操作时重复走这些流程。

       2、BufferGeometry 生成模型流程 (代码) -> (CUP 进行数据处理，转化成虚拟3D数据) -> (GPU 进行数据组装，转化成像素点，准备渲染) -> (丢入缓存区) -> 显示器
       第二次修改时，通过API直接修改缓存区数据，流程就变成了这样
       (代码) -> (CUP 进行数据处理，转化成虚拟3D数据) -> (修改缓存区数据) -> 显示器
       * @type {Geometry}
       */
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
