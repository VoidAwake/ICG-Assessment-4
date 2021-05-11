import * as THREE from "../Dependencies/three.module.js";
import {getScene} from "./setup.js";

function build() {
    
    var material_box = new THREE.MeshBasicMaterial();
				material_box.color=  new THREE.Color(0,1,0);
				material_box.wireframe=true;
				var geometry_box = new THREE.BoxGeometry(400,0,400, 64,64, 64);

				var BoxMesh = new THREE.Mesh(geometry_box,material_box);
				BoxMesh.position.y=0;
				getScene().add(BoxMesh);
}

export {build};
