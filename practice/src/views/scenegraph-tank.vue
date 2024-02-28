<template>
    <h1>场景图-坦克</h1>
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
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const scene = new THREE.Scene();

    const wheels = []
    const objects = []
    const cameras = []

    const fov = 90;
    const aspect = 2;  // 相机默认值
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 15;
    camera.up.set(0,0,1)
    camera.lookAt(0,0,0)

    const color = 0xffffff;
    const intensity = 500;
    const light = new THREE.PointLight(color, intensity);
    light.position.z = 20
    scene.add(light);


    const groundMesh = groundRender()
    scene.add(groundMesh)

    const tankBox = tankRender()
    scene.add(tankBox)

    const tankPosition = new THREE.Vector2();
    const tankTarget = new THREE.Vector2();

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

    // makeAxisGrid(glaxyMesh, 'solarSystem', 25);
    // makeAxisGrid(sunMesh, 'sunMesh');
    // makeAxisGrid(solarMesh, 'solarMesh');
    // makeAxisGrid(earthMesh, 'earthMesh');
    // makeAxisGrid(moonMesh, 'moonMesh');



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

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    // 通过不间断的动画进行渲染，requestAnimationFrame动画默认回调次数与刷新率一致
    requestAnimationFrame(render);
    // render()
    // requestAnimationFrame(render);
}

function groundRender(){
    // 地面
    const width = 40
    const height = 40
    const sphereGeometry = new THREE.PlaneGeometry(
        width,
        height
    );
    const groundMaterial = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    const groundMesh = new THREE.Mesh(sphereGeometry, groundMaterial);
    return groundMesh
}

function tankRender(){
    // 坦克机身
    const width = 8;
    const height = 4;
    const depth = 2;
    const geometry = new THREE.BoxGeometry( width, height, depth );
    const material = new THREE.MeshPhongMaterial({color: '#44aa88'});
    // 通过形状与材质创建一个方块（网格）
    const tankBox = new THREE.Mesh(geometry, material);
    tankBox.position.x = 0
    tankBox.position.y = 0
    tankBox.position.z = 5

    const bodyMesh = new THREE.Object3D();
    tankBox.add(bodyMesh)

    let ops = [
        {x:-2.5, y:-2.5},
        {x:-2.5, y:2.5},
        {x:0.5, y:-2.5},
        {x:0.5, y:2.5},
        {x:3.5, y:-2.5},
        {x:3.5, y:2.5},
    ]

    for(let i = 0;i<6;i++){
        let currentWheel = wheelRender()
        currentWheel.position.x = ops[i].x
        currentWheel.position.y = ops[i].y
        bodyMesh.add(currentWheel)

    }

    let dome = domeRender()
    dome.position.x = 0
    dome.position.y = 0
    dome.position.z = 1
    dome.rotation.y = Math.PI;
    bodyMesh.add(dome)

    return tankBox
}


function domeRender(){
    const radius =  2;
    const widthSegments = 10;
    const heightSegments = 10;
    const geometry = new THREE.SphereGeometry(
        radius,
        widthSegments, heightSegments);
    const material = new THREE.MeshPhongMaterial({color: '#0099ff'});
    const domeMesh = new THREE.Mesh(geometry, material);
    let turret = turretRender()
    domeMesh.add(turret)
    turret.position.x = 0
    turret.position.y = 0
    turret.position.z = -1
    return domeMesh
}
function turretRender(){
    let turretMesh = new THREE.Object3D();
    const width = 1;
    const height = 5;
    const depth = 1;
    const geometry = new THREE.BoxGeometry( width, height, depth );
    const material = new THREE.MeshPhongMaterial({color: '#e89292'});
    // 通过形状与材质创建一个方块（网格）
    const turretBox = new THREE.Mesh(geometry, material);
    turretBox.position.x = 0
    turretBox.position.y = 2.5
    turretBox.position.z = 0
    turretMesh.add(turretBox)
    return turretMesh


}
function wheelRender(){
    const radius = 0.5;

    const tubeRadius = 0.2;

    const radialSegments = 8;

    const tubularSegments = 8;

    const geometry = new THREE.TorusGeometry(
        radius, tubeRadius,
        radialSegments, tubularSegments );
    const material = new THREE.MeshPhongMaterial({color: '#ff0000'});
    // 通过形状与材质创建一个方块（网格）
    const wheelBox = new THREE.Mesh(geometry, material);
    wheelBox.rotation.x = Math.PI * 0.5;
    return wheelBox
}

</script>

