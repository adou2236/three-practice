<template>
    <span>静态阴影</span>
    <div style="width: 600px; height: 600px; position: relative">
        <!--    默认画布长300,宽150-->
        <canvas id="c"></canvas>
    </div>

</template>


<script lang="ts" setup>
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
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
    camera.position.set(0, 10, 30);




    // 添加场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("white");


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
    const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
    planeMat.color.setRGB(1.5, 1.5, 1.5);
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);

    const shadowTexture = loader.load("src/assets/roundshadow.png");
    const sphereShadowBases = [];
    const shadowPlaneSize = 1;
    const shadowGeo = new THREE.PlaneGeometry(shadowPlaneSize, shadowPlaneSize);

    const sphereRadius = 1;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const numSpheres = 15;
    for (let i = 0; i < numSpheres; ++i) {
        // 创建一个基础的3D对象，将球体与阴影放在一个对象中，方便能够同时移动
        const base = new THREE.Object3D();
        scene.add(base);

        // 添加阴影
        const shadowMat = new THREE.MeshBasicMaterial({
            map: shadowTexture,
            transparent: true, // 能够看到地板
            depthWrite: false, // 无需进行排序
        });
        const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        shadowMesh.position.y = 0.001; // 位置稍微高于地板
        shadowMesh.rotation.x = Math.PI * -0.5;
        const shadowSize = sphereRadius * 4;
        shadowMesh.scale.set(shadowSize, shadowSize, shadowSize);
        base.add(shadowMesh);

        // 添加球体
        const u = i / numSpheres; // 区分每个球体
        const sphereMat = new THREE.MeshPhongMaterial();
        sphereMat.color.setHSL(u, 1, 0.75);
        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        sphereMesh.position.set(0, sphereRadius + 2, 0);
        base.add(sphereMesh);

        // remember all 3 plus the y position
        sphereShadowBases.push({
            base,
            sphereMesh,
            shadowMesh,
            y: sphereMesh.position.y,
        });
    }


    const skyColor = 0xb1e1ff;
    const groundColor = 0xb97a20;
    const intensity = 2;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);

    const color = 0xffffff;
    const intensity2 = 1;
    const light2 = new THREE.DirectionalLight(color, intensity2);
    light2.position.set(0, 10, 5);
    light2.target.position.set(-5, 0, 0);
    scene.add(light2);
    scene.add(light2.target);


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
        time *= 0.001;  // convert to seconds

        sphereShadowBases.forEach((sphereShadowBase, ndx) => {
            const {base, sphereMesh, shadowMesh, y} = sphereShadowBase;

            // 非连续下标
            const u = ndx / sphereShadowBases.length;

            // 计算在空间中的位置，这将同时移动球体与阴影
            const speed = time * 0.2; // 速度
            const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1); // 角度
            const radius = Math.sin(speed - ndx) * 10; // 半径
            base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);

            // y轴距离，从0-1
            const yOff = Math.abs(Math.sin(time * 2 + ndx)); // 利用三角函数实现 0 - 1 - 0的循环
            // 上下移动
            sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff);
            // 改变阴影的透明度，越高越不清晰
            shadowMesh.material.opacity = THREE.MathUtils.lerp(1, .25, yOff);
            // 改变阴影的大小，越高越小
            shadowMesh.scale.x = THREE.MathUtils.lerp(1, 1.5, yOff)
            shadowMesh.scale.y = THREE.MathUtils.lerp(1, 1.5, yOff)
            shadowMesh.scale.z = THREE.MathUtils.lerp(1, 1.5, yOff)
        });


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
