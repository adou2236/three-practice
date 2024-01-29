<template>
    <h1>基础</h1>
<!--    默认画布长300,宽150-->
    <canvas id="c"></canvas>
</template>


<script lang="ts" setup>
import * as THREE from 'three';
import {onMounted} from "vue";

onMounted(() => {
    main()
})
function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    // 设置相机
    const fov = 75;
    const aspect = 2;  // 相机默认值
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    // 添加场景
    const scene = new THREE.Scene();

    // 设置一个几何体形状
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    // 创建材质（纯色）
    // const material = new THREE.MeshBasicMaterial({color: 0x44aa88});
    // 创建材质（反光材质）
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});


    // 通过形状与材质创建一个方块（网格）
    const cube = new THREE.Mesh(geometry, material);

    // 创建光源
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, 2, 2);
    // 将光源添加到场景中
    scene.add(light);


    // 将网格添加到场景中
    scene.add(cube);

    // 渲染场景与摄像机
    // renderer.render(scene, camera);

    function render(time) {
        time *= 0.001;  // 将时间单位变为秒

        cube.rotation.x = time;
        cube.rotation.y = time;

        renderer.render(scene, camera);

        requestAnimationFrame(render);
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
    width: 200px;
    height: 100px;
}

</style>
