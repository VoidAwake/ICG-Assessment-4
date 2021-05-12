import {getScene} from "../js/Perspective/setup.js";
import * as THREE from "./Dependencies/three.module.js";
import {FBXLoader} from "./Dependencies/FBXLoader.js";

var loader = new FBXLoader();
var clock = new THREE.Clock();
clock.start();

function loadModel(model) {
    
    loader.load( model, function ( object ) {

        object.castShadow = true;
        getScene().add( object );
        object.position.y = 0;
        object.scale.multiplyScalar(3);
    } );
}








export {loadModel};

    

    