<!--
const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas } );
	renderer.setClearColor( 0xAAAAAA ); // 设置背景颜色
	renderer.shadowMap.enabled = true;

	function makeCamera( fov = 40 ) {

		const aspect = 2; // the canvas default
		const zNear = 0.1;
		const zFar = 1000;
		return new THREE.PerspectiveCamera( fov, aspect, zNear, zFar );

	}

	const camera = makeCamera();
	camera.position.set( 8, 4, 10 ).multiplyScalar( 3 );
	camera.lookAt( 0, 0, 0 );

	const scene = new THREE.Scene();

	{

		const light = new THREE.DirectionalLight( 0xffffff, 3 );
		light.position.set( 0, 20, 0 );
		scene.add( light );
		light.castShadow = true;
		light.shadow.mapSize.width = 2048;
		light.shadow.mapSize.height = 2048;

		const d = 50;
		light.shadow.camera.left = - d;
		light.shadow.camera.right = d;
		light.shadow.camera.top = d;
		light.shadow.camera.bottom = - d;
		light.shadow.camera.near = 1;
		light.shadow.camera.far = 50;
		light.shadow.bias = 0.001;

	}

	{

		const light = new THREE.DirectionalLight( 0xffffff, 3 );
		light.position.set( 1, 2, 4 );
		scene.add( light );

	}

	const groundGeometry = new THREE.PlaneGeometry( 50, 50 ); // 平面图元
	const groundMaterial = new THREE.MeshPhongMaterial( { color: 0xCC8866 } );
	const groundMesh = new THREE.Mesh( groundGeometry, groundMaterial );
	groundMesh.rotation.x = Math.PI * - .5; //旋转90度
	groundMesh.receiveShadow = true;
	scene.add( groundMesh );

	const carWidth = 4;
	const carHeight = 1;
	const carLength = 8;

	const tank = new THREE.Object3D();
	scene.add( tank );

	const bodyGeometry = new THREE.BoxGeometry( carWidth, carHeight, carLength );
	const bodyMaterial = new THREE.MeshPhongMaterial( { color: 0x6688AA } );
	const bodyMesh = new THREE.Mesh( bodyGeometry, bodyMaterial );
	bodyMesh.position.y = 1.4;
	bodyMesh.castShadow = true;
	tank.add( bodyMesh );

	const tankCameraFov = 75;
	const tankCamera = makeCamera( tankCameraFov );
	tankCamera.position.y = 3;
	tankCamera.position.z = - 6;
	tankCamera.rotation.y = Math.PI;
	bodyMesh.add( tankCamera );

	const wheelRadius = 1;
	const wheelThickness = .5;
	const wheelSegments = 6;
	const wheelGeometry = new THREE.CylinderGeometry(
		wheelRadius, // top radius
		wheelRadius, // bottom radius
		wheelThickness, // height of cylinder
		wheelSegments );
	const wheelMaterial = new THREE.MeshPhongMaterial( { color: 0x888888 } );
	const wheelPositions = [
		[ - carWidth / 2 - wheelThickness / 2, - carHeight / 2, carLength / 3 ],
		[ carWidth / 2 + wheelThickness / 2, - carHeight / 2, carLength / 3 ],
		[ - carWidth / 2 - wheelThickness / 2, - carHeight / 2, 0 ],
		[ carWidth / 2 + wheelThickness / 2, - carHeight / 2, 0 ],
		[ - carWidth / 2 - wheelThickness / 2, - carHeight / 2, - carLength / 3 ],
		[ carWidth / 2 + wheelThickness / 2, - carHeight / 2, - carLength / 3 ],
	];
	const wheelMeshes = wheelPositions.map( ( position ) => {

		const mesh = new THREE.Mesh( wheelGeometry, wheelMaterial );
		mesh.position.set( ...position );
		mesh.rotation.z = Math.PI * .5;
		mesh.castShadow = true;
		bodyMesh.add( mesh );
		return mesh;

	} );

	const domeRadius = 2;
	const domeWidthSubdivisions = 12;
	const domeHeightSubdivisions = 12;
	const domePhiStart = 0;
	const domePhiEnd = Math.PI * 2;
	const domeThetaStart = 0;
	const domeThetaEnd = Math.PI * .5;
	const domeGeometry = new THREE.SphereGeometry(
		domeRadius, domeWidthSubdivisions, domeHeightSubdivisions,
		domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd );
	const domeMesh = new THREE.Mesh( domeGeometry, bodyMaterial );
	domeMesh.castShadow = true;
	bodyMesh.add( domeMesh );
	domeMesh.position.y = .5;

	const turretWidth = .1;
	const turretHeight = .1;
	const turretLength = carLength * .75 * .2;
	const turretGeometry = new THREE.BoxGeometry(
		turretWidth, turretHeight, turretLength );
	const turretMesh = new THREE.Mesh( turretGeometry, bodyMaterial );
	const turretPivot = new THREE.Object3D();
	turretMesh.castShadow = true;
	turretPivot.scale.set( 5, 5, 5 );
	turretPivot.position.y = .5;
	turretMesh.position.z = turretLength * .5;
	turretPivot.add( turretMesh );
	bodyMesh.add( turretPivot );

	const turretCamera = makeCamera();
	turretCamera.position.y = .75 * .2;
	turretMesh.add( turretCamera );

	const targetGeometry = new THREE.SphereGeometry( .5, 6, 3 );
	const targetMaterial = new THREE.MeshPhongMaterial( { color: 0x00FF00, flatShading: true } );
	const targetMesh = new THREE.Mesh( targetGeometry, targetMaterial );
	const targetOrbit = new THREE.Object3D();
	const targetElevation = new THREE.Object3D();
	const targetBob = new THREE.Object3D();
	targetMesh.castShadow = true;
	scene.add( targetOrbit );
	targetOrbit.add( targetElevation );
	targetElevation.position.z = carLength * 2;
	targetElevation.position.y = 8;
	targetElevation.add( targetBob );
	targetBob.add( targetMesh );

	const targetCamera = makeCamera();
	const targetCameraPivot = new THREE.Object3D();
	targetCamera.position.y = 1;
	targetCamera.position.z = - 2;
	targetCamera.rotation.y = Math.PI;
	targetBob.add( targetCameraPivot );
	targetCameraPivot.add( targetCamera );

	// Create a sine-like wave
	const curve = new THREE.SplineCurve( [
		new THREE.Vector2( - 10, 0 ),
		new THREE.Vector2( - 5, 5 ),
		new THREE.Vector2( 0, 0 ),
		new THREE.Vector2( 5, - 5 ),
		new THREE.Vector2( 10, 0 ),
		new THREE.Vector2( 5, 10 ),
		new THREE.Vector2( - 5, 10 ),
		new THREE.Vector2( - 10, - 10 ),
		new THREE.Vector2( - 15, - 8 ),
		new THREE.Vector2( - 10, 0 ),
	] );

	const points = curve.getPoints( 50 );
	const geometry = new THREE.BufferGeometry().setFromPoints( points );
	const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
	const splineObject = new THREE.Line( geometry, material );
	splineObject.rotation.x = Math.PI * .5;
	splineObject.position.y = 0.05;
	scene.add( splineObject );

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

	const targetPosition = new THREE.Vector3();
	const tankPosition = new THREE.Vector2();
	const tankTarget = new THREE.Vector2();

	const cameras = [
		{ cam: camera, desc: 'detached camera', },
		{ cam: turretCamera, desc: 'on turret looking at target', },
		{ cam: targetCamera, desc: 'near target looking at tank', },
		{ cam: tankCamera, desc: 'above back of tank', },
	];

	const infoElem = document.querySelector( '#info' );

	function render( time ) {

		time *= 0.001;

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			cameras.forEach( ( cameraInfo ) => {

				const camera = cameraInfo.cam;
				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				camera.updateProjectionMatrix();

			} );

		}

		// move target
		targetOrbit.rotation.y = time * .27;
		targetBob.position.y = Math.sin( time * 2 ) * 4;
		targetMesh.rotation.x = time * 7;
		targetMesh.rotation.y = time * 13;
		targetMaterial.emissive.setHSL( time * 10 % 1, 1, .25 );
		targetMaterial.color.setHSL( time * 10 % 1, 1, .25 );

		// move tank
		const tankTime = time * .05;
		curve.getPointAt( tankTime % 1, tankPosition );
		curve.getPointAt( ( tankTime + 0.01 ) % 1, tankTarget );
		tank.position.set( tankPosition.x, 0, tankPosition.y );
		tank.lookAt( tankTarget.x, 0, tankTarget.y );

		// face turret at target
		targetMesh.getWorldPosition( targetPosition );
		turretPivot.lookAt( targetPosition );

		// make the turretCamera look at target
		turretCamera.lookAt( targetPosition );

		// make the targetCameraPivot look at the at the tank
		tank.getWorldPosition( targetPosition );
		targetCameraPivot.lookAt( targetPosition );

		wheelMeshes.forEach( ( obj ) => {

			obj.rotation.x = time * 3;

		} );

		const camera = cameras[ time * .25 % cameras.length | 0 ];
		infoElem.textContent = camera.desc;

		renderer.render( scene, camera.cam );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );
	-->


<style scoped>
#c{
    width: 500px;
    height: 500px;
}

</style>
