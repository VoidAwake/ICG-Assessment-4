import * as THREE from '../node_modules/three/build/three.module.js';
import { Grid } from './Grid.js';
import { CameraController } from './CameraController.js';

const scene = new THREE.Scene();
const ratio = window.innerWidth / window.innerHeight;

const camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);

camera.position.set(13, 25, 30);
camera.lookAt(13, 0, 15);

var rotationSpeed;
var rotationSpeed2;

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const cameraController = new CameraController(camera, 100);

const grid = new Grid(7, 4, camera);
scene.add(grid.group);

var gui = new dat.GUI({ load: getPresetJSON(), preset: 'Preset1' });

var object1 = {
  type1_boolean: false,
  type2_string: 'string',
  type3_number: 0,
  type4_function: function () {
    alert('This is a function.');
  },
};

var object2 = {
  string1: 'string1',
  string2: 'string2',
};

var object3 = {
  color0: '#ffae23', // CSS string
  color1: [0, 128, 255], // RGB array
  color2: [0, 128, 255, 0.3], // RGB with alpha
  color3: { h: 350, s: 0.9, v: 0.3 }, // Hue, saturation, value
};
// dat.GUI will modify colors in the format defined by their initial value.

// saveValues: gui.remember must be executed before gui.add
gui.remember(object1);
gui.remember(object2);

// setController: boolean, string, number, function
gui.add(object1, 'type1_boolean');
gui.add(object1, 'type2_string');

var folder1 = gui.addFolder('FolderNameA');
folder1.add(object1, 'type3_number', -5, 5);
folder1.add(object1, 'type4_function');

// collapse folder1
folder1.close();

var folder2 = gui.addFolder('FolderNameB');
folder2.add(object2, 'string1', {
  key1: 'string_1',
  key2: 'string_2',
  key3: 'string_3',
});
folder2.add(object2, 'string2', ['string_1', 'string_2', 'string_3']);

var folder3 = gui.addFolder('FolderNameC');
folder3.addColor(object3, 'color0');
folder3.addColor(object3, 'color1');
folder3.addColor(object3, 'color2');
folder3.addColor(object3, 'color3');

// expand folder3
folder3.open();

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

function animate() {
  requestAnimationFrame(animate);

  cameraController.update();

  grid.update();

  renderer.render(scene, camera);
}

animate();
