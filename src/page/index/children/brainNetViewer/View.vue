<template>
  <el-container direction="horizontal">
    <div id="WebGL-output">
    </div>
    <div id="Info-output">
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
        },
        methods: {
            setOutputWindowSize() {
                document.getElementById('main').style.padding = '0px';

            },
            init() {
                const scene = this.scene;
                const outputWidth = document.getElementById('main').clientWidth * 0.8;
                const outputHeight = window.innerHeight;
                const camera = new THREE.PerspectiveCamera(45, outputWidth / outputHeight, 0.1, 1000);
                const webGLRenderer = new THREE.WebGLRenderer();
                const spotLight = new THREE.SpotLight(0xffffff);
                // const surfloader = new SurfLoader();
                const nodeloader = new NodeLoader();
                const edgeloader = new EdgeLoader();
                webGLRenderer.setClearColor(new THREE.Color(0xffffff));
                webGLRenderer.setSize(outputWidth, outputHeight);
                webGLRenderer.shadowMapEnabled = true;

                // position and point the camera to the center of the scene
                camera.position.x = 200;
                camera.position.y = 0;
                camera.position.z = 0;
                camera.lookAt(new THREE.Vector3(0, 0, 0));

                // add spotlight for the shadows
                spotLight.position.set(200, 0, 0);
                scene.add(spotLight);

                // add the output of the renderer to the html element
                document.getElementById('WebGL-output').appendChild(webGLRenderer.domElement);

                const controls = new TrackballControls(camera, webGLRenderer.domElement);
                controls.rotateSpeed = 6.0;

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
                    var mat = new THREE.MeshLambertMaterial({
                        color: parseInt(surfMaterial.color.replace('#','0x'),16),
                        side: THREE.DoubleSide,
                        opacity: surfMaterial.opacity,
                        transparent: true,
                        vertexColors: THREE.VertexColors
                    });

                    var mesh = new THREE.Mesh(geometry, mat);
                    mesh.name = 'surface';
                    scene.add(mesh);
                } );
                delete this.bnOption.allDATA['surfDATA'];
            },
            loadnode: function(){
                const nodeloader = new NodeLoader();
                const scene = this.scene;
                var oldObject = scene.getObjectByName('node');
                if (oldObject instanceof THREE.Group) scene.remove(oldObject);
                oldObject = scene.getObjectByName('edge');
                if (oldObject instanceof THREE.Group) scene.remove(oldObject);
                nodeloader.load( this.bnOption.allDATA['nodeDATA'], function ( ObjectVertex, ObjectColorId, ObjectRadius, ObjectLabel ) {
                    var group = new THREE.Group();
                    group.name = 'node';
                    var matlabColor = new Array(8);
                    matlabColor[0] = 0xFFFF00;  //yellow
                    matlabColor[1] = 0xFF00FF;  //magenta
                    matlabColor[2] = 0x00FFFF;  //cyan
                    matlabColor[3] = 0xFF0000;  //red
                    matlabColor[4] = 0x90EE90;  //green
                    matlabColor[5] = 0x87CEFA;  //blue
                    matlabColor[6] = 0x000000;  //white
                    matlabColor[7] = 0xFFFFFF;  //black
                    ObjectVertex.forEach(function (vertex, index) {
                        //设置球体的值
                        var radius = ObjectRadius[ index ];//, segemnt = 16, rings = 16;
                        var sphereMaterial = new THREE.MeshLambertMaterial({ color: matlabColor[ ObjectColorId[ index ] ] });
                        var sphere = new THREE.Mesh(
                            new THREE.SphereGeometry(radius),//,segemnt,rings),
                            sphereMaterial
                        );
                        sphere.position.copy( vertex );
                        sphere.name = ObjectLabel[ index ];
                        group.add(sphere);
                    });
                    scene.add(group);
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
                    // console.log( '[' + i + '][' + j + ']: ' + weight);
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
                    // console.log( positions );
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
                console.log(group);
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
            window.addEventListener('resize', this.getWindowWidth);
            this.init();
        }
    }
</script>

<style scoped>
</style>
