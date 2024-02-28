<template>
    <h1>纹理</h1>
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

    const cubes = []
    // 添加场景
    const scene = new THREE.Scene();

    // 设置一个几何体形状
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const loader = new THREE.TextureLoader();

    function loadColorTexture( path ) {
        const texture = loader.load( path );
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }

    const material = new THREE.MeshBasicMaterial( {
        map: loadColorTexture('src/assets/wall.jpg')
    } );



    const materials = [
        new THREE.MeshBasicMaterial({map: loadColorTexture('src/assets/flower-1.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('src/assets/flower-2.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('src/assets/flower-3.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('src/assets/flower-4.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('src/assets/flower-5.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('src/assets/flower-6.jpg')}),
    ];

    // 通过形状与材质创建一个方块（网格）
    const cube1 = new THREE.Mesh(geometry, material);
    const cube2 = new THREE.Mesh(geometry, materials);
    cube2.position.x = 2

    scene.add(cube1);
    scene.add(cube2);

    cubes.push(cube1)
    cubes.push(cube2)

    function render(time) {
        time *= 0.001;  // 将时间单位变为秒

        cubes.forEach(cube => {
            cube.rotation.x = time;
            cube.rotation.y = time;

        })

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
    width: 600px;
    height: 300px;
}

</style>
