import * as THREE from './three.module.js';
import { Grid } from "./Grid.js";
import { CameraController } from "./CameraController.js";
//import { FBXLoader } from './jsm/loaders/FBXLoader.js';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
//import {loadModel} from "./loadModel.js"
import { Toggles } from "./Toggles.js";

const toggles = new Toggles();

const scene = new THREE.Scene();


function getScene() {
  return this.scene;
}

setup();

async function setup () {
  var objGroup = new THREE.Group();
  const ratio = window.innerWidth / window.innerHeight;

  const camera = new THREE.PerspectiveCamera(
      45,
      ratio,
      0.1,
      1000
  );



  
  // Models 

  const loader = new GLTFLoader();


  function loadModel () {
    return new Promise((resolve, reject) => {
      loader.load(
        './Assets/AurynSky/Forest Pack/Models/Forestground01blender.glb',
        data => resolve(data), null, reject
      );
    });

    //   //return new Promise((resolve) => { 

    // //Plain forest block
    // var loader = new GLTFLoader();
    //   //for (let i = 0; i < 5; i++) {
    //     return new Promise(resolve => {
    //       new GLTFLoader().load('./Assets/AurynSky/Forest Pack/Models/Forestground01blender.glb', function ( gltf ) {
        
    //   //loader.loadAsync( './Assets/AurynSky/Forest Pack/Models/Forestground01blender.glb', function ( gltf ) {
        

    //   var forestBlock = gltf.scene;  
    //   //console.log(forestBlock);
    //   // forestBlock.position.set(0,0,i*2);
    //   //console.log(forestBlock.position);
    //   //objGroup.add(forestBlock);
    // //  console.log(forestBlock);
    
    //   return Promise.resolve(); 
      

    // }, undefined, function ( error ) {

    //   console.error( error );

    // } );
    // //scene.add(objGroup);
    // // } 

    // });
  }


  /* //Forest block with grass
    var loader = new GLTFLoader();
    for (let i = 0; i < 5; i++) {
    loader.load( './Assets/AurynSky/Forest Pack/Models/ForestGrassBlender.gltf', function ( gltf ) {

    var forestGrass= gltf.scene;  
    forestGrass.position.set(3,0,i*2);
  objGroup.add(forestGrass);

  }, undefined, function ( error ) {

    console.error( error );

  } );
  scene.add(objGroup);
    } 

    //Forest block with pinetree
    var loader = new GLTFLoader();
    for (let i = 0; i < 5; i++) {
    loader.load( './Assets/AurynSky/Forest Pack/Models/ForestPineTreeBlender.gltf', function ( gltf ) {

    var forestPineTree= gltf.scene;  
    forestPineTree.position.set(6,0,i*2);
  objGroup.add(forestPineTree);

  }, undefined, function ( error ) {

    console.error( error );

  } );
  scene.add(objGroup);
    } 

    //Forest block with small tree
    var loader = new GLTFLoader();
    for (let i = 0; i < 5; i++) {
    loader.load( './Assets/AurynSky/Forest Pack/Models/ForestTreeSmallBlender.glb', function ( gltf ) {

    var forestSmallTree= gltf.scene;  
    forestSmallTree.position.set(9,0,i*2);
  objGroup.add(forestSmallTree);

  }, undefined, function ( error ) {

    console.error( error );

  } );
  scene.add(objGroup);
    } 


    //Forest crate
    var loader = new GLTFLoader();
    for (let i = 0; i < 5; i++) {
    loader.load( './Assets/AurynSky/Forest Pack/Models/ForestCrateBlender.glb', function ( gltf ) {

    var forestCrate= gltf.scene;  
    forestCrate.position.set(12,0,i*2);
  objGroup.add(forestCrate);

  }, undefined, function ( error ) {

    console.error( error );

  } );
  scene.add(objGroup);
    } 

      //Snow Block
      var loader = new GLTFLoader();
      for (let i = 0; i < 5; i++) {
      loader.load( './Assets/AurynSky/WinterArena/Models/SnowRockGroundBlender.glb', function ( gltf ) {
    
      var snowBlock= gltf.scene;  
      snowBlock.position.set(15,0,i*2);
    objGroup.add(snowBlock);
    
    }, undefined, function ( error ) {
    
      console.error( error );
    
    } );
    scene.add(objGroup);
      } 


      //Snow pinetree
      var loader = new GLTFLoader();
      for (let i = 0; i < 5; i++) {
      loader.load( './Assets/AurynSky/WinterArena/Models/SnowPineTreeBlender.glb', function ( gltf ) {
    
      var snowPineTree= gltf.scene;  
      snowPineTree.position.set(18,0,i*2);
    objGroup.add(snowPineTree);
    
    }, undefined, function ( error ) {
    
      console.error( error );
    
    } );
    scene.add(objGroup);
      } 


      //Snow apple tree
      var loader = new GLTFLoader();
      for (let i = 0; i < 5; i++) {
      loader.load( './Assets/AurynSky/WinterArena/Models/SnowAppleTreeBlender.glb', function ( gltf ) {
    
      var snowAppleTree= gltf.scene;  
      snowAppleTree.position.set(21,0,i*2);
    objGroup.add(snowAppleTree);
    
    }, undefined, function ( error ) {
    
      console.error( error );
    
    } );
    scene.add(objGroup);
      } 


        //Snow torch
        var loader = new GLTFLoader();
        for (let i = 0; i < 5; i++) {
        loader.load( './Assets/AurynSky/WinterArena/Models/SnowTorchBlender.glb', function ( gltf ) {
      
        var snowTorch= gltf.scene;  
        snowTorch.position.set(24,0,i*2);
      objGroup.add(snowTorch);
      
      }, undefined, function ( error ) {
      
        console.error( error );
      
      } );
      scene.add(objGroup);
        } 

        //Snow flag
        var loader = new GLTFLoader();
        for (let i = 0; i < 5; i++) {
        loader.load( './Assets/AurynSky/WinterArena/Models/SnowFlagBlender.glb', function ( gltf ) {
      
        var snowFlag= gltf.scene;  
        snowFlag.position.set(27,0,i*2);
      objGroup.add(snowFlag);
      
      }, undefined, function ( error ) {
      
        console.error( error );
      
      } );
      scene.add(objGroup);
        } 


      
          //Ice block
          var loader = new GLTFLoader();
          for (let i = 0; i < 5; i++) {
          loader.load( './Assets/AurynSky/WinterArena/Models/IceBlockBlender.glb', function ( gltf ) {
        
          var iceBlock= gltf.scene;  
          iceBlock.position.set(30,0,i*2);
        objGroup.add(iceBlock);
        
        }, undefined, function ( error ) {
        
          console.error( error );
        
        } );
        scene.add(objGroup);
          } 

          
          //Ice pinetree
          var loader = new GLTFLoader();
          for (let i = 0; i < 5; i++) {
          loader.load( './Assets/AurynSky/WinterArena/Models/IcePineTreeBlender.glb', function ( gltf ) {
        
          var icePineTree= gltf.scene;  
          icePineTree.position.set(33,0,i*2);
        objGroup.add(icePineTree);
        
        }, undefined, function ( error ) {
        
          console.error( error );
        
        } );
        scene.add(objGroup);
          } 


          //Ice small tree
          var loader = new GLTFLoader();
          for (let i = 0; i < 5; i++) {
          loader.load( './Assets/AurynSky/WinterArena/Models/IceSmallTreeBlender.glb', function ( gltf ) {
        
          var iceSmallTree= gltf.scene;  
          iceSmallTree.position.set(36,0,i*2);
          objGroup.add(iceSmallTree);
        
        }, undefined, function ( error ) {
        
          console.error( error );
        
        } );
        scene.add(objGroup);
          } 


            //Ice grass on block
            var loader = new GLTFLoader();
            for (let i = 0; i < 5; i++) {
            loader.load( './Assets/AurynSky/WinterArena/Models/IceGrassBlender.glb', function ( gltf ) {
          
            var iceGrass= gltf.scene;  
            iceGrass.position.set(39,0,i*2);
          objGroup.add(iceGrass);
          
          }, undefined, function ( error ) {
          
            console.error( error );
          
          } );
          scene.add(objGroup);
            } 

            //Dungeon Block
            var loader = new GLTFLoader();
            for (let i = 0; i < 5; i++) {
            loader.load( './Assets/AurynSky/Dungeon Pack/Models/DungeonBlockBlender.glb', function ( gltf ) {
          
            var DungeonBlock= gltf.scene;  
            DungeonBlock.position.set(42,0,i*2);
          objGroup.add(DungeonBlock);
          
          }, undefined, function ( error ) {
          
            console.error( error );
          
          } );
          scene.add(objGroup);
            } 


            //Dungeon Banner 
            var loader = new GLTFLoader();
            for (let i = 0; i < 5; i++) {
            loader.load( './Assets/AurynSky/Dungeon Pack/Models/DungeonBannerBlender.glb', function ( gltf ) {
          
            var DungeonBanner= gltf.scene;  
            DungeonBanner.position.set(45,0,i*2);
            objGroup.add(DungeonBanner);
          
          }, undefined, function ( error ) {
          
            console.error( error );
          
          } );
          scene.add(objGroup);
            } 
  
            //Models end */

    
    




  var light = new THREE.HemisphereLight(0xffffff, 0x000000, 4);
  scene.add(light); 

  camera.position.set(13, 25, 30);
  camera.lookAt(13, 0, 15);

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const cameraController = new CameraController(camera, 100);

  const gridScene = await loadModel();
  const gridModel = gridScene.scene.children[2];

  gridModel.material.transparent = true;

  const grid = new Grid(7, 4, camera, gridModel);
  scene.add(grid.group);

  function animate () {
      requestAnimationFrame(animate);

      cameraController.update();

      grid.update();

      renderer.render(scene, camera);
  }

  animate();

}

export {getScene};