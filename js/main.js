import * as THREE from '../node_modules/three/build/three.module.js';
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


 
// Models 

//Plain forest block
  var loader = new GLTFLoader();
  for (let i = 0; i < 5; i++) {
  loader.load( './Assets/AurynSky/Forest Pack/Models/Forestground01blender.glb', function ( gltf ) {

  var forestBlock = gltf.scene;  
  forestBlock.position.set(0,0,i*2);
  console.log(forestBlock.position);
 objGroup.add(forestBlock);

}, undefined, function ( error ) {

	console.error( error );

} );
scene.add(objGroup);
  } 


  //Forest block with grass
  var loader = new GLTFLoader();
  for (let i = 0; i < 5; i++) {
  loader.load( './Assets/AurynSky/Forest Pack/Models/ForestGrassBlender.gltf', function ( gltf ) {

  var forestGrass= gltf.scene;  
  forestGrass.position.set(3,0,i*2);
 objGroup.add(forestGrass);

}, undefined, function ( error ) {

	console.error( error );

} );
scene.add(objGroup);
  } 

  //Forest block with pinetree
  var loader = new GLTFLoader();
  for (let i = 0; i < 5; i++) {
  loader.load( './Assets/AurynSky/Forest Pack/Models/ForestPineTreeBlender.gltf', function ( gltf ) {

  var forestPineTree= gltf.scene;  
  forestPineTree.position.set(6,0,i*2);
 objGroup.add(forestPineTree);

}, undefined, function ( error ) {

	console.error( error );

} );
scene.add(objGroup);
  } 

  //Forest block with small tree
  var loader = new GLTFLoader();
  for (let i = 0; i < 5; i++) {
  loader.load( './Assets/AurynSky/Forest Pack/Models/ForestTreeSmallBlender.glb', function ( gltf ) {

  var forestSmallTree= gltf.scene;  
  forestSmallTree.position.set(9,0,i*2);
 objGroup.add(forestSmallTree);

}, undefined, function ( error ) {

	console.error( error );

} );
scene.add(objGroup);
  } 


  //Forest crate
  var loader = new GLTFLoader();
  for (let i = 0; i < 5; i++) {
  loader.load( './Assets/AurynSky/Forest Pack/Models/ForestCrateBlender.glb', function ( gltf ) {

  var forestCrate= gltf.scene;  
  forestCrate.position.set(12,0,i*2);
 objGroup.add(forestCrate);

}, undefined, function ( error ) {

	console.error( error );

} );
scene.add(objGroup);
  } 








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