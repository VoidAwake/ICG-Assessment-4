import * as THREE from '../node_modules/three/build/three.module.js';
import {GridMesh} from "./GridMesh.js";

class Grid {
    constructor (size, spacing, camera) {
        this.size = size;
        this.spacing = spacing;
        this.camera = camera;
        this.objects = new Array();
        this.group = new THREE.Group();
        this.origin = new THREE.Vector3(0, 0, 0);
        this.originalCameraOffset = this.getCameraOffset();
        this.baseCameraOffset = this.getCameraOffset();
        this.width = (this.size - 1) * this.spacing;
    
        for (let x = 0; x < this.size; x++) {
            this.objects[x] = new Array();
    
            for (let z = 0; z < size; z++) {
                this.addNewMesh(x, z);
            }
        }

        this.directionOffsets = {
          "right":    new THREE.Vector3 ( this.spacing, 0, 0),
          "left":     new THREE.Vector3 (-this.spacing, 0, 0),
          "forward":  new THREE.Vector3 (0, 0,  this.spacing),
          "back":     new THREE.Vector3 (0, 0, -this.spacing),
        }

        this.directionFunctions = {
          "right":    (i, j) => new THREE.Vector3(i, 0, j),
          "left":     (i, j) => new THREE.Vector3(this.size - i - 1, 0, j),
          "forward":  (i, j) => new THREE.Vector3(j, 0, i),
          "back":     (i, j) => new THREE.Vector3(j, 0, this.size - i - 1),
        }
    }

    move (direction) {
        console.log("Move grid " + direction);

        this.origin.add(this.directionOffsets[direction]);
        this.baseCameraOffset.add(this.directionOffsets[direction]);

        for (let i = 0; i < this.size; i++) {
          for (let j = 0; j < this.size; j++) {
            const coords = this.directionFunctions[direction](i, j);
            const nextCoords = this.directionFunctions[direction](i + 1, j);

            if (i == 0) {
                // Destroy the one side of the grid
                this.group.remove(this.objects[coords.x][coords.z]);
            }

            if (i != this.size - 1) {
                // Move all grid items
                this.objects[coords.x][coords.z] = this.objects[nextCoords.x][nextCoords.z];
            } else {
                // Create new objects on the other side of the grid
                this.addNewMesh(coords.x, coords.z);
            }
          }
        }
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
        const cameraOffsetDelta = this.baseCameraOffset.clone().sub(this.getCameraOffset());
        const clampedCameraOffsetDelta = cameraOffsetDelta.clone().divideScalar(this.spacing);

        // Move the grid
    
        if (clampedCameraOffsetDelta.x > 1) {
            this.move("left");
        }
    
        if (clampedCameraOffsetDelta.x < -1) {
            this.move("right");
        }
    
        if (clampedCameraOffsetDelta.z > 1) {
            this.move("back");
        }
    
        if (clampedCameraOffsetDelta.z < -1) {
            this.move("forward");
        }

        this.fadeSides();
    }

    getCameraOffset () {
        let cameraOffset = this.camera.position.clone();
        cameraOffset.sub(this.group.position);
        return cameraOffset;
    }

    fadeSides () {
      const maxYPosition = -4;

      for (let x = 0; x < this.size; x++) {
        for (let z = 0; z < this.size; z++) {
          const originToCentre = new THREE.Vector3(this.width * 0.5, 0, this.width * 0.5);
          const gridCentre = this.camera.position.clone().sub(this.originalCameraOffset).add(originToCentre);
          const distanceToObject = this.objects[x][z].position.distanceTo(gridCentre);
          const opacity = this.distanceToOpacity(distanceToObject);

          this.objects[x][z].material.color = this.objects[x][z].baseColor.clone().lerpHSL(new THREE.Color(0x000000), opacity);
          this.objects[x][z].position.y = opacity * maxYPosition;
        }
      }
    }

    distanceToOpacity (distance) {
      const steepness = 10;

      return 1 - (1 / (1 + steepness * Math.pow(Math.E, distance - this.width * 0.5)));
    }
}

export { Grid };