<template>
  <div id="scene">
  </div>
</template>

<script setup>
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import {onMounted} from "vue";

onMounted(()=>{
  const loader = new FontLoader();

  loader.load( '/helvetiker_regular.typeface.json', function ( font ) {

    const geometry = new TextGeometry( 'Hello three.js!', {
      font: font,
      size: 80,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 8,
      bevelSegments: 5
    } );
  } );


})


</script>

<style>
#scene {
  width: 100vw;
  height: 100vh;
  position: relative;
}
#info{
  color: white;
  position: absolute;
  top: 100px;

}
</style>
