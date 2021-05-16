import * as THREE from '../node_modules/three/build/three.module.js';
import { Grid } from "./Grid.js";
import { CameraController } from "./CameraController.js";
import { Model } from "../node_modules/@voidawake/3d-wfc-js/Model.js";
import { Knots } from "../node_modules/@voidawake/3d-wfc-js/data/Knots.js";
import { WFCModel } from "../WFCModel.js";

// Before anything else we need to load all the models

async function main() {
    const gltfData = await modelLoader(URL),
 
    model = gltf.scene;
    scene.add(model);
 
    dosomething(model);
 }

const scene = new THREE.Scene();
const ratio = window.innerWidth / window.innerHeight;

const camera = new THREE.PerspectiveCamera(
    45,
    ratio,
    0.1,
    1000
);

camera.position.set(13, 25, 30);
camera.lookAt(13, 0, 15);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const cameraController = new CameraController(camera, 100);

const grid = new Grid(30, 1, camera);
scene.add(grid.group);

function animate () {
    requestAnimationFrame(animate);

    cameraController.update();

    grid.update();

    renderer.render(scene, camera);
}



const model = new Model(null, 5, 5, 5, true, WFCModel);
// const model = new Model("only turns", 3, 3, 3, true, Knots);

for (let k = 0; k < 10; k++)
{
	const finished = model.Run(1);
	if (finished)
	{
		console.log("DONE");
        const mesh = model.MeshOutput();
        mesh.scale.divideScalar(3);
        scene.add(mesh);
		break;
	}
	else {
		console.log("CONTRADICTION");
	}
}

const light = new THREE.AmbientLight( 0x404040 );
scene.add( light );

const pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
pointLight.position.set( 30, 30, 30 );
scene.add( pointLight );


animate();