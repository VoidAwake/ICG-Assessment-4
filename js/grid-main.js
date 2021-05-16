import * as THREE from '../node_modules/three/build/three.module.js';
import { Grid } from "./Grid.js";
import { CameraController } from "./CameraController.js";
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

var clock = new THREE.Clock();
clock.start();
setup();


async function setup () {
  const scene = new THREE.Scene();
  
  

  const ratio = window.innerWidth / window.innerHeight;

  const camera = new THREE.PerspectiveCamera(
      45,
      ratio,
      0.1,
      1000
  );
  camera.position.set(0, 10, 0);

  const loader = new GLTFLoader();

  function loadModel (url) {
    return new Promise((resolve, reject) => {
      loader.load(url, data => resolve(data), null, reject);
    });
  }

  const modelUrlsForest = [
    './Assets/AurynSky/Forest Pack/Models/Forestground01blender.glb',
    './Assets/AurynSky/Forest Pack/Models/ForestGrassBlender.gltf',
    './Assets/AurynSky/Forest Pack/Models/ForestPineTreeBlender.gltf',
    './Assets/AurynSky/Forest Pack/Models/ForestTreeSmallBlender.glb',
    './Assets/AurynSky/Forest Pack/Models/ForestCrateBlender.glb',

   // './Assets/AurynSky/Dungeon Pack/Models/DungeonBlockBlender.glb',
    //'./Assets/AurynSky/Dungeon Pack/Models/DungeonBannerBlender.glb'
  ];

  const modelUrlsSnow = [

    './Assets/AurynSky/WinterArena/Models/SnowRockGroundBlender.glb',
    './Assets/AurynSky/WinterArena/Models/SnowPineTreeBlender.glb',
    './Assets/AurynSky/WinterArena/Models/SnowAppleTreeBlender.glb',
    './Assets/AurynSky/WinterArena/Models/SnowTorchBlender.glb',
    './Assets/AurynSky/WinterArena/Models/SnowFlagBlender.glb',
    './Assets/AurynSky/WinterArena/Models/IceBlockBlender.glb',
    './Assets/AurynSky/WinterArena/Models/IcePineTreeBlender.glb',
    './Assets/AurynSky/WinterArena/Models/IceSmallTreeBlender.glb',
    './Assets/AurynSky/WinterArena/Models/IceGrassBlender.glb',

  ];

  const asyncLoadModel = async url => {
    const model = await loadModel(url);

    const newGroup = new THREE.Group();

    for (const child of model.scene.children) {
      if (child.type == "Mesh") {
        child.material.transparent = true;

        newGroup.add(child.clone());
      }
    }

    return newGroup;
  }

  const getModels = async () => {
    console.log("test");
    if (clock.getElapsedTime() > 10) {

      clock.stop();
      clock.start();
      return Promise.all(modelUrlsForest.map(url => asyncLoadModel(url)));
    
    }
    else {
      return Promise.all(modelUrlsSnow.map(url => asyncLoadModel(url)));
    }
  }

  const updateModels = async (grid) => {
    console.log("test");
    if (clock.getElapsedTime() > 10) {

      clock.stop();
      clock.start();
      
      grid.models =  Promise.all(modelUrlsForest.map(url => asyncLoadModel(url)));
    
    }
    else {
      grid.models = Promise.all(modelUrlsSnow.map(url => asyncLoadModel(url)));
    }
  }

  const models = await getModels();

  console.log(models);

  var light = new THREE.HemisphereLight(0xffffff, 0x000000, 4);
  scene.add(light); 

  //3rd person
  //camera.position.set(13, 25, 30);
  //camera.lookAt(13, 0, 15);


  //first person
  camera.position.set(13, 6, 20);
  camera.lookAt(13, 0, -10);

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const cameraController = new CameraController(camera, 100);

  const grid = new Grid(14, 2, camera, models);
  scene.add(grid.group);

  function animate () {
      requestAnimationFrame(animate);
     //console.log(clock.getElapsedTime());
      if (clock.getElapsedTime() > 10) {
       updateModels(grid);
      }

      cameraController.update();

      grid.update();

      renderer.render(scene, camera);
  }

  animate();
}