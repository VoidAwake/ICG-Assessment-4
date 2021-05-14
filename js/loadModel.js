import {GLTFLoader} from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "./three.js";
import {getScene} from "./main.js";

function loadModel() {
//Ice block
var loader = new GLTFLoader();
loader.load( './Assets/AurynSky/WinterArena/Models/IceBlockBlender.glb', function ( gltf ) {

var iceBlock= gltf.scene;  
//getScene().add(iceBlock);
//iceBlock.position.set(30,0,i*2);
//objGroup.add(iceBlock);
console.log(iceBlock);
return iceBlock;

}, undefined, function ( error ) {

console.error( error );

} );
//scene.add(objGroup);

}

export {loadModel};