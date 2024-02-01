<template>
    <h1>图元</h1>
    <canvas id="c"></canvas>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import {onMounted, ref} from "vue";

onMounted(() => {
    main()
})

// 创建立方体实例

function main() {
    function makeInstance(geometry: string, color: string, x: number) {
        const material = new THREE.MeshPhongMaterial({color});

        const ins = new THREE.Mesh(geometry, material);

        scene.add(ins);

        ins.position.x = x;

        return ins;
    }
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    // 设置相机
    const fov = 90;
    const aspect = 2;  // 相机默认值
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.y = 4;
    // camera.lookAt(0, 0, -5);

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
    // const material = new THREE.MeshPhongMaterial({color: 0x44aa88});


    // 通过形状与材质创建一个方块图元（网格）
    const cube = makeInstance(geometry, '#D03939', 0 );

    // 创建光源
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 3, 0);
    // 将光源添加到场景中
    scene.add(light);


    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width = Math.floor( canvas.clientWidth * pixelRatio );
        const height = Math.floor( canvas.clientHeight * pixelRatio );
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        time *= 0.001;  // 将时间单位变为秒
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }


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
    width: 500px;
    height: 500px;
}

</style>
