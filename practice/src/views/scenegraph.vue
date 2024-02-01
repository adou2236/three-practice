<template>
    <h1>图元</h1>
    <canvas id="c"></canvas>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import {onMounted, ref} from "vue";
import GUI from 'lil-gui';

const gui = new GUI();

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
    camera.position.y = 20;
    camera.up.set(0, 0, 1);
    camera.lookAt(0,0,0)

    // 添加场景
    const scene = new THREE.Scene();

    // 要更新旋转角度的对象数组
    const objects = [];

    // 一球多用
    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(
        radius,
        widthSegments,
        heightSegments
    );

    const glaxyMesh = new THREE.Object3D();
    scene.add(glaxyMesh);
    objects.push(glaxyMesh);


    const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5); // 扩大太阳的大小
    glaxyMesh.add(sunMesh)

    const solarMesh = new THREE.Object3D();
    glaxyMesh.add(solarMesh);
    objects.push(solarMesh);

    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x2200ff,
        emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    solarMesh.position.x = 10;
    solarMesh.add(earthMesh);

    const moonMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
        emissive: 0x222222,
    });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonMesh.position.x = 2;
    solarMesh.add(moonMesh);
    objects.push(moonMesh);





    // 通过形状与材质创建一个方块图元（网格）

    // 创建光源
    const color = 0xffffff;
    const intensity = 300;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);

    class AxisGridHelper {
        constructor(node, units = 10) {
            const axes = new THREE.AxesHelper();
            axes.material.depthTest = false;
            axes.renderOrder = 2; // 在网格渲染之后再渲染
            node.add(axes);

            const grid = new THREE.GridHelper(units, units);
            grid.material.depthTest = false;
            grid.renderOrder = 1;
            node.add(grid);

            this.grid = grid;
            this.axes = axes;
            this.visible = false;
        }
        get visible() {
            return this._visible;
        }
        set visible(v) {
            this._visible = v;
            this.grid.visible = v;
            this.axes.visible = v;
        }
    }

    function makeAxisGrid(node, label, units) {
        const helper = new AxisGridHelper(node, units);
        gui.add(helper, 'visible').name(label);
    }

    makeAxisGrid(glaxyMesh, 'solarSystem', 25);
    makeAxisGrid(sunMesh, 'sunMesh');
    makeAxisGrid(solarMesh, 'solarMesh');
    makeAxisGrid(earthMesh, 'earthMesh');
    makeAxisGrid(moonMesh, 'moonMesh');



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
        objects.forEach((obj) => {
            obj.rotation.y = time;
        });
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

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
