import * as THREE from "three";

//====================================
// f Orbital
// Premium Theme (Element Based)
//====================================

export function createFOrbital(
    radius = 2.3,
    electronCount = 14,
    color = 0xff66ff
){

    const group = new THREE.Group();

    //--------------------------------
    // Material
    //--------------------------------

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

    //--------------------------------
    // Eight Lobes
    //--------------------------------

    const geometry =
    new THREE.SphereGeometry(
        radius*0.62,
        64,
        64
    );

    const lobes=[];

    const positions=[

        [ 1, 1, 0],
        [-1, 1, 0],
        [ 1,-1, 0],
        [-1,-1, 0],

        [ 0, 1, 1],
        [ 0,-1, 1],
        [ 0, 1,-1],
        [ 0,-1,-1]

    ];

    positions.forEach((p)=>{

        const lobe =
        new THREE.Mesh(
            geometry,
            material.clone()
        );

        lobe.scale.set(
            0.70,
            0.70,
            1.45
        );

        lobe.position.set(

            p[0]*radius*0.9,

            p[1]*radius*0.9,

            p[2]*radius*0.9

        );

        lobe.lookAt(0,0,0);

        group.add(lobe);

        lobes.push(lobe);

    });

    //--------------------------------
    // Outer Glow
    //--------------------------------

    const glow =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            radius*2,
            48,
            48
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
            radius*0.18,
            40,
            40
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

    // ===== PART 2 =====
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
        0.9 + i*0.05;

        electronGroup.userData.radius =
        radius*1.25;

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


// Lobes clickable metadata

lobes.forEach(lobe=>{


    lobe.userData = {


        type:"orbital",


        name:"f Orbital",


        orbital:"f",


        l:3,


        shape:"Complex multi-lobed",


        maxElectrons:14,


        electronCount:electronCount,



        possibleOrientations:

        "7 orientations (f orbitals)",



        quantumNumber:{


            l:3,


            description:
            "Angular momentum quantum number"


        },



        probabilityDensity:

        "Complex multi-lobed electron probability cloud",



        energyLevel:

        "Higher than d orbital of same shell",



        waveFunction:

        "ψ(f)"



    };


});







// Whole orbital data

group.userData = {


    type:"orbital",


    name:"f Orbital",


    orbital:"f",


    l:3,


    shape:"Complex multi-lobed",


    maxElectrons:14,


    electrons:electrons



};

    //--------------------------------
    // Animation
    //--------------------------------

    group.userData.update=function(time){

        group.rotation.y =
        time*0.10;

        group.rotation.x =
        Math.sin(time*0.25)*0.08;

        //--------------------------------
        // Orbital Pulse
        //--------------------------------

        const pulse =
        1 +
        Math.sin(time*1.2)*0.04;

        lobes.forEach((lobe,index)=>{

            lobe.scale.set(

                0.70*pulse,

                0.70*pulse,

                1.45*pulse

            );

            lobe.rotation.z +=
            0.0006*(index+1);

        });

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

            electron.position.z =
            Math.sin(angle)*r;

            electron.position.y =
            Math.sin(angle*2)*0.55;

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