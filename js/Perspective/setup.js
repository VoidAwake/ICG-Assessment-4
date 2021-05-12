import { build } from './buildFloor.js';
import { PointerLockControls } from '../Dependencies/PointerLockControls.js';
import * as THREE from '../Dependencies/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
//import {loadModel} from "../loadModels.js";
import {FBXLoader} from "../Dependencies/FBXLoader.js";


var camera, scene, renderer, controls;
var controlsEnabled = true;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var onGround = true;
var rising = false;
var falling = false;
var called = false;
var timeS = 0;
var clock;
var loader = new FBXLoader();
//var playerGeo = new THREE.CylinderGeometry(5, 5, 3, 10,10,FALSE,4,4);
//var playerMaterial = new THREE.MeshBasicMaterial()
//var playerMesh = new THREE.Mesh(playerGeo, playerMaterial);

function init() {
  clock = new THREE.Clock();
  clock.start();
  var ratio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(45, ratio, 0.00001, 1000);

  var Pos = new THREE.Vector3(0, 2, 0);
  camera.position.set(Pos.x, Pos.y, Pos.z);
  var Dir = new THREE.Vector3(0, 0, 1);
  camera.lookAt(Dir.x, Dir.y, Dir.z);
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  loadModel("../Assets/Darth_Artisan/Free_Trees/Meshes/Oak_Tree.fbx");
  controls = new PointerLockControls(camera, renderer.domElement);
  //	scene.add(playerMesh);
  document.addEventListener(
    'click',
    function () {
      controls.lock();
    },
    false
  );

  controls.enabled = true;
  scene.add(controls.getObject());

  var onKeyDown = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;
      case 32:
        //	called = true;
        //		rising = true;
        break;
    }
  };
  var time = 0;
  var delta = 0;

  var onKeyUp = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  window.addEventListener('resize', onWindowResize, false);

  {
    const planeSize = 40;

    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      'https://threejsfundamentals.org/threejs/resources/images/checker.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);
  }
  {
    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
    scene.add(mesh);
  }
  {
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
  }

  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
  }

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 10, 0);
    scene.add(light);

    const helper = new THREE.PointLightHelper(light);
    scene.add(helper);

    function updateLight() {
      helper.update();
    }

    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);
    gui.add(light, 'distance', 0, 40).onChange(updateLight);

    makeXYZGUI(gui, light.position, 'position');
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  build();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function getScene() {
  return scene;
}

function getControls() {
  return controls;
}
var step = 1;
var objects = new THREE.Group();

function loadModel(model) {
    
    loader.load( model, function ( object ) {
		console.log("load");
        object.castShadow = true;
        scene.add( object );
        object.position.y = 0;
        object.scale.multiplyScalar(5);
		objects.add(object);
    } );
}

function animate() {
  requestAnimationFrame(animate);

  for ( var i = 0; i < objects.children.length; i ++ ) 
  {
	  if (objects.children[i].position.y < 2){
		  objects.children[i].position.y += 0.02 * clock.getDelta();
		  console.log(objects.children[i].position.y);
	  }
  }


  if (controlsEnabled == true) {
    var time = performance.now();
    var delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveLeft) - Number(moveRight);
    //direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
    if (onGround == false) {
      velocity.x /= 1.1;
      velocity.z /= 1.1;
    }

    controls.getObject().translateX(velocity.x * delta);
    controls.getObject().translateZ(velocity.z * delta);

    prevTime = time;
  }

  if (called == true) {
    jumpRise();
  } else {
    step = 1;
    controls.getObject().position.y = 2;
  }

  renderer.render(scene, camera);
}

function jumpRise() {
  var delta = clock.getDelta();
  if (controls.getObject().position.y < 10 && rising == true) {
    controls.getObject().position.y += 1 / step;
    step += 0.3;
  } else if (controls.getObject().position.y > 9 && falling == false) {
    rising = false;
    falling = true;
  } else if (controls.getObject().position.y < 1 && falling == true) {
    called = false;
    falling = false;
    rising = false;
  } else if (falling == true) {
    controls.getObject().position.y -= 1 / step;
    step -= 0.1;
  }
  console.log(controls.getObject().position.y);
}

function rise(object) {
	requestAnimationFrame(rise(object));
  
    if (object.position.y < 2) {
        object.position.y += 0.02 * clock.getDelta();
    }
   
    
}

init();
animate();

export { getScene, getControls };
