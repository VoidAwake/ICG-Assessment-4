import * as THREE from '../node_modules/three/build/three.module.js';
import { Grid } from "./Grid.js";
import { CameraController } from "./CameraController.js";
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { Toggles } from "./Toggles.js";
import * as dat from "../node_modules/dat.gui/build/dat.gui.module.js";



const scene = new THREE.Scene();


function getScene() {
  return this.scene;
}

setup();

async function setup () {
  var objGroup = new THREE.Group();
  const ratio = window.innerWidth / window.innerHeight;

  const camera = new THREE.PerspectiveCamera(
      100,
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
      y_position: 25,
      z_position: 30,
      SetCamera: function() {
        camera.position.set(this.x_position,this.y_position,this.z_position);

      },
      ResetCamera: function () {
        camera.position.set(13,25,30);
      },
    };

    var object2 = {
      grid_size: 7,
      grid_spacing: 4,
      ResetGrid: function () {
        const grid = new Grid(this.grid_size, this.grid_spacing, camera, gridModel);
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
    folder1.add(object1, 'y_position', -100,100,1);
    folder1.add(object1, 'z_position', -100,100,1);
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

  
  // Models 

  const loader = new GLTFLoader();


  function loadModel () {
    return new Promise((resolve, reject) => {
      loader.load(
        './Assets/AurynSky/Forest Pack/Models/Forestground01blender.glb',
        data => resolve(data), null, reject
      );
    });

  }



  var light = new THREE.HemisphereLight(0xffffff, 0x000000, 4);
  scene.add(light); 

  camera.position.set(13, 25, 30);
  camera.lookAt(13, 1, 15);

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const cameraController = new CameraController(camera, 100);

  const gridScene = await loadModel();
  const gridModel = gridScene.scene.children[2];

  gridModel.material.transparent = true;

  const grid = new Grid(10, 4, camera, gridModel);
  scene.add(grid.group);

  function animate () {
      requestAnimationFrame(animate);

      cameraController.update();

      grid.update();

      renderer.render(scene, camera);
  }

animate()
}

export {getScene};