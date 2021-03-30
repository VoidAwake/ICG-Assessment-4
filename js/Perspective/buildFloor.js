import * as THREE from "../three.module.js";
import {getScene} from "./setup.js";

function build() {
    
    var material_box = new THREE.MeshBasicMaterial();
				material_box.color=  new THREE.Color(1,0,0);
				material_box.wireframe=true;
				var geometry_box = new THREE.BoxGeometry(400,0.1,400,32,1,32);

				var BoxMesh = new THREE.Mesh(geometry_box,material_box);
				BoxMesh.position.y=-1;
				getScene().add(BoxMesh);
}

export {build};
