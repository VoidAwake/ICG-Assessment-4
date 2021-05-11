import * as THREE from './three.module.js';

class GridMesh extends THREE.Mesh {
    constructor (maxSize) {
        function randomGeometry (maxSize) {
            return Math.random() > 0.5 ? randomCubeGeometry(maxSize) : randomSphereGeometry(maxSize);
        }
    
        function randomMaterial () {
            const material = new THREE.MeshBasicMaterial();
            material.color = new THREE.Color(Math.random(), Math.random(), Math.random());
            material.wireframe = Math.random() > 0.5 ? true : false;
    
            return material;
        }
    
        function randomCubeGeometry (maxSize) {
            const x = maxSize * Math.random();
            const y = maxSize * Math.random();
            const z = maxSize * Math.random();
    
            const geometry = new THREE.BoxGeometry(x, y, z);
    
            return geometry;
        }
        
        function randomSphereGeometry (maxSize) {
            const size = maxSize * Math.random();

            const geometry = new THREE.SphereGeometry(size, 20, 20);
        
            return geometry;
        }

        super(randomGeometry(maxSize), randomMaterial());

        // const geometry = new THREE.BoxGeometry(2, 2, 2);
        // const material = new THREE.MeshBasicMaterial();

        // super(geometry, material);

        this.baseColor = this.material.color.clone();

        this.baseYPosition = this.position.y;
    }
}

export {GridMesh};