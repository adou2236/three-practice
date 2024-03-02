<template>
    <span>摄像机</span>
    <div style="width: 600px; height: 600px; position: relative">
        <!--    默认画布长300,宽150-->
        <canvas id="c"></canvas>
        <div class="split">
            <div id="view1" tabindex="1"></div>
            <div id="view2" tabindex="2"></div>
        </div>
        <div class="split" style="bottom: 0; top: unset">
            <div id="view3" tabindex="1"></div>
            <div id="view4" tabindex="2"></div>
        </div>
    </div>

</template>


<script lang="ts" setup>
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {onMounted} from "vue";

onMounted(() => {
    main()
})
function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    // 设置相机
    const fov = 45;
    const aspect = 2;  // canvas 的默认宽高 300:150
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);


    const camera2 = new THREE.PerspectiveCamera(
        60,  // fov
        2,   // aspect
        0.1, // near
        500, // far
    );
    camera2.position.set(40, 10, 30);
    camera2.lookAt(0, 5, 0);

    const camera3 = new THREE.OrthographicCamera(-1, 1, 1, -1, 5, 50);
    camera3.position.set(0, 10, 20);
    camera3.zoom = 0.2;

    const camera4 = new THREE.PerspectiveCamera(
        60,  // fov
        2,   // aspect
        0.1, // near
        500, // far
    );
    camera4.position.set(40, 10, 30);
    camera4.lookAt(0, 5, 0);




    const cameraHelper = new THREE.CameraHelper(camera); // 摄像机助手
    const cameraHelper2 = new THREE.CameraHelper(camera3); // 摄像机助手

    const view1Elem = document.querySelector('#view1');
    const view2Elem = document.querySelector('#view2');
    const view3Elem = document.querySelector('#view3');
    const view4Elem = document.querySelector('#view4');

    // 添加场景
    const scene = new THREE.Scene();
    scene.add(cameraHelper);
    scene.add(cameraHelper2);


    // const controls = new OrbitControls(camera, canvas);
    const controls = new OrbitControls(camera, view1Elem);
    controls.target.set(0, 5, 0);
    controls.update();


    const controls2 = new OrbitControls(camera2, view2Elem);
    controls2.target.set(0, 5, 0);
    controls2.update();

    const controls3 = new OrbitControls(camera3, view3Elem);
    controls3.target.set(0, 5, 0);
    controls3.update();

    const controls4 = new OrbitControls(camera4, view4Elem);
    controls4.target.set(0, 5, 0);
    controls4.update();


    const loader = new THREE.TextureLoader();
    const planeSize = 40;
    const texture = loader.load('src/assets/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);





    const cubeSize = 4;
    // 设置一个几何体形状
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshPhongMaterial({color: '#8AC'})
    // 通过形状与材质创建一个方块（网格）
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize / 2, 0);
    scene.add(cube);


    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphere);

    const color = 0xFFFFFF;
    const intensity = 2;
    const ambientLight = new THREE.AmbientLight(color, intensity); // 环境光，不会产生阴影，提升亮度用，分布均匀
    scene.add(ambientLight);


    class MinMaxGUIHelper {
        constructor(obj, minProp, maxProp, minDif) {
            this.obj = obj;
            this.minProp = minProp;
            this.maxProp = maxProp;
            this.minDif = minDif;
        }
        get min() {
            return this.obj[this.minProp];
        }
        set min(v) {
            this.obj[this.minProp] = v;
            this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
        }
        get max() {
            return this.obj[this.maxProp];
        }
        set max(v) {
            this.obj[this.maxProp] = v;
            this.min = this.min;  // 这将调用min的setter
        }
    }



    const gui = new GUI();

    gui.add(camera, 'fov', 1, 180);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near');
    gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far');

    // gui.add(camera2, 'zoom', 0.01, 1, 0.01).listen();
    // const minMaxGUIHelper2 = new MinMaxGUIHelper(camera2, 'near', 'far', 0.1);
    // gui.add(minMaxGUIHelper2, 'min', 0.1, 50, 0.1).name('near');
    // gui.add(minMaxGUIHelper2, 'max', 0.1, 50, 0.1).name('far');


    function setScissorForElement(elem) {
        const canvasRect = canvas.getBoundingClientRect();
        const elemRect = elem.getBoundingClientRect();

        // 计算canvas的尺寸
        const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
        const left = Math.max(0, elemRect.left - canvasRect.left);
        const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
        const top = Math.max(0, elemRect.top - canvasRect.top);

        const width = Math.min(canvasRect.width, right - left);
        const height = Math.min(canvasRect.height, bottom - top);

        // 设置剪函数以仅渲染一部分场景
        const positiveYUpBottom = canvasRect.height - bottom;
        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);

        // 返回aspect
        return width / height;
    }
    function resizeRendererToDisplaySize( renderer ) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if ( needResize ) {
            renderer.setSize( width, height, false );
        }

        return needResize;
    }

    function render(time) {

        resizeRendererToDisplaySize(renderer);

        // 启用剪刀函数
        renderer.setScissorTest(true);

        // 渲染主视野
        {
            const aspect = setScissorForElement(view1Elem);

            // 用计算出的aspect修改摄像机参数
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
            cameraHelper.update();

            // 来原视野中不要绘制cameraHelper
            cameraHelper.visible = false;

            scene.background = 0x000000;

            // 渲染
            renderer.render(scene, camera);
        }

        // 渲染第二台摄像机
        {
            const aspect = setScissorForElement(view2Elem);

            // 调整aspect
            camera2.aspect = aspect;
            camera2.updateProjectionMatrix();

            // 在第二台摄像机中绘制cameraHelper
            cameraHelper.visible = true;

            scene.background = 0x000040;

            renderer.render(scene, camera2);
        }

        // 正交摄像机
        {
            const aspect = setScissorForElement(view3Elem);

            // 用计算出的aspect修改摄像机参数
            camera3.left   = -aspect;
            camera3.right  =  aspect;
            camera3.updateProjectionMatrix();
            cameraHelper2.update();

            // 来原视野中不要绘制cameraHelper
            cameraHelper2.visible = false;

            scene.background = 0x000000;

            // 渲染
            renderer.render(scene, camera3);
        }
        {
            const aspect = setScissorForElement(view4Elem);

            // 调整aspect
            camera4.aspect = aspect;
            camera4.updateProjectionMatrix();

            // 在第二台摄像机中绘制cameraHelper
            cameraHelper2.visible = true;

            scene.background = 0x000040;

            renderer.render(scene, camera4);
        }

        requestAnimationFrame( render );
    }
    // 通过不间断的动画进行渲染，requestAnimationFrame动画默认回调次数与刷新率一致
    requestAnimationFrame(render);
}


</script>



<style scoped>
#c{
    background: #181818;
    width: 600px;
    height: 600px;
}

.split {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 50%;
    display: flex;
}
.split>div {
    width: 100%;
    height: 100%;
}

</style>
