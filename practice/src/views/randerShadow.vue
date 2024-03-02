<template>
    <h1>投射阴影</h1>
    <!--    默认画布长300,宽150-->
    <canvas id="c"></canvas>
</template>


<script lang="ts" setup>
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js';
import {onMounted} from "vue";

onMounted(() => {
    main()
})
function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    renderer.shadowMap.enabled = true;
    RectAreaLightUniformsLib.init();

    // 设置相机
    const fov = 45;
    const aspect = 2;  // canvas 的默认宽高 300:150
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);



    // 添加场景
    const scene = new THREE.Scene();

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();


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
    mesh.receiveShadow = true;
    scene.add(mesh);





    const cubeSize = 4;
    // 设置一个几何体形状
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshPhongMaterial({color: '#8AC'})
    // 通过形状与材质创建一个方块（网格）
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize / 2, 0);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);

    // 通过形状与材质创建一个方块（网格）
    const cubeMaterial2 = new THREE.MeshStandardMaterial({color: '#8AC'})
    const cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial2);
    cube2.position.set(cubeSize + 8, cubeSize / 2, 0);
    cube2.castShadow = true;
    cube2.receiveShadow = true;
    scene.add(cube2);



    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);

    const sphereMat2 = new THREE.MeshStandardMaterial({color: '#CA8', shininess: 1000, metalness: 1});
    const sphere2 = new THREE.Mesh(sphereGeo, sphereMat2);
    sphere2.position.set(-sphereRadius - 8, sphereRadius + 2, 0);
    sphere2.castShadow = true;
    sphere2.receiveShadow = true;
    scene.add(sphere2);


    const directColor = 0xFFFFFF;
    const intensity3 = 3;
    const directionalLight = new THREE.DirectionalLight(directColor, intensity3); // 方向光，由一个平面发出的平行线
    directionalLight.position.set(0, 10, 0);
    directionalLight.target.position.set(-5, 0, 0);
    directionalLight.shadow.camera.left = 10
    directionalLight.shadow.camera.right = -10
    directionalLight.shadow.camera.top = 10
    directionalLight.shadow.camera.bottom = -10
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    scene.add(directionalLight.target);







    const helper = new THREE.DirectionalLightHelper(directionalLight); // 方向光助手，可视化
    helper.visible = false



    scene.add(helper);

    function makeFolder(name, value = false, parent){
        const folder = parent.addFolder(name);
        folder.open(value);
        return folder
    }

    function makeXYZGUI(gui, vector3, name, onChangeFn, defaultOpen) {
        const folder = makeFolder(name, defaultOpen, gui)
        folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
        folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
        folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
        return folder
    }

    function updateLight() {
        directionalLight.target.updateMatrixWorld();
        helper.update();
    }

    class ColorGUIHelper {
        constructor(object, prop) {
            this.object = object;
            this.prop = prop;
        }
        get value() {
            return `#${this.object[this.prop].getHexString()}`;
        }
        set value(hexString) {
            this.object[this.prop].set(hexString);
        }
    }


    const gui = new GUI();

    const folder2 = makeFolder('方向光', false, gui)
    folder2.add(helper, 'visible').name('方向光助手')
    folder2.addColor(new ColorGUIHelper(directionalLight, 'color'), 'value').name('方向光颜色');
    folder2.add(directionalLight, 'intensity', 0, 2, 0.01).name('方向光亮度');
    folder2.add(directionalLight.target.position, 'x', -10, 10).name('方向光x');
    folder2.add(directionalLight.target.position, 'z', -10, 10).name('方向光y');
    folder2.add(directionalLight.target.position, 'y', -10, 10).name('方向光z');
    makeXYZGUI(folder2, directionalLight.position, '方向光位置', updateLight, false)
    makeXYZGUI(folder2, directionalLight.target.position, '方向光目标', updateLight, false)


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

        if ( resizeRendererToDisplaySize( renderer ) ) {

            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();

        }

        renderer.render( scene, camera );

        requestAnimationFrame( render );
    }
    // 通过不间断的动画进行渲染，requestAnimationFrame动画默认回调次数与刷新率一致
    requestAnimationFrame(render);
    // render()
    // requestAnimationFrame(render);
}


</script>



<style scoped>
#c{
    background: #181818;
    width: 600px;
    height: 300px;
}

</style>
