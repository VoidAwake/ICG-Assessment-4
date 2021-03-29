import * as THREE from '../node_modules/three/build/three.module.js';
import { GridMesh } from './GridMesh.js';

class Grid {
  constructor(size, spacing, camera) {
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
  }

  moveLeft() {
    console.log('Move Grid Left');
    let value = 2;

    this.origin.add(new THREE.Vector3(-this.spacing, 0, 0));

    for (let x = this.size - 1; x >= 0; x--) {
      for (let z = 0; z < this.size; z++) {
        // Destroy the left side of the grid
        if (x == this.size - 1) {
          this.group.remove(this.objects[x][z]);
        }

        // Move all grid items left
        if (x != 0) {
          this.objects[x][z] = this.objects[x - 1][z];
        } else {
          // Create new objects in left side of grid
          this.addNewMesh(x, z, value);
        }
      }
    }

    this.fadeSides();
  }

  moveRight() {
    console.log('Move Grid Right');
    let value = 1;

    this.origin.add(new THREE.Vector3(this.spacing, 0, 0));

    for (let x = 0; x < this.size; x++) {
      for (let z = 0; z < this.size; z++) {
        // Destroy the left side of the grid
        if (x == 0) {
          this.group.remove(this.objects[x][z]);
        }

        // Move all grid items left
        if (x != this.size - 1) {
          this.objects[x][z] = this.objects[x + 1][z];
        } else {
          // Create new objects in left side of grid
          this.addNewMesh(x, z, value);
        }
      }
    }

    this.fadeSides();
  }

  moveBack() {
    console.log('Move Grid Back');
    let value = 3;

    this.origin.add(new THREE.Vector3(0, 0, -this.spacing));

    for (let x = 0; x < this.size; x++) {
      for (let z = this.size - 1; z >= 0; z--) {
        // Destroy the left side of the grid
        if (z == this.size - 1) {
          this.group.remove(this.objects[x][z]);
        }

        // Move all grid items left
        if (z != 0) {
          this.objects[x][z] = this.objects[x][z - 1];
        } else {
          // Create new objects in left side of grid
          this.addNewMesh(x, z, value);
        }
      }
    }

    this.fadeSides();
  }

  moveForward() {
    console.log('Move Grid Forward');

    this.origin.add(new THREE.Vector3(0, 0, this.spacing));
    let value = 0;

    for (let x = 0; x < this.size; x++) {
      for (let z = 0; z < this.size; z++) {
        // Destroy the left side of the grid
        if (z == 0) {
          this.group.remove(this.objects[x][z]);
        }

        // Move all grid items left
        if (z != this.size - 1) {
          this.objects[x][z] = this.objects[x][z + 1];
        } else {
          // Create new objects in left side of grid
          this.addNewMesh(x, z, value);
        }
      }
    }

    this.fadeSides();
  }

  addNewMesh(x, z, value) {
    const newMesh = new GridMesh(1, value);

    let positionInGrid = new THREE.Vector3(x, 0, z).multiplyScalar(
      this.spacing
    );
    positionInGrid.add(this.origin);

    newMesh.position.set(positionInGrid.x, positionInGrid.y, positionInGrid.z);
    this.objects[x][z] = newMesh;

    newMesh.visible = false;

    this.group.add(newMesh);

    setTimeout(function () {
      newMesh.visible = true;
    }, 100);
  }

  update() {
    this.updateCameraOffsetDelta();

    this.updateClampedCameraOffsetDelta();

    this.fadeSides();

    // Move the grid

    if (this.clampedCameraOffsetDelta.x > 1) {
      this.moveLeft();

      this.baseCameraOffset.add(new THREE.Vector3(-this.spacing, 0, 0));
    }

    if (this.clampedCameraOffsetDelta.x < -1) {
      this.moveRight();

      this.baseCameraOffset.add(new THREE.Vector3(this.spacing, 0, 0));
    }

    if (this.clampedCameraOffsetDelta.z > 1) {
      this.moveBack();

      this.baseCameraOffset.add(new THREE.Vector3(0, 0, -this.spacing));
    }

    if (this.clampedCameraOffsetDelta.z < -1) {
      this.moveForward();

      this.baseCameraOffset.add(new THREE.Vector3(0, 0, this.spacing));
    }
  }

  getCameraOffset() {
    let cameraOffset = this.camera.position.clone();
    cameraOffset.sub(this.group.position);
    return cameraOffset;
  }

  updateCameraOffsetDelta() {
    let cameraOffsetDelta = this.baseCameraOffset.clone();
    cameraOffsetDelta.sub(this.getCameraOffset());
    this.cameraOffsetDelta = cameraOffsetDelta;
  }

  updateClampedCameraOffsetDelta() {
    let clampedCameraOffsetDelta = this.cameraOffsetDelta.clone();
    clampedCameraOffsetDelta.divideScalar(this.spacing);
    this.clampedCameraOffsetDelta = clampedCameraOffsetDelta;
  }

  fadeSides() {
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
      opacities[0][i] = Math.max(opacities[0][i], 1 - positiveClampedX);
      opacities[1][i] = Math.max(opacities[1][i], -1 * negativeClampedX);

      // Right side
      opacities[this.size - 1][i] = Math.max(
        opacities[this.size - 1][i],
        1 - -1 * negativeClampedX
      );
      opacities[this.size - 2][i] = Math.max(
        opacities[this.size - 2][i],
        positiveClampedX
      );

      // Back side
      opacities[i][0] = Math.max(opacities[i][0], 1 - positiveClampedZ);
      opacities[i][1] = Math.max(opacities[i][1], -1 * negativeClampedZ);

      // Forward side
      opacities[i][this.size - 1] = Math.max(
        opacities[i][this.size - 1],
        1 - -1 * negativeClampedZ
      );
      opacities[i][this.size - 2] = Math.max(
        opacities[i][this.size - 2],
        positiveClampedZ
      );
    }

    const maxYPosition = -4;

    for (let i = 0; i < this.size; i++) {
      // Apply opacities to objects
      // Left side
      this.objects[0][i].material.color = this.objects[0][i].baseColor
        .clone()
        .lerpHSL(new THREE.Color(0x000000), opacities[0][i]);
      this.objects[1][i].material.color = this.objects[1][i].baseColor
        .clone()
        .lerpHSL(new THREE.Color(0x000000), opacities[1][i]);

      // Right side
      this.objects[this.size - 1][i].material.color = this.objects[
        this.size - 1
      ][i].baseColor
        .clone()
        .lerpHSL(new THREE.Color(0x000000), opacities[this.size - 1][i]);
      this.objects[this.size - 2][i].material.color = this.objects[
        this.size - 2
      ][i].baseColor
        .clone()
        .lerpHSL(new THREE.Color(0x000000), opacities[this.size - 2][i]);

      // Back side
      this.objects[i][0].material.color = this.objects[i][0].baseColor
        .clone()
        .lerpHSL(new THREE.Color(0x000000), opacities[i][0]);
      this.objects[i][1].material.color = this.objects[i][1].baseColor
        .clone()
        .lerpHSL(new THREE.Color(0x000000), opacities[i][1]);

      // Forward side
      this.objects[i][this.size - 1].material.color = this.objects[i][
        this.size - 1
      ].baseColor
        .clone()
        .lerpHSL(new THREE.Color(0x000000), opacities[i][this.size - 1]);
      this.objects[i][this.size - 2].material.color = this.objects[i][
        this.size - 2
      ].baseColor
        .clone()
        .lerpHSL(new THREE.Color(0x000000), opacities[i][this.size - 2]);

      // Set Y positions
      // Left side
      this.objects[0][i].position.y = opacities[0][i] * maxYPosition;
      this.objects[1][i].position.y = opacities[1][i] * maxYPosition;

      // Right side
      this.objects[this.size - 1][i].position.y =
        opacities[this.size - 1][i] * maxYPosition;
      this.objects[this.size - 2][i].position.y =
        opacities[this.size - 2][i] * maxYPosition;

      // Back side
      this.objects[i][0].position.y = opacities[i][0] * maxYPosition;
      this.objects[i][1].position.y = opacities[i][1] * maxYPosition;

      // Forward side
      this.objects[i][this.size - 1].position.y =
        opacities[i][this.size - 1] * maxYPosition;
      this.objects[i][this.size - 2].position.y =
        opacities[i][this.size - 2] * maxYPosition;
    }
  }
}

export { Grid };
