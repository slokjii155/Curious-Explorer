import * as THREE from "three";

//====================================
// s Orbital
// Premium Theme (Element Based)
//====================================

export function createSOrbital(
    radius = 2,
    electronCount = 2,
    color = 0x66ccff
){

    const group = new THREE.Group();

    //--------------------------------
    // Electron Cloud
    //--------------------------------

    const geometry =
    new THREE.SphereGeometry(
        radius,
        64,
        64
    );

    const material =
    new THREE.MeshStandardMaterial({

        color:color,

        emissive:color,

        emissiveIntensity:2,

        transparent:true,

        opacity:0.28,

        roughness:0.08,

        metalness:0.20,

        side:THREE.DoubleSide,

        depthWrite:false

    });

    const cloud =
    new THREE.Mesh(
        geometry,
        material
    );

    group.add(cloud);

    //--------------------------------
    // Outer Glow
    //--------------------------------

    const glow =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            radius*1.08,
            64,
            64
        ),

        new THREE.MeshBasicMaterial({

            color:color,

            transparent:true,

            opacity:0.10,

            blending:THREE.AdditiveBlending,

            side:THREE.BackSide,

            depthWrite:false

        })

    );

    group.add(glow);

    //--------------------------------
    // Core
    //--------------------------------

    const core =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            radius*0.22,
            48,
            48
        ),

        new THREE.MeshStandardMaterial({

            color:0xffffff,

            emissive:color,

            emissiveIntensity:5,

            transparent:true,

            opacity:0.55,

            roughness:0,

            metalness:0

        })

    );

    group.add(core);

    //--------------------------------
    // Electrons
    //--------------------------------

    const electrons=[];

    for(
        let i=0;
        i<electronCount;
        i++
    ){

        const electronGroup =
        new THREE.Group();

        const halo =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.18,
                24,
                24
            ),

            new THREE.MeshBasicMaterial({

                color:color,

                transparent:true,

                opacity:0.35,

                blending:THREE.AdditiveBlending,

                depthWrite:false

            })

        );

        electronGroup.add(halo);

        const electron =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.12,
                32,
                32
            ),

            new THREE.MeshStandardMaterial({

                color:0xffffff,

                emissive:color,

                emissiveIntensity:6,

                roughness:0,

                metalness:0

            })

        );

        electronGroup.add(electron);

        electronGroup.userData.angle =
        (Math.PI*2/electronCount)*i;

        electronGroup.userData.speed =
        1.5+i*0.3;

        electronGroup.userData.radius =
        radius*0.65;

        group.add(
            electronGroup
        );

        electrons.push(
            electronGroup
        );

    }

//--------------------------------
// DATA
//--------------------------------


// Cloud Click Information

cloud.userData = {

    type:"orbital",

    name:"s Orbital",

    orbital:"s",

    l:0,

    shape:"Spherical",

    maxElectrons:2,

    electronCount:electronCount,


    quantumNumber:{

        l:0,

        description:
        "Angular momentum quantum number"

    },


    possibleOrientations:

    "1 orientation",

    
    energyLevel:

    "Depends on principal quantum number",


    probabilityDensity:

    "Spherical electron probability cloud",


    waveFunction:

    "ψ(s)"


};





// Whole Orbital Group Information

group.userData = {


    type:"orbital",


    name:"s Orbital",


    orbital:"s",


    l:0,


    shape:"Spherical",


    maxElectrons:2,


    electrons:electrons



};
    // ===== PART 2 =====
        //--------------------------------
    // Animation
    //--------------------------------

    group.userData.update = function(time){

        //--------------------------------
        // Cloud Motion
        //--------------------------------

        cloud.rotation.y =
        time*0.20;

        cloud.rotation.x =
        Math.sin(time*0.45)*0.18;

        cloud.rotation.z =
        Math.cos(time*0.30)*0.08;

        //--------------------------------
        // Cloud Pulse
        //--------------------------------

        const pulse =
        1 +
        Math.sin(time*1.2)*0.04;

        cloud.scale.setScalar(
            pulse
        );

        //--------------------------------
        // Glow Pulse
        //--------------------------------

        glow.scale.setScalar(

            1 +

            Math.sin(time)*0.05

        );

        glow.material.opacity =

            0.10 +

            Math.sin(time*2)*0.02;

        //--------------------------------
        // Core Pulse
        //--------------------------------

        core.scale.setScalar(

            1 +

            Math.sin(time*2.5)*0.08

        );

        core.material.opacity =

            0.55 +

            Math.sin(time*2.2)*0.05;

        //--------------------------------
        // Electrons
        //--------------------------------

        electrons.forEach(electron=>{

            const angle =

                electron.userData.angle +

                time *

                electron.userData.speed;

            const r =
            electron.userData.radius;

            electron.position.x =
            Math.cos(angle)*r;

            electron.position.y =
            Math.sin(angle*2)*0.25;

            electron.position.z =
            Math.sin(angle)*r;

            electron.scale.setScalar(

                1 +

                Math.sin(

                    time*6 +

                    angle

                )*0.08

            );

        });

    };

    return group;

}