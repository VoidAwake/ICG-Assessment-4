import * as THREE from './three.module.js';
import { PointerLockControls } from "./PointerLockControls.js";

class CameraController {
    constructor (camera, speed) {
        this.speed = speed;

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        
        this.prevTime = performance.now();
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        this.controls = new PointerLockControls( camera, document.body );
        
        var onKeyDown = function ( event ) {
        
            switch ( event.keyCode ) {
        
                case 38: // up
                case 87: // w
                    this.moveForward = true;
                    break;
        
                case 37: // left
                case 65: // a
                    this.moveLeft = true;
                    break;
        
                case 40: // down
                case 83: // s
                    this.moveBackward = true;
                    break;
        
                case 39: // right
                case 68: // d
                    this.moveRight = true;
                    break;
        
            }
        
        }.bind(this);
        
        var onKeyUp = function ( event ) {
        
            switch( event.keyCode ) {
        
                case 38: // up
                case 87: // w
                    this.moveForward = false;
                    break;
        
                case 37: // left
                case 65: // a
                    this.moveLeft = false;
                    break;
        
                case 40: // down
                case 83: // s
                    this.moveBackward = false;
                    break;
        
                case 39: // right
                case 68: // d
                    this.moveRight = false;
                    break;
        
            }
        }.bind(this);
        
        document.addEventListener( 'keydown', onKeyDown, false );
        document.addEventListener( 'keyup', onKeyUp, false );
    }

    update () {
        const time = performance.now();
        const delta = ( time - this.prevTime ) / 1000;
    
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;
    
        this.direction.z = Number( this.moveBackward ) - Number( this.moveForward );
        this.direction.x = Number( this.moveLeft ) - Number( this.moveRight );
        this.direction.normalize();
    
        if ( this.moveForward || this.moveBackward ) this.velocity.z -= this.direction.z * this.speed * delta;
        if ( this.moveLeft || this.moveRight ) this.velocity.x -= this.direction.x * this.speed * delta;
    
        this.controls.moveForward(this.velocity.z * delta);
        this.controls.moveRight(this.velocity.x * delta);
    
        this.prevTime = time;
    }
}

export { CameraController };