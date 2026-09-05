import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { createStars } from "./stars.js";
import { createHydrogen, updateAtom } from "./atom.js";


let scene;
let camera;
let renderer;
let controls;



export function initScene() {


    const viewer = document.getElementById("viewer");



    //--------------------------------
    // Scene
    //--------------------------------

    scene = new THREE.Scene();


    scene.background =
        new THREE.Color(0x020612);





    //--------------------------------
    // Camera
    //--------------------------------

    camera =
        new THREE.PerspectiveCamera(

            60,

            viewer.clientWidth /
            viewer.clientHeight,

            0.1,

            1000

        );



    camera.position.set(

        8,

        6,

        14

    );







    //--------------------------------
    // Renderer
    //--------------------------------


    renderer =
        new THREE.WebGLRenderer({

            antialias:true,

            alpha:false

        });




    renderer.setPixelRatio(

        Math.min(

            window.devicePixelRatio,

            2

        )

    );



    renderer.setSize(

        viewer.clientWidth,

        viewer.clientHeight

    );




    renderer.outputColorSpace =
        THREE.SRGBColorSpace;




    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;




    renderer.toneMappingExposure =
        0.75;





    renderer.shadowMap.enabled =
        true;



    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;



    viewer.appendChild(

        renderer.domElement

    );








    //--------------------------------
    // Controls
    //--------------------------------


    controls =
        new OrbitControls(

            camera,

            renderer.domElement

        );



    controls.enableDamping =
        true;



    controls.dampingFactor =
        0.05;



    controls.minDistance =
        4;



    controls.maxDistance =
        40;



    controls.target.set(

        0,

        0,

        0

    );







    //--------------------------------
    // Lighting
    //--------------------------------



    // Soft environment light

    const ambient =
        new THREE.HemisphereLight(

            0x8ab8ff,

            0x080812,

            0.45

        );



    scene.add(ambient);







    // Main detail light

    const keyLight =
        new THREE.DirectionalLight(

            0xffffff,

            1.2

        );



    keyLight.position.set(

        8,

        10,

        12

    );



    keyLight.castShadow =
        true;



    keyLight.shadow.mapSize.set(

        2048,

        2048

    );



    scene.add(keyLight);







    // Blue rim light

    const rimLight =
        new THREE.PointLight(

            0x008cff,

            2.5,

            30

        );



    rimLight.position.set(

        -8,

        4,

        -10

    );



    scene.add(rimLight);








    // Subtle center fill

    const centerLight =
        new THREE.PointLight(

            0x00ffff,

            1.2,

            15

        );



    centerLight.position.set(

        0,

        0,

        3

    );



    scene.add(centerLight);







    //--------------------------------
    // Objects
    //--------------------------------


    createStars(scene);


    createHydrogen(scene);








    //--------------------------------
    // Resize
    //--------------------------------


    window.addEventListener(

        "resize",

        onResize

    );



    animate();



}







function onResize(){



    const viewer =
        document.getElementById("viewer");



    camera.aspect =

        viewer.clientWidth /

        viewer.clientHeight;



    camera.updateProjectionMatrix();




    renderer.setSize(

        viewer.clientWidth,

        viewer.clientHeight

    );



}








function animate(){



    requestAnimationFrame(

        animate

    );



    updateAtom();



    controls.update();



    renderer.render(

        scene,

        camera

    );



}