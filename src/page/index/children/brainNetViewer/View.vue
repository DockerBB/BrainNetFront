<template>
  <el-container direction="horizontal">
    <div id="WebGL-output">
    </div>
    <!--<div id="Info-output" style="background-color: #3a8ee6; width: 100%;">-->
    <div id="Info-output" style="width: 100%;">
      <el-button style="width: 100%;text-align: left" @click="viewDirection('front')">front hemishpere</el-button>
      <br/>
      <el-button style="width: 100%;text-align: left" @click="viewDirection('back')">back hemishpere</el-button>
      <br/>
      <el-button style="width: 100%;text-align: left" @click="viewDirection('left')">left hemishpere</el-button>
      <br/>
      <el-button style="width: 100%;text-align: left" @click="viewDirection('right')">right hemishpere</el-button>
      <br/>
      <el-button style="width: 100%;text-align: left" @click="viewDirection('top')">top hemishpere</el-button>
      <br/>
      <el-button style="width: 100%;text-align: left" @click="viewDirection('bottom')">bottom hemishpere</el-button>
      <br/>
      <el-button style="width: 100%;text-align: left" @click="photo">create view</el-button>
    </div>
    <el-dialog title="photo panel" :visible.sync="photoVisible" :modal-append-to-body="false">
      <div id="photo"></div>
    </el-dialog>
  </el-container>
</template>
<script>
    /* eslint-disable */
    import * as THREE from 'three'
    import * as d3 from 'd3'
    import { SurfLoader } from '@/utils/SurfLoader'
    import { DragControls } from '@/utils/DragControls'
    import { TrackballControls } from '@/utils/TrackballControls'
    import { NodeLoader } from '@/utils/NodeLoader'
    import { EdgeLoader } from '@/utils/EdgeLoader'
    import cache from '@/utils/cache'
    import * as MeshLine from '@/utils/MeshLine'
    export default {
        name: 'bn-view',
        data(){
            return {
                surfCenter: new THREE.Vector3(0,0,0),
                photoVisible: false,
                photoList: [],
                scene: new THREE.Scene(),
                webGLRenderer: null,
                camera: null,
                controls: null,
                outputWidth: null,
                outputHeight: null,
                bnOption: this.$store.state.bnOption
            }
        },
        watch: {
            '$route':function (to, from) {
                console.log('route')
                window.removeEventListener('resize', this.onOutputWindowResize, false);
            },
            'bnOption.sflag': function () {
                if (this.bnOption.sflag){
                    try {
                        if (this.bnOption.allDATA['surfDATA'] != null) this.loadsurf();
                        if (this.bnOption.allDATA['nodeDATA'] != null) this.loadnode();
                        if (this.bnOption.allDATA['edgeDATA'] != null) this.loadedge();
                        if (this.bnOption.NIFTIModel != null) this.loadnifti();
                        this.$message.success('绘制曲面完成');
                    } catch (err) {
                        this.$message.error(err);
                    }
                    this.bnOption.sflag = false;
                }
            },
            'bnOption.allMaterial.surfMaterial.color' : function () {
                let surfMesh = this.scene.getObjectByName('surface');
                if (surfMesh instanceof THREE.Mesh) surfMesh.material.color =
                    new THREE.Color( parseInt(this.bnOption.allMaterial.surfMaterial.color.replace('#','0x'),16) );
            },
            'bnOption.allMaterial.surfMaterial.opacity' : function () {
                let surfMesh = this.scene.getObjectByName('surface');
                if (surfMesh) surfMesh.material.opacity = this.bnOption.allMaterial.surfMaterial.opacity;
            },
            'bnOption.allMaterial.surfMaterial.clip' : function () {
                let surfMesh = this.scene.getObjectByName('surface');
                let enable = this.bnOption.allMaterial.surfMaterial.clip;
                let offset = this.bnOption.allMaterial.surfMaterial.clipOffset;
                if (surfMesh) {
                    let clipArr = [];
                    if (enable) clipArr = [
                        new THREE.Plane(new THREE.Vector3(-1, 0, 0),-offset[0]),
                        new THREE.Plane(new THREE.Vector3(1, 0, 0),offset[1])
                    ];
                    this.webGLRenderer.localClippingEnabled = enable;
                    surfMesh.material.setValues( {
                        clippingPlanes: clipArr
                    } );
                }
            },
            'bnOption.allMaterial.surfMaterial.clipOffset' : function () {
                let surfMesh = this.scene.getObjectByName('surface');
                let enable = this.bnOption.allMaterial.surfMaterial.clip;
                let offset = this.bnOption.allMaterial.surfMaterial.clipOffset;
                if (surfMesh&&enable) {
                    let clipArr = [];
                    if (enable) clipArr = [
                        new THREE.Plane(new THREE.Vector3(-1, 0, 0),-offset[0]),
                        new THREE.Plane(new THREE.Vector3(1, 0, 0),offset[1])
                    ];
                    this.webGLRenderer.localClippingEnabled = enable;
                    surfMesh.material.setValues( {
                        clippingPlanes: clipArr
                    } );
                }
            },
            'bnOption.lflag' : function () {
                if (this.bnOption.lflag) {
                    let edge = this.scene.getObjectByName('edge');
                    let lineWidth = this.bnOption.allMaterial.lineMaterial.lineWidth;
                    this.drawMatrix(lineWidth[0], lineWidth[1]);
                }
                this.bnOption.lflag = false;
            },
            'surfCenter': function () {
                console.log(this.surfCenter)
                let temp = this.controls.target.copy(this.surfCenter)
                if (Math.abs(temp.x) > 10) temp.x = 0
                this.controls.target.copy(temp)
            }
        },
        methods: {
            onOutputWindowResize() {
                // document.getElementById('main').style.padding = '0px';
                // 获取宽高
                if (document.getElementById('Info-output')===null) return
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
                const webGLRenderer = this.webGLRenderer = new THREE.WebGLRenderer({
                    preserveDrawingBuffer: true,   // required to support .toDataURL()
                    opacity: 0.5
                });
                const spotLight = new THREE.SpotLight(0xffffff);
                webGLRenderer.setClearColor(new THREE.Color(0xffffff));
                webGLRenderer.setSize(WebGLWidth, WebGLHeight);
                // webGLRenderer.shadowMapEnabled = true;
                // webGLRenderer.localClippingEnabled = true;

                // position and point the camera to the center of the scene
                camera.position.set(0, 250, 0);
                camera.up.set(0, 0, 1);         // camera.up 默认为(0, 1, 0)
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
            removeObject: function( oldObject ){
                if (oldObject instanceof THREE.Mesh) {
                    this.scene.remove(oldObject);
                    oldObject.material.dispose();
                    oldObject.geometry.dispose();
                    return;
                }
                if (oldObject instanceof THREE.Group) {
                    this.scene.remove(oldObject);
                    oldObject.children.forEach(this.removeObject);
                    return;
                }
            },
            loadsurf: function(){
                const camera = this.camera;
                const surfloader = new SurfLoader();
                const scene = this.scene;
                const surfMaterial = this.bnOption.allMaterial.surfMaterial;
                const self = this
                this.removeObject(scene.getObjectByName('surface'));
                surfloader.load( this.bnOption.allDATA['surfDATA'], function (geometry) {
                    geometry.computeBoundingSphere();
                    self.surfCenter = geometry.boundingSphere.center
                    camera.lookAt(self.surfCenter)
                    // geometry.center() // 中心化
                    // geometry.translate(center.x, center.y, center.z)
                    let mat = new THREE.MeshLambertMaterial({
                        color: parseInt(surfMaterial.color.replace('#','0x'),16),
                        side: THREE.DoubleSide,
                        opacity: surfMaterial.opacity,
                        transparent: true,
                        vertexColors: THREE.VertexColors
                    });

                    let mesh = new THREE.Mesh(geometry, mat);
                    // mesh.castShadow = true;
                    mesh.name = 'surface';
                    scene.add(mesh);
                } );
                // this.controls.noPan = true;
                delete this.bnOption.allDATA['surfDATA'];
                this.bnOption.allMaterial.surfMaterial.clip = false
            },
            loadnode: function(){
                const nodeloader = new NodeLoader();
                const scene = this.scene;
                const controls = this.controls;
                this.removeObject(scene.getObjectByName('node'));
                this.removeObject(scene.getObjectByName('edge'));

                let matlabColor = [
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
                    let group = new THREE.Group();
                    group.name = 'node';
                    Object.forEach(function (mesh, index) {
                        mesh.material.color.set( matlabColor[ ObjectColorId[ index ] ] );
                        let radius = ObjectRadius[index] + 0.1;
                        mesh.scale.set(radius, radius, radius);
                        mesh.code = ObjectColorId;
                        group.add(mesh);
                    });
                    scene.add(group);
                    controls.setObjects( Object );
                });
                delete this.bnOption.allDATA['nodeDATA'];
            },
            loadedge: function(){
                const edgeloader = new EdgeLoader();
                const lineMaterial = this.bnOption.allMaterial.lineMaterial;
                let Alist = edgeloader.loadAList(this.bnOption.allDATA['edgeDATA']);
                cache.setLocal('edgeAlist', Alist.list);
                lineMaterial.minWeight = Alist.min;
                lineMaterial.maxWeight = Alist.max;
                lineMaterial.lineWidth = [Alist.max - (Alist.max - Alist.min) / 10, Alist.max, Alist.list];
                this.bnOption.lflag = true;
                delete this.bnOption.allDATA['edgeDATA'];
            },
            drawMatrix:  function ( lowWeight, heightWeight, alist ) {
                const scene = this.scene;
                const color = this.bnOption.allMaterial.lineMaterial.color;
                const size = this.bnOption.allMaterial.lineMaterial.size;
                this.removeObject(scene.getObjectByName('edge'));
                let nodeObjects = scene.getObjectByName('node');
                if (nodeObjects === undefined || nodeObjects.children.length === 0) throw '还未添加node';
                nodeObjects = nodeObjects.children;
                if ( alist === undefined ) alist = JSON.parse(cache.getLocal('edgeAlist'));
                if ( !alist ) throw '添加的矩阵已失效';
                let group = new THREE.Group();
                group.name = 'edge';
                scene.add( group );

                alist.forEach(v=>{
                    let i = v[0], j = v[1], weight = v[2];
                    if ( weight < lowWeight || weight > heightWeight ) return;
                    let positions = [];
                    positions.push(
                        nodeObjects[ i ].position.x,
                        nodeObjects[ i ].position.y,
                        nodeObjects[ i ].position.z );
                    positions.push(
                        nodeObjects[ j ].position.x,
                        nodeObjects[ j ].position.y,
                        nodeObjects[ j ].position.z );
                    let geometry = new MeshLine.LineGeometry();
                    geometry.setPositions( positions );
                    let matLine = new MeshLine.LineMaterial( {
                        color: parseInt(color.replace('#','0x'),16),
                        linewidth: 0.005 * weight * size, // in pixels
                        // vertexColors: THREE.VertexColors,
                        //resolution:  // to be set by renderer, eventually
                        dashed: false
                    } );
                    let line = new MeshLine.Line2( geometry, matLine );
                    // line.computeLineDistances();
                    // line.scale.set( 1, 1, 1 );
                    group.add( line );
                });
            },
            loadnifti: function(){
                let a = d3.rgb(0,0,255),	//蓝色
                    b = d3.rgb(255,0,0);	//红色
                let color = d3.interpolateHslLong(b,a);
                let surfObject = this.scene.getObjectByName('surface');
                if ( surfObject == null ) return;
                let hdr = this.bnOption.NIFTIModel.niftiHeader;
                let bound = hdr.dims;
                let offset = [];
                let img = this.bnOption.NIFTIModel.niftiImage;
                offset[0] = 0;
                offset[1] = hdr.affine[0][3];
                offset[2] = hdr.affine[1][3];
                offset[3] = hdr.affine[2][3];
                function affineToValue( v ){
                    let x = Math.round( v.x - offset[1] );
                    let y = Math.round( v.y - offset[2] );
                    let z = Math.round( v.z - offset[3] );
                    if (x > bound[1]) x = bound[1];
                    if (y > bound[2]) y = bound[2];
                    if (z > bound[3]) z = bound[3];
                    if (x < 0) x = 0;
                    if (y < 0) y = 0;
                    if (z < 0) z = 0;
                    let roi = img[((((z * bound[2]) + y) * bound[1]) + x)]
                    return color(roi / 116)
                    // if ([64,55,78].indexOf(roi) > -1||roi > 90) return color(roi / 116)
                    // else return 0;
                }
                let vertexPosition = surfObject.geometry.attributes.position.array;
                let vertexColor = surfObject.geometry.attributes.color.array;
                let rgbValue;
                let colorRGB = new THREE.Color();
                for (let i = 0; i < vertexPosition.length; i+=3){
                    rgbValue = affineToValue( {
                        x:vertexPosition[i],
                        y:vertexPosition[i+1],
                        z:vertexPosition[i+2]
                    } );
                    if (rgbValue == 0) continue;
                    colorRGB.set(rgbValue);
                    vertexColor[i] = colorRGB.r;
                    vertexColor[i+1] = colorRGB.g;
                    vertexColor[i+2] = colorRGB.b;
                }
                surfObject.geometry.attributes.color.needsUpdate = true;
            },
            viewDirection: function (dLabel) {
                const camera = this.camera;
                if (dLabel === 'front') {
                    camera.position.set(0, 250, 0);
                    camera.up.set(0, 0, 1);         // camera.up 默认为(0, 1, 0)
                }else if (dLabel === 'back') {
                    camera.position.set(0, -250, 0);
                    camera.up.set(0, 0, 1);         // camera.up 默认为(0, 1, 0)
                }else if (dLabel === 'left') {
                    camera.position.set(-250, 0, 0);
                    camera.up.set(0, 0, 1);         // camera.up 默认为(0, 1, 0)
                }else if (dLabel === 'right') {
                    camera.position.set(250, 0, 0);
                    camera.up.set(0, 0, 1);         // camera.up 默认为(0, 1, 0)
                }else if (dLabel === 'top') {
                    camera.position.set(0, 0, 250);
                    camera.up.set(0, 1, 0);         // camera.up 默认为(0, 1, 0)
                }else if (dLabel === 'bottom') {
                    camera.position.set(0, 0, -250);
                    camera.up.set(0, 1, 0);         // camera.up 默认为(0, 1, 0)
                }
                camera.lookAt(new THREE.Vector3(0, 0, 0));
            },
            photo: function () {
                this.photoVisible = true
                this.photoList = []
                const self = this
                const camera = this.camera;
                const webGLRenderer = this.webGLRenderer;
                let size = Math.min(this.outputWidth,this.outputHeight)
                this.webGLRenderer.setSize(size, size);
                // 设置相机视锥体宽高比
                this.camera.aspect = 1;
                // 更新相机投影矩阵
                this.camera.updateProjectionMatrix();
                function f(dLabel) {
                    if (dLabel === 'front') {
                        camera.position.set(0, 250, 0);
                        camera.up.set(0, 0, 1);         // camera.up 默认为(0, 1, 0)
                    }else if (dLabel === 'back') {
                        camera.position.set(0, -250, 0);
                        camera.up.set(0, 0, 1);         // camera.up 默认为(0, 1, 0)
                    }else if (dLabel === 'left') {
                        camera.position.set(-250, 0, 0);
                        camera.up.set(0, 0, 1);         // camera.up 默认为(0, 1, 0)
                    }else if (dLabel === 'right') {
                        camera.position.set(250, 0, 0);
                        camera.up.set(0, 0, 1);         // camera.up 默认为(0, 1, 0)
                    }else if (dLabel === 'top') {
                        camera.position.set(0, 0, 250);
                        camera.up.set(0, 1, 0);         // camera.up 默认为(0, 1, 0)
                    }else if (dLabel === 'bottom') {
                        camera.position.set(0, 0, -250);
                        camera.up.set(0, 1, 0);         // camera.up 默认为(0, 1, 0)
                    }
                    setTimeout(()=>{
                        let img = document.createElement("img")
                        img.src = webGLRenderer.domElement.toDataURL("image/jpeg")
                        self.photoList.push(img.src)
                        img.width = 300
                        img.height = 300
                        document.getElementById("photo").appendChild(img)
                    },500)
                }
                setTimeout(()=>{
                    let arr = ['front','back','left','right','top','bottom']
                    for (let i = 1;i <=arr.length;i++) setTimeout(()=>f(arr[i-1]),i*1000)
                    setTimeout(()=>{
                        self.onOutputWindowResize()},arr.length*1000 + 1000)
                    },1000)
            }
        },
        mounted() {
            this.outputWidth = document.getElementById('main').clientWidth;
            this.outputHeight = window.innerHeight;
            window.addEventListener('resize', this.onOutputWindowResize, false);
            document.addEventListener('unload', this.saveState)
            this.init();
            this.onOutputWindowResize();
        }
    }
</script>

<style scoped>
</style>
