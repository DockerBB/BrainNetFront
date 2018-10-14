<template>
  <el-container direction="horizontal">
    <div id="WebGL-output">
    </div>
    <div id="Info-output" style="background-color: #3a8ee6; width: 100%;">
      <p>11111</p>
    </div>
  </el-container>
</template>
<script>
    /* eslint-disable */
    import * as THREE from 'three'
    import { SurfLoader } from '@/utils/SurfLoader'
    import { DragControls } from '@/utils/DragControls'
    import { TrackballControls } from '@/utils/TrackballControls'
    import { NodeLoader } from '@/utils/NodeLoader'
    import { EdgeLoader } from '@/utils/EdgeLoader'
    import * as MeshLine from '@/utils/MeshLine'
    export default {
        name: 'bn-view',
        data(){
            return {
                scene: new THREE.Scene(),
                webGLRenderer: null,
                camera: null,
                controls: null,
                outputWidth: document.getElementById('main').clientWidth,
                outputHeight: window.innerHeight,
                bnOption: this.$store.state.bnOption
            }
        },
        watch: {
            'bnOption.flag': function () {
                if (this.bnOption.flag) {
                    if (this.bnOption.allDATA['surfDATA'] != null) this.loadsurf();
                    if (this.bnOption.allDATA['nodeDATA'] != null) this.loadnode();
                    if (this.bnOption.allDATA['edgeDATA'] != null) this.loadedge();
                    if (this.bnOption.NIFTIModel != null) this.loadnifti();
                }
                this.bnOption.flag = false;
            },
            'bnOption.allMaterial.surfMaterial.color' : function () {
                var surfMesh = this.scene.getObjectByName('surface');
                if (surfMesh instanceof THREE.Mesh) surfMesh.material.color =
                    new THREE.Color( parseInt(this.bnOption.allMaterial.surfMaterial.color.replace('#','0x'),16) );
            },
            'bnOption.allMaterial.surfMaterial.opacity' : function () {
                var surfMesh = this.scene.getObjectByName('surface');
                if (surfMesh) surfMesh.material.opacity = this.bnOption.allMaterial.surfMaterial.opacity;
            },
            'bnOption.allMaterial.surfMaterial.clip' : function () {
                var surfMesh = this.scene.getObjectByName('surface');
                if (surfMesh) {
                    var enable = this.bnOption.allMaterial.surfMaterial.clip;
                    var clipArr = [];
                    if (enable) clipArr = [
                        new THREE.Plane(new THREE.Vector3(1, 0, 0), -2.0)
                    ];
                    this.webGLRenderer.localClippingEnabled = enable;
                    surfMesh.material.setValues( {
                        clippingPlanes: clipArr
                    } );
                }
            },
        },
        methods: {
            onOutputWindowResize() {
                document.getElementById('main').style.padding = '0px';
                // 获取宽高
                this.outputWidth = document.getElementById('main').clientWidth;
                this.outputHeight = window.innerHeight;
                // 设置渲染器宽高
                if (this.webGLRenderer) {
                    this.webGLRenderer.setSize(this.outputWidth * 0.8, this.outputHeight);
                    // 设置相机视锥体宽高比
                    this.camera.aspect = this.outputWidth * 0.8 / this.outputHeight;
                    // 更新相机投影矩阵
                    this.camera.updateProjectionMatrix();
                    // 设置Info-output宽高
                    document.getElementById('Info-output').style.height = window.innerHeight;
                }
            },
            init() {
                const scene = this.scene;
                const WebGLWidth = this.outputWidth * 0.8;
                const WebGLHeight = this.outputHeight;
                const camera = this.camera = new THREE.PerspectiveCamera(45, WebGLWidth / WebGLHeight, 0.1, 1000);
                const webGLRenderer = this.webGLRenderer = new THREE.WebGLRenderer();
                const spotLight = new THREE.SpotLight(0xffffff);
                webGLRenderer.setClearColor(new THREE.Color(0xffffff));
                webGLRenderer.setSize(WebGLWidth, WebGLHeight);
                // webGLRenderer.shadowMapEnabled = true;
                // webGLRenderer.localClippingEnabled = true;

                // position and point the camera to the center of the scene
                camera.position.x = 200;
                camera.position.y = 0;
                camera.position.z = 0;
                camera.lookAt(new THREE.Vector3(0, 0, 0));

                // add spotlight for the shadows
                spotLight.position.copy(camera.position);
                scene.add(spotLight);

                // add the output of the renderer to the html element
                document.getElementById('WebGL-output').appendChild(webGLRenderer.domElement);

                const controls = new TrackballControls(camera, webGLRenderer.domElement);
                controls.rotateSpeed = 6.0;
                this.controls = controls;

                function animate() {
                    webGLRenderer.clear();
                    controls.update();
                    spotLight.position.copy(camera.position);
                    requestAnimationFrame(animate);
                    webGLRenderer.render(scene, camera);
                }
                animate();
            },
            loadsurf: function(){
                const surfloader = new SurfLoader();
                const scene = this.scene;
                const surfMaterial = this.bnOption.allMaterial.surfMaterial;
                var oldObject = scene.getObjectByName('surface');
                if (oldObject instanceof THREE.Mesh) scene.remove(oldObject);
                surfloader.load( this.bnOption.allDATA['surfDATA'], function (geometry) {
                    // var plane = THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
                    var mat = new THREE.MeshLambertMaterial({
                        color: parseInt(surfMaterial.color.replace('#','0x'),16),
                        side: THREE.DoubleSide,
                        opacity: surfMaterial.opacity,
                        transparent: true,
                        vertexColors: THREE.VertexColors,
                        // clippingPlanes: [ new THREE.Plane( new THREE.Vector3(1, 0, 0), 0.8 ) ],
                        // clipShadows: true
                    });

                    var mesh = new THREE.Mesh(geometry, mat);
                    // mesh.castShadow = true;
                    mesh.name = 'surface';
                    scene.add(mesh);
                    var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0 });
                    var sphere = new THREE.Mesh(
                        new THREE.SphereGeometry(1.0),
                        sphereMaterial
                    );
                    sphere.position.set(1,0,0);
                    scene.add(sphere);
                } );
                delete this.bnOption.allDATA['surfDATA'];
            },
            loadnode: function(){
                const nodeloader = new NodeLoader();
                const scene = this.scene;
                const controls = this.controls;
                var oldObject = scene.getObjectByName('node');
                if (oldObject instanceof THREE.Group) scene.remove(oldObject);
                oldObject = scene.getObjectByName('edge');
                if (oldObject instanceof THREE.Group) scene.remove(oldObject);

                var matlabColor = [
                    0xFFFF00,  //yellow
                    0xFF00FF,  //magenta
                    0x00FFFF,  //cyan
                    0xFF0000,  //red
                    0x90EE90,  //green
                    0x87CEFA,  //blue
                    0x000000,  //white
                    0xFFFFFF  //black
                ];
                nodeloader.load( this.bnOption.allDATA['nodeDATA'], function ( Object, ObjectRadius, ObjectColorId ) {
                    var group = new THREE.Group();
                    group.name = 'node';
                    Object.forEach(function (mesh, index) {
                        mesh.material.color.set( matlabColor[ ObjectColorId[ index ] ] );
                        var radius = ObjectRadius[index] + 0.1;
                        mesh.scale.set(radius, radius, radius);
                        group.add(mesh);
                    });
                    scene.add(group);
                    controls.setObjects( Object );
                });
                delete this.bnOption.allDATA['nodeDATA'];
            },
            loadedge: function(){
                const edgeloader = new EdgeLoader();
                const scene = this.scene;
                var oldObject = scene.getObjectByName('edge');
                if (oldObject instanceof THREE.Group) scene.remove(oldObject);
                var nodeObjects = scene.getObjectByName('node').children;
                var group = new THREE.Group();
                group.name = 'edge';
                edgeloader.load( this.bnOption.allDATA['edgeDATA'], function ( i, j, weight ) {
                    var positions = [];
                    positions.push(
                        nodeObjects[ i ].position.x,
                        nodeObjects[ i ].position.y,
                        nodeObjects[ i ].position.z );
                    positions.push(
                        nodeObjects[ j ].position.x,
                        nodeObjects[ j ].position.y,
                        nodeObjects[ j ].position.z );
                    var geometry = new MeshLine.LineGeometry();
                    geometry.setPositions( positions );
                    var matLine = new MeshLine.LineMaterial( {
                        color: 0xFF0000,
                        linewidth: 0.005 * weight, // in pixels
                        // vertexColors: THREE.VertexColors,
                        //resolution:  // to be set by renderer, eventually
                        dashed: false
                    } );
                    var line = new MeshLine.Line2( geometry, matLine );
                    // line.computeLineDistances();
                    // line.scale.set( 1, 1, 1 );
                    group.add( line );
                } );
                scene.add( group );
                delete this.bnOption.allDATA['edgeDATA'];
            },
            loadnifti: function(){
                var surfObject = this.scene.getObjectByName('surface');
                if ( surfObject == null ) return;
                var hdr = this.bnOption.NIFTIModel.niftiHeader;
                var bound = hdr.dims;
                var offset = [];
                var img = this.bnOption.NIFTIModel.niftiImage;
                offset[0] = 0;
                offset[1] = hdr.affine[0][3];
                offset[2] = hdr.affine[1][3];
                offset[3] = hdr.affine[2][3];
                function affineToValue( v ){
                    var x = Math.round( v.x - offset[1] );
                    var y = Math.round( v.y - offset[2] );
                    var z = Math.round( v.z - offset[3] );
                    if (x > bound[1]) x = bound[1];
                    if (y > bound[2]) y = bound[2];
                    if (z > bound[3]) z = bound[3];
                    if (x < 0) x = 0;
                    if (y < 0) y = 0;
                    if (z < 0) z = 0;
                    var alpha = img[((((z * bound[2]) + y) * bound[1]) + x)] / 116;
                    return Math.round(alpha * 0xffffff);
                }
                for (let face of surfObject.geometry.faces){
                    var color = [];
                    var av = affineToValue( surfObject.geometry.vertices[face.a] );
                    var bv = affineToValue( surfObject.geometry.vertices[face.b] );
                    var cv = affineToValue( surfObject.geometry.vertices[face.c] );
                    if ( av + bv + cv != 0) {
                        color[0] = new THREE.Color(av);
                        color[1] = new THREE.Color(bv);
                        color[2] = new THREE.Color(cv);
                        face.vertexColors = color;
                    }
                }
                surfObject.geometry.elementsNeedUpdate = true;// 一次性通知需要更新
            },
        },
        mounted() {
            this.onOutputWindowResize();
            window.addEventListener('resize', this.onOutputWindowResize);
            this.init();
        }
    }
</script>

<style scoped>
</style>
