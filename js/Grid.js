import * as THREE from './three.module.js';
import {GridMesh} from "./GridMesh.js";

class Grid {
    constructor (size, spacing, camera) {
        this.size = size;
        this.spacing = spacing;
        this.camera = camera;
        this.objects = new Array();
        this.group = new THREE.Group();
        this.origin = new THREE.Vector3(0, 0, 0);
        this.baseCameraOffset = this.getCameraOffset();
        this.cameraOffsetDelta = 0;
        this.clampedCameraOffsetDelta = 0;
    
        for (let x = 0; x < this.size; x++) {
            this.objects[x] = new Array();
    
            for (let z = 0; z < size; z++) {
                this.addNewMesh(x, z);
            }
        }

        this.directionOffsets = {
          "left": new THREE.Vector3 (-this.spacing, 0, 0),
          "right": new THREE.Vector3 (this.spacing, 0, 0),
          "back": new THREE.Vector3 (0, 0, -this.spacing),
          "forward": new THREE.Vector3 (0, 0, this.spacing)
        }
    }

    move (direction) {
        console.log("Move Grid " + direction);

        this.origin.add(this.directionOffsets[direction]);
        this.baseCameraOffset.add(this.directionOffsets[direction]);

        if (direction == "left" || direction == "right") {
            const xFirst = direction == "left" ? this.size - 1 : 0;
            const xLast = direction == "left" ? 0 : this.size - 1;
            const xInc = direction == "left" ? -1 : 1;

            for (let x = xFirst; Math.abs(xFirst - x) <= Math.abs(xLast - xFirst); x += xInc) {
                for (let z = 0; z < this.size; z++) {
                    // Destroy the left side of the grid
                    if (x == xFirst) {
                        this.group.remove(this.objects[x][z]);
                    }

                    // Move all grid items left
                    if (x != xLast) {
                        this.objects[x][z] = this.objects[x + xInc][z];
                    } else {
                        // Create new objects in left side of grid
                        this.addNewMesh(x, z);
                    }
                }
            }
          } else {
            const zFirst = direction == "back" ? this.size - 1 : 0;
            const zLast = direction == "back" ? 0 : this.size - 1;
            const zInc = direction == "back" ? -1 : 1;

            for (let x = 0; x < this.size; x++) {
                for (let z = zFirst; Math.abs(zFirst - z) <= Math.abs(zLast - zFirst); z += zInc) {
                    // Destroy the left side of the grid
                    if (z == zFirst) {
                        this.group.remove(this.objects[x][z]);
                    }

                    // Move all grid items left
                    if (z != zLast) {
                        this.objects[x][z] = this.objects[x][z + zInc];
                    } else {
                        // Create new objects in left side of grid
                        this.addNewMesh(x, z);
                    }
                }
            }
        }
        
        this.fadeSides();
    }

    addNewMesh (x, z) {
        const newMesh = new GridMesh(1);

        let positionInGrid = new THREE.Vector3(x, 0, z).multiplyScalar(this.spacing);
        positionInGrid.add(this.origin);

        newMesh.position.set(positionInGrid.x, positionInGrid.y, positionInGrid.z);
        this.objects[x][z] = newMesh;

        newMesh.visible = false;

        this.group.add(newMesh);

        setTimeout(function(){ newMesh.visible = true; }, 100);
    }

    update () {
        this.updateCameraOffsetDelta();

        this.updateClampedCameraOffsetDelta();

        this.fadeSides();

        // Move the grid
    
        if (this.clampedCameraOffsetDelta.x > 1) {
            this.move("left");
        }
    
        if (this.clampedCameraOffsetDelta.x < -1) {
            this.move("right");
        }
    
        if (this.clampedCameraOffsetDelta.z > 1) {
            this.move("back");
        }
    
        if (this.clampedCameraOffsetDelta.z < -1) {
            this.move("forward");
        }
    }

    getCameraOffset () {
        let cameraOffset = this.camera.position.clone();
        cameraOffset.sub(this.group.position);
        return cameraOffset;
    }

    updateCameraOffsetDelta () {
        let cameraOffsetDelta = this.baseCameraOffset.clone();
        cameraOffsetDelta.sub(this.getCameraOffset());
        this.cameraOffsetDelta = cameraOffsetDelta;
    }

