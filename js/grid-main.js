import * as THREE from '../node_modules/three/build/three.module.js';
import { Grid } from "./Grid.js";
import { CameraController } from "./CameraController.js";
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from "../node_modules/dat.gui/build/dat.gui.module.js";


setup();

async function setup () {
  const scene = new THREE.Scene();

  const ratio = window.innerWidth / window.innerHeight;

  const camera = new THREE.PerspectiveCamera(
      120,
      ratio,
      0.1,
      1000
  );


  var gui = new dat.GUI({ load: getPresetJSON(), preset: 'Preset1' });
    var object1 = {
      type1_boolean: false,
      type2_string: 'string',
      type3_number: 0,
      x_position: 13,
      y_position: 6,
      z_position: 14,
      fov: 45,
      SetCamera: function() {
        camera.position.set(this.x_position,this.y_position,this.z_position);
        camera.fov = this.fov;
        camera.updateProjectionMatrix();
      },
      ResetCamera: function () {

        camera.position.set(13, 25, 30);
        camera.lookAt(13,25,15);
        // camera.fov = 120;
        // camera.updateProjectionMatrix();

      },
    };

      // 3rd person
  // camera.position.set(13, 25, 30);
  // camera.lookAt(13, 0, 15);

  // // first person
  // camera.position.set(13,6,14);
  // camera.lookAt(13,0,-10)

    var object2 = {
      grid_size: 7,
      grid_spacing: 2,
      ResetGrid: function () {
        const grid = new Grid(this.grid_size, this.grid_spacing, camera, models);
        scene.add(grid.group);

      },
    };

    console.log(object1.x_position)

    // dat.GUI will modify colors in the format defined by their initial value.

    // saveValues: gui.remember must be executed before gui.add
    gui.remember(object1);
    gui.remember(object2);

    // setController: boolean, string, number, function


    var folder1 = gui.addFolder('Camera Settings');
    folder1.add(object1, 'x_position', -100,100,1);
    folder1.add(object1, 'y_position', 6,50,1);
    folder1.add(object1, 'z_position', -100,100,1);
    folder1.add(object1, 'fov', 45, 100, 1);
    folder1.add(object1, 'SetCamera');
    folder1.add(object1, 'ResetCamera');

    // collapse folder1

    var folder2 = gui.addFolder('Grid Settings');
    folder2.add(object2, 'grid_size', 1,30,1);
    folder2.add(object2, 'grid_spacing', 7);
    folder2.add(object2, 'ResetGrid');




    // presetJSON: created from pressing the gear.
    function getPresetJSON() {
      return {
        preset: 'Default',
        closed: false,
        remembered: {
          Default: {
            0: {
              type1_boolean: false,
              type2_string: 'string',
              type3_number: 0,
            },
            1: {
              string1: 'string1',
              string2: 'string2',
            },
          },
          Preset1: {
            0: {
              type1_boolean: true,
              type2_string: 'string123',
              type3_number: -2.2938689217758985,
            },
            1: {
              string1: 'string_2',
              string2: 'string_3',
            },
          },
        },
        folders: {
          FolderNameA: {
            preset: 'Default',
            closed: false,
            folders: {},
          },
          FolderNameB: {
            preset: 'Default',
            closed: false,
            folders: {},
          },
          FolderNameC: {
            preset: 'Default',
            closed: false,
            folders: {},
          },
        },
      };
    }

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
    './Assets/AurynSky/Dungeon Pack/Models/DungeonBannerBlender.glb'
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
    return Promise.all(modelUrls.map(url => asyncLoadModel(url)));
  }

  const models = await getModels();

  console.log(models);

  var light = new THREE.HemisphereLight(0xffffff, 0x000000, 4);
  scene.add(light); 

  // 3rd person
  // camera.position.set(13, 25, 30);
  // camera.lookAt(13, 0, 15);

  // first person
  camera.position.set(13,6,14);
  camera.lookAt(13,0,-10)

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const cameraController = new CameraController(camera, 100);

  const grid = new Grid(14, 2, camera, models);
  scene.add(grid.group);

  function animate () {
      requestAnimationFrame(animate);

      cameraController.update();

      grid.update();

      renderer.render(scene, camera);
  }

  animate();
}