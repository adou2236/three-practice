<template>
    <h1>光照</h1>
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
    scene.add(mesh);





    const cubeSize = 4;
    // 设置一个几何体形状
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshPhongMaterial({color: '#8AC'})
    // 通过形状与材质创建一个方块（网格）
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize / 2, 0);
    scene.add(cube);

    // 通过形状与材质创建一个方块（网格）
    const cubeMaterial2 = new THREE.MeshStandardMaterial({color: '#8AC'})
    const cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial2);
    cube2.position.set(cubeSize + 8, cubeSize / 2, 0);
    scene.add(cube2);



    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphere);

    const sphereMat2 = new THREE.MeshStandardMaterial({color: '#CA8', shininess: 1000, metalness: 1});
    const sphere2 = new THREE.Mesh(sphereGeo, sphereMat2);
    sphere2.position.set(-sphereRadius - 8, sphereRadius + 2, 0);
    scene.add(sphere2);

    const color = 0xFFFFFF;
    const intensity = 0;
    const ambientLight = new THREE.AmbientLight(color, intensity); // 环境光，不会产生阴影，提升亮度用，分布均匀
    scene.add(ambientLight);

    const skyColor = 0xB1E1FF;  // 天空颜色
    const groundColor = 0xB97A20;  // 地面颜色
    const intensity2 = 0;
    const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity2); // 半球光，下面与上面分别是连个颜色
    scene.add(hemisphereLight);


    const directColor = 0xFFFFFF;
    const intensity3 = 0;
    const directionalLight = new THREE.DirectionalLight(directColor, intensity3); // 方向光，由一个平面发出的平行线
    directionalLight.position.set(0, 10, 0);
    directionalLight.target.position.set(-5, 0, 0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);

    const pointColor = 0xFFFFFF;
    const intensity4 = 0;
    const pointLight = new THREE.PointLight(pointColor, intensity4); // 点光源，由一个点发出的散射光源
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    const spotColor = 0xFFFFFF;
    const intensity5 = 0;
    const spotLight = new THREE.SpotLight(spotColor, intensity5) // 聚光灯，从一个点发出的锥形光源
    spotLight.position.set(0, 10, 0);
    spotLight.target.position.set(-5, 0, 0);
    spotLight.penumbra = 1
    spotLight.angle = THREE.MathUtils.degToRad(30)
    scene.add(spotLight);
    scene.add(spotLight.target);

    const rectAreaColor = 0xFFFFFF;
    const intensity6 = 10;
    const width = 18;
    const height = 4;
    const rectAreaLight = new THREE.RectAreaLight(rectAreaColor, intensity6, width, height); // 矩形区域光，模拟灯管，一个区域的方向光
    rectAreaLight.position.set(0, 10, 0);
    rectAreaLight.rotation.x = THREE.MathUtils.degToRad(-90);
    scene.add(rectAreaLight);






    const helper = new THREE.DirectionalLightHelper(directionalLight); // 方向光助手，可视化
    helper.visible = false
    const helper2 = new THREE.PointLightHelper(pointLight); // 点光助手，可视化
    helper2.visible = false
    const helper3 = new THREE.SpotLightHelper(spotLight) // 聚光灯助手
    helper3.visible = false
    const helper4 = new RectAreaLightHelper(rectAreaLight); // 矩形区域光助手



    scene.add(helper);
    scene.add(helper2);
    scene.add(helper3);
    scene.add(helper4);

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
        helper2.update();
        helper3.update();
    }



    class DegRadHelper {
        constructor(obj, prop) {
            this.obj = obj;
            this.prop = prop;
        }
        get value() {
            return THREE.MathUtils.radToDeg(this.obj[this.prop]);
        }
        set value(v) {
            this.obj[this.prop] = THREE.MathUtils.degToRad(v);
        }
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
    const folder0 = makeFolder('环境光', false, gui)
    folder0.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('环境光颜色');
    folder0.add(ambientLight, 'intensity', 0, 2, 0.01).name('环境光亮度')
    const folder1 = makeFolder('半球光', false, gui)
    folder1.add(hemisphereLight, 'intensity', 0, 2, 0.01).name('半球光亮度')
    folder1.addColor(new ColorGUIHelper(hemisphereLight, 'color'), 'value').name('半球光天空颜色')
    folder1.addColor(new ColorGUIHelper(hemisphereLight, 'groundColor'), 'value').name('半球光地面颜色')

    const folder2 = makeFolder('方向光', false, gui)
    folder2.add(helper, 'visible').name('方向光助手')
    folder2.addColor(new ColorGUIHelper(directionalLight, 'color'), 'value').name('方向光颜色');
    folder2.add(directionalLight, 'intensity', 0, 2, 0.01).name('方向光亮度');
    folder2.add(directionalLight.target.position, 'x', -10, 10).name('方向光x');
    folder2.add(directionalLight.target.position, 'z', -10, 10).name('方向光y');
    folder2.add(directionalLight.target.position, 'y', -10, 10).name('方向光z');
    makeXYZGUI(folder2, directionalLight.position, '方向光位置', updateLight, false)
    makeXYZGUI(folder2, directionalLight.target.position, '方向光目标', updateLight, false)

    const folder3 = makeFolder('点光源', false, gui)
    folder3.add(helper2, 'visible').name('点光源助手')
    folder3.add(pointLight, 'intensity', 0, 150, 0.01).name('点光源亮度');
    folder3.add(pointLight, 'distance', 0, 40).name('点光源距离').onChange(updateLight);
    makeXYZGUI(folder3, pointLight.position, '点光源位置', updateLight, true)

    const folder4 = makeFolder('聚光灯', false, gui)
    folder4.add(helper3, 'visible').name('聚光灯助手')
    folder4.add(spotLight, 'intensity', 0, 150, 0.01).name('聚光灯亮度');
    folder4.add(spotLight, 'distance', 0, 40).name('聚光灯距离').onChange(updateLight);
    folder4.add(new DegRadHelper(spotLight, 'angle'), 'value', 0, 90).name('聚光灯角度').onChange(updateLight);
    folder4.add(spotLight, 'penumbra', 0, 1, 0.01).name('聚光灯边缘模糊').onChange(updateLight);
    makeXYZGUI(folder4, spotLight.position, '聚光灯源位置', updateLight, true)
    makeXYZGUI(folder4, spotLight.target.position, '聚光灯目标位置', updateLight, true)

    const folder5 = makeFolder('矩形区域光', false, gui)
    folder5.add(helper4, 'visible').name('聚光灯助手')
    folder5.add(rectAreaLight, 'intensity', 0, 150, 0.01).name('矩形区域光亮度');
    folder5.add(rectAreaLight, 'width', 0, 20);
    folder5.add(rectAreaLight, 'height', 0, 20);
    folder5.add(new DegRadHelper(rectAreaLight.rotation, 'x'), 'value', -180, 180).name('x 旋转');
    folder5.add(new DegRadHelper(rectAreaLight.rotation, 'y'), 'value', -180, 180).name('y 旋转');
    folder5.add(new DegRadHelper(rectAreaLight.rotation, 'z'), 'value', -180, 180).name('z 旋转');
    makeXYZGUI(folder5, rectAreaLight.position, '矩形区域光亮度位置', updateLight, true)


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