    updateClampedCameraOffsetDelta () {
        let clampedCameraOffsetDelta = this.cameraOffsetDelta.clone();
        clampedCameraOffsetDelta.divideScalar(this.spacing);
        this.clampedCameraOffsetDelta = clampedCameraOffsetDelta;
    }

    fadeSides () {
        const clampedDeltaX = this.clampedCameraOffsetDelta.x;
        const clampedDeltaZ = this.clampedCameraOffsetDelta.z;

        const positiveClampedX = clampedDeltaX > 0 ? clampedDeltaX : 0;
        const negativeClampedX = clampedDeltaX < 0 ? clampedDeltaX : 0;

        const positiveClampedZ = clampedDeltaZ > 0 ? clampedDeltaZ : 0;
        const negativeClampedZ = clampedDeltaZ < 0 ? clampedDeltaZ : 0;

        // Construct an array of opacities
        const opacities = new Array();

        for (let x = 0; x < this.size; x++) {
            opacities[x] = new Array();

            for (let z = 0; z < this.size; z++) {
                opacities[x][z] = 0;
            }
        }

        // Set opacity values

        for (let i = 0; i < this.size; i++) {
            // Left side
            opacities[0][i] = Math.max(opacities[0][i], 1 - (positiveClampedX));
            opacities[1][i] = Math.max(opacities[1][i], (-1 * negativeClampedX));
            
            // Right side
            opacities[this.size - 1][i] = Math.max(opacities[this.size - 1][i], 1 - (-1 * negativeClampedX));
            opacities[this.size - 2][i] = Math.max(opacities[this.size - 2][i], positiveClampedX);
            
            // Back side
            opacities[i][0] = Math.max(opacities[i][0], 1 - (positiveClampedZ));
            opacities[i][1] = Math.max(opacities[i][1], (-1 * negativeClampedZ));

            // Forward side
            opacities[i][this.size - 1] = Math.max(opacities[i][this.size - 1], 1 - (-1 * negativeClampedZ));
            opacities[i][this.size - 2] = Math.max(opacities[i][this.size - 2], positiveClampedZ);
        }

        const maxYPosition = -4;

        for (let i = 0; i < this.size; i++) {
        // Apply opacities to objects
            // Left side
            this.objects[0][i].material.color = this.objects[0][i].baseColor.clone().lerpHSL(new THREE.Color(0x000000), opacities[0][i]);
            this.objects[1][i].material.color = this.objects[1][i].baseColor.clone().lerpHSL(new THREE.Color(0x000000), opacities[1][i]);
            
            // Right side
            this.objects[this.size - 1][i].material.color = this.objects[this.size - 1][i].baseColor.clone().lerpHSL(new THREE.Color(0x000000), opacities[this.size - 1][i]);
            this.objects[this.size - 2][i].material.color = this.objects[this.size - 2][i].baseColor.clone().lerpHSL(new THREE.Color(0x000000), opacities[this.size - 2][i]);
            
            // Back side
            this.objects[i][0].material.color = this.objects[i][0].baseColor.clone().lerpHSL(new THREE.Color(0x000000), opacities[i][0]);
            this.objects[i][1].material.color = this.objects[i][1].baseColor.clone().lerpHSL(new THREE.Color(0x000000), opacities[i][1]);

            // Forward side
            this.objects[i][this.size - 1].material.color = this.objects[i][this.size - 1].baseColor.clone().lerpHSL(new THREE.Color(0x000000), opacities[i][this.size - 1]);
            this.objects[i][this.size - 2].material.color = this.objects[i][this.size - 2].baseColor.clone().lerpHSL(new THREE.Color(0x000000), opacities[i][this.size - 2]);

        // Set Y positions
            // Left side
            this.objects[0][i].position.y = opacities[0][i] * maxYPosition;
            this.objects[1][i].position.y = opacities[1][i] * maxYPosition;
            
            // Right side
            this.objects[this.size - 1][i].position.y = opacities[this.size - 1][i] * maxYPosition;
            this.objects[this.size - 2][i].position.y = opacities[this.size - 2][i] * maxYPosition;
            
            // Back side
            this.objects[i][0].position.y = opacities[i][0] * maxYPosition;
            this.objects[i][1].position.y = opacities[i][1] * maxYPosition;

            // Forward side
            this.objects[i][this.size - 1].position.y = opacities[i][this.size - 1] * maxYPosition;
            this.objects[i][this.size - 2].position.y = opacities[i][this.size - 2] * maxYPosition;
        }
    }
}

export {Grid};