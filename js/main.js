import * as THREE from './Dependencies/three.module.js';
import { Grid } from './Grid.js';
import { CameraController } from './CameraController.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';

function main() {
  const scene = new THREE.Scene();
  const ratio = window.innerWidth / window.innerHeight;

  const camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);

  camera.position.set(13, 25, 30);
  camera.lookAt(13, 0, 15);

  const renderer = new THREE.WebGLRenderer();
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(
    sphereRadius,
    sphereWidthDivisions,
    sphereHeightDivisions
  );
  const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' });
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  scene.add(mesh);

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const cameraController = new CameraController(camera, 100);
  const grid = new Grid(7, 4, camera);
  scene.add(grid.group);

  function animate() {
    requestAnimationFrame(animate);

    cameraController.update();

    grid.update();

    renderer.render(scene, camera);
  }

  animate();
}

main();
