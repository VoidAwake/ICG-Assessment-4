import * as THREE from './three.module.js';
import { Grid } from "./Grid.js";
import { CameraController } from "./CameraController.js";
//import { FBXLoader } from './jsm/loaders/FBXLoader.js';
import { FBXLoader } from '../node_modules/three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
var objGroup = new THREE.Group();
const scene = new THREE.Scene();
const ratio = window.innerWidth / window.innerHeight;

const camera = new THREE.PerspectiveCamera(
    45,
    ratio,
    0.1,
    1000
);

/* 
//Fbx Loader
  var loader = new FBXLoader();
  for (var i = 0; i < 15; i++) {
loader.load( './Assets/AurynSky/Forest Pack/Models/test.fbx', function ( object ) {
    object.castShadow = true;
    object.receiveShadow = true;
    object.scale.set(0.5, 0.5, 0.5) //sets size of object 
    object.position.set(0,0,5)
  //var blockOne = object; 
    //scene.add( object );
    objGroup.add(object);
    scene.add(objGroup);
} );

  }
 */ 

 
  var loader = new GLTFLoader();
  for (let i = 0; i < 15; i++) {
  loader.load( './Assets/AurynSky/Forest Pack/Models/Forestground01blender.glb', function ( gltf ) {

  var forestBlock = gltf.scene;  
  forestBlock.position.set(0,0,i);
  console.log(forestBlock.position);
 objGroup.add(forestBlock);

}, undefined, function ( error ) {

	console.error( error );

} );
scene.add(objGroup);
  } 


//scene.background = new THREE.Color(0xFFFFFF)
var light = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 3); 
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