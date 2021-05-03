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
 /* var loader = new FBXLoader();

loader.load( './Assets/AurynSky/Forest Pack/Models/test.fbx', function ( object ) {
    //object.scale.set(0.5, 0.5, 0.5) //sets size of object 
  //var blockOne = object; 
    scene.add( object );

} );
*/ 
  var loader = new GLTFLoader();

loader.load( './Assets/AurynSky/Forest Pack/Models/Forestground01blender.glb', function ( gltf ) {

    var forestBlock = gltf.scene;  
    for (var i = 0; i < 15; i++) {
    
    forestBlock.position.set(0,0,i)
	scene.add( forestBlock );
    scene.add( forestBlock );
    console.log(i);
    } 
}, undefined, function ( error ) {

	console.error( error );

} );

//scene.background = new THREE.Color(0xFFFFFF)
var light = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 2); 
scene.add(light); 

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