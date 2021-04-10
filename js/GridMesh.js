import * as THREE from '../node_modules/three/build/three.module.js';

class GridMesh extends THREE.Mesh {
  constructor(maxSize, value) {
    function randomGeometry(maxSize, value) {
      // console.log(value);
      // //   //   console.log(maxSize);
      // //   return Math.random() > 0.5
      // //     ? randomCubeGeometry(maxSize)
      // //     : randomSphereGeometry(maxSize);
      // if (value === 0) {
      //   return randomSphereGeometry(maxSize);
      // }

      // if (value === 1) {
      //   return randomCubeGeometry(maxSize);
      // }

      // if (value === 2) {
      //   return randomCubeGeometry(maxSize);
      // }
      // if (value === 4) {
      //   return randomSphereGeometry(maxSize);
      // }

      switch (value) {
        case 0:
          return randomCubeGeometry(maxSize);
          break;
        case 1:
          return randomSphereGeometry(maxSize);
          break;
        case 2:
          return randomCubeGeometry(maxSize);
          break;
        case 3:
          return randomSphereGeometry(maxSize);
          break;
        default:
          return randomSphereGeometry(maxSize);
          break;
      }
    }

    // var seconds = 3;

    // var countdown = setInterval(function () {
    //   seconds--;
    //   if (seconds <= 0) {
    //     stopInterval();
    //     seconds = 3;
    //   }
    //   console.log(seconds);
    // }, 1000);

    // function stopInterval() {
    //   clearInterval(countdown);
    // }

    // function generateGeometry

    function randomMaterial() {
      const material = new THREE.MeshBasicMaterial();
      material.color = new THREE.Color(
        Math.random(),
        Math.random(),
        Math.random()
      );
      material.wireframe = Math.random() > 0.5 ? true : false;

      return material;
    }

    function randomCubeGeometry(maxSize) {
      const x = maxSize * Math.random();
      const y = maxSize * Math.random();
      const z = maxSize * Math.random();

      const geometry = new THREE.BoxGeometry(x, y, z);

      return geometry;
    }

    function randomSphereGeometry(maxSize) {
      const size = maxSize * Math.random();

      const geometry = new THREE.SphereGeometry(size, 20, 20);

      return geometry;
    }

    super(randomGeometry(maxSize, value), randomMaterial());

    // const geometry = new THREE.BoxGeometry(2, 2, 2);
    // const material = new THREE.MeshBasicMaterial();

    // super(geometry, material);

    this.baseColor = this.material.color.clone();

    this.baseYPosition = this.position.y;
  }
}

export { GridMesh };
