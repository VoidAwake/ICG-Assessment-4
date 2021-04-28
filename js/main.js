import * as THREE from '../node_modules/three/build/three.module.js';
import { Grid } from "./Grid.js";
import { CameraController } from "./CameraController.js";
//import { FBXLoader } from './jsm/loaders/FBXLoader.js';
import { FBXLoader } from '../node_modules/three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const ratio = window.innerWidth / window.innerHeight;

const camera = new THREE.PerspectiveCamera(
    45,
    ratio,
    0.1,
    1000
);
 var loader = new FBXLoader();

loader.load( '../ForestCastle.FBX', function ( object ) {

    scene.add( object );

} );

 var loader = new GLTFLoader();

loader.load( '../glForestBlock01.gltf', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

camera.position.set(13, 25, 30);
camera.lookAt(13, 0, 15);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const cameraController = new CameraController(camera, 100);

const grid = new Grid(7, 4, camera);
scene.add(grid.group);

function animate () {
    requestAnimationFrame(animate);

    cameraController.update();

    grid.update();

    renderer.render(scene, camera);
}

animate();