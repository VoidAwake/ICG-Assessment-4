import * as THREE from '../node_modules/three/build/three.module.js';
import { Grid } from "./Grid.js";
import { CameraController } from "./CameraController.js";
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { GridToggles } from "./GridToggles.js";

var currentBiome = 0;
var clock = new THREE.Clock();
clock.start();
setup();

async function setup () {
  const scene = new THREE.Scene();
  
  const renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;

  const ratio = window.innerWidth / window.innerHeight;

  const camera = new THREE.PerspectiveCamera(
      55,
      ratio,
      0.1,
      1000
  );

  const sphereRadius = 50;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(
    sphereRadius,
    sphereWidthDivisions,
    sphereHeightDivisions
  );

  const sphereMat = new THREE.MeshPhongMaterial({color : '#CA8'});
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(-sphereRadius - 1, 100, 50);
  scene.add(mesh);

  const color = 0xffffff;
  const intensity = 4;
  const light = new THREE.PointLight(color, intensity);
  light.castShadow = true;
  light.position.set(100, 100, -10);
  scene.add(light);

  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500;

  const helper = new THREE.PointLightHelper(light);
  scene.add(helper);

  const loader = new GLTFLoader();

  function loadModel (url) {
    return new Promise((resolve, reject) => {
      loader.load(url, data => resolve(data), null, reject);
    });
  }

  const modelUrls = [
    './Assets/AurynSky/Forest Pack/Models/Forestground01blender.glb',
    './Assets/AurynSky/Forest Pack/Models/ForestGrassBlender.gltf',
    './Assets/AurynSky/Forest Pack/Models/ForestPineTreeBlender.gltf',
    './Assets/AurynSky/Forest Pack/Models/ForestTreeSmallBlender.glb',
    './Assets/AurynSky/Forest Pack/Models/ForestCrateBlender.glb',
    './Assets/AurynSky/WinterArena/Models/SnowRockGroundBlender.glb',
    './Assets/AurynSky/WinterArena/Models/SnowPineTreeBlender.glb',
    './Assets/AurynSky/WinterArena/Models/SnowAppleTreeBlender.glb',
    './Assets/AurynSky/WinterArena/Models/SnowTorchBlender.glb',
    './Assets/AurynSky/WinterArena/Models/SnowFlagBlender.glb',
    './Assets/AurynSky/WinterArena/Models/IceBlockBlender.glb',
    './Assets/AurynSky/WinterArena/Models/IcePineTreeBlender.glb',
    './Assets/AurynSky/WinterArena/Models/IceSmallTreeBlender.glb',
    './Assets/AurynSky/WinterArena/Models/IceGrassBlender.glb',
    './Assets/AurynSky/Dungeon Pack/Models/DungeonBlockBlender.glb',
    './Assets/AurynSky/Dungeon Pack/Models/DungeonBannerBlender.glb',
  ];

  const asyncLoadModel = async url => {
    const model = await loadModel(url);

    const newGroup = new THREE.Group();

    for (const child of model.scene.children) {
      if (child.type == "Mesh") {
        child.material.transparent = true;
        child.receiveShadow = true;

        newGroup.add(child.clone());
      }
    }

    return newGroup;
  }

  const getModels = async () => {
      return Promise.all(modelUrls.map(url => asyncLoadModel(url)));
  }

  const updateModels = grid => {
    if (clock.getElapsedTime() > 5) {
      console.log("Change Biome");

      clock.stop();
      clock.start();

      currentBiome++;
      if (currentBiome == biomes.length) {
        currentBiome = 0;
      }

      grid.models = biomes[currentBiome];
    }
  }

  const models = await getModels();

  const biomes = [
    [
      models[0],
      models[1],
      models[2],
      models[3],
      models[4],
    ],
    [
      models[5],
      models[6],
      models[7],
      models[8],
      models[9],
      models[10],
      models[11],
      models[12],
      models[13],
    ],
  ];

  // var light = new THREE.HemisphereLight(0xffffff, 0x000000, 4);
  // scene.add(light); 

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const grid = new Grid(14, 2, camera, biomes[currentBiome]);
  scene.add(grid.group);

  const cameraController = new CameraController(
    scene,
    camera,
    grid,
    100,
    new THREE.Vector3(0, 6, 0),
    new THREE.Vector3(0, 20, 20)
  );

  const gridToggles = new GridToggles(camera, cameraController, grid, light, grid);

  function animate () {
      requestAnimationFrame(animate);

      updateModels(grid);

      cameraController.update();

      grid.update();

      renderer.render(scene, camera);
  }

  animate();
}