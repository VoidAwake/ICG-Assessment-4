import * as THREE from '../node_modules/three/build/three.module.js';
import { Model } from "../node_modules/@voidawake/3d-wfc-js/Model.js";
import { Knots } from "./Knots.js";

class Grid {
    constructor (size, spacing, camera, models) {
        this.size = size;
        this.spacing = spacing;
        this.camera = camera;
        this.models = models;

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
        let newMesh;

        if (this.structuresNearby(x, z)) {
            // Generate Basic Tile
            newMesh = this.models[0].clone();

            newMesh.structure = false;
        } else {
            if (Math.random() > 0.01) {
                // Generate Random Tile
                const randomModelIndex = Math.floor(Math.random() * this.models.length);
                newMesh = this.models[randomModelIndex].clone();

                newMesh.structure = false;
            } else {
                // Generate Structure
                newMesh = new THREE.Group();
                newMesh.add(this.models[0].clone());
                newMesh.add(this.createWFCStructure());

                newMesh.structure = true;
            }
        }

        this.cloneMaterialsInGroup(newMesh);

        let positionInGrid = new THREE.Vector3(x, 0, z).multiplyScalar(this.spacing);
        positionInGrid.add(this.origin);

        newMesh.position.set(positionInGrid.x, positionInGrid.y, positionInGrid.z);
        this.objects[x][z] = newMesh;

        newMesh.visible = false;

        this.group.add(newMesh);

        setTimeout(function(){ newMesh.visible = true; }, 100);

        if (newMesh.structure) {
            this.convertNearbyTiles(x, z);
        }
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
        const maxYPosition = 4;

        for (let x = 0; x < this.size; x++) {
            for (let z = 0; z < this.size; z++) {
            const originToCentre = new THREE.Vector3(this.width * 0.5, 0, this.width * 0.5);
            const gridCentre = this.camera.position.clone().sub(this.originalCameraOffset).add(originToCentre);
            const distanceToObject = this.objects[x][z].position.distanceTo(gridCentre);
            const opacity = this.distanceToOpacity(distanceToObject);

            this.setOpacityOfGroup(this.objects[x][z], opacity);
            this.objects[x][z].position.y = opacity * maxYPosition;
            }
        }
    }

    distanceToOpacity (distance) {
      const steepness = 15;

      return 1 / (1 + steepness * Math.pow(Math.E, distance - this.width * 0.5));
    }

    setOpacityOfGroup (group, opacity) {
        group.children.forEach(child => {
            this.setOpacityOfGroup(child, opacity);
        });

        if (group.material) {
            group.material.opacity = opacity;
        }
    }

    cloneMaterialsInGroup (group) {
        group.children.forEach(child => {
            this.cloneMaterialsInGroup(child);
        });

        if (group.material) {
            group.material.transparent = true;
            group.material = group.material.clone();
        }
    }

    createWFCStructure () {
        const model = new Model(null, 5, 5, 5, false, Knots);

        for (let k = 0; k < 10; k++) {
            const finished = model.Run(1);

            if (finished) {
                const mesh = model.MeshOutput();
                mesh.scale.divideScalar(3);
                mesh.translateY(8);
                mesh.translateX(-2);
                mesh.translateZ(2);
                return mesh;
            }
        }

        return new THREE.Group();
    }

    structuresNearby (x, z) {
        if (x > 0             && z > 0             && this.objects[x - 1] && this.objects[x - 1][z - 1] && this.objects[x - 1][z - 1].structure) return true;
        if (x > 0                                  && this.objects[x - 1] && this.objects[x - 1][  z  ] && this.objects[x - 1][  z  ].structure) return true;
        if (x > 0             && z < this.size - 1 && this.objects[x - 1] && this.objects[x - 1][z + 1] && this.objects[x - 1][z + 1].structure) return true;
        if (                     z > 0             && this.objects[  x  ] && this.objects[  x  ][z - 1] && this.objects[  x  ][z - 1].structure) return true;
        if (                     z < this.size - 1 && this.objects[  x  ] && this.objects[  x  ][z + 1] && this.objects[  x  ][z + 1].structure) return true;
        if (x < this.size - 1 && z > 0             && this.objects[x + 1] && this.objects[x + 1][z - 1] && this.objects[x + 1][z - 1].structure) return true;
        if (x < this.size - 1                      && this.objects[x + 1] && this.objects[x + 1][  z  ] && this.objects[x + 1][  z  ].structure) return true;
        if (x < this.size - 1 && z < this.size - 1 && this.objects[x + 1] && this.objects[x + 1][z + 1] && this.objects[x + 1][z + 1].structure) return true;

        return false;
    }

    convertNearbyTiles (x, z) {
        if (x > 0             && z > 0             && this.objects[x - 1] && this.objects[x - 1][z - 1]) this.convert(x - 1, z - 1);
        if (x > 0                                  && this.objects[x - 1] && this.objects[x - 1][  z  ]) this.convert(x - 1,   z  );
        if (x > 0             && z < this.size - 1 && this.objects[x - 1] && this.objects[x - 1][z + 1]) this.convert(x - 1, z + 1);
        if (                     z > 0             && this.objects[  x  ] && this.objects[  x  ][z - 1]) this.convert(  x  , z - 1);
        if (                     z < this.size - 1 && this.objects[  x  ] && this.objects[  x  ][z + 1]) this.convert(  x  , z + 1);
        if (x < this.size - 1 && z > 0             && this.objects[x + 1] && this.objects[x + 1][z - 1]) this.convert(x + 1, z - 1);
        if (x < this.size - 1                      && this.objects[x + 1] && this.objects[x + 1][  z  ]) this.convert(x + 1,   z  );
        if (x < this.size - 1 && z < this.size - 1 && this.objects[x + 1] && this.objects[x + 1][z + 1]) this.convert(x + 1, z + 1);
    }

    convert (x, z) {
        this.group.remove(this.objects[x][z]);
        this.addNewMesh(x, z);
    }
}

export { Grid };