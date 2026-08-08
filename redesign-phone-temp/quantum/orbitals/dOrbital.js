import * as THREE from "three";

//====================================
// d Orbital
// Premium Theme (Element Based)
//====================================

export function createDOrbital(
    radius = 2.2,
    electronCount = 10,
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
    // Four Lobes
    //--------------------------------

    const geometry =
    new THREE.SphereGeometry(
        radius*0.72,
        64,
        64
    );

    const lobes=[];

    const positions=[

        [ 1, 1],
        [-1, 1],
        [-1,-1],
        [ 1,-1]

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
            1.60
        );

        lobe.position.set(

            p[0]*radius*0.8,

            p[1]*radius*0.8,

            0

        );

        lobe.lookAt(0,0,0);

        group.add(lobe);

        lobes.push(lobe);

    });

    //--------------------------------
    // Ring
    //--------------------------------

    const ring =
    new THREE.Mesh(

        new THREE.TorusGeometry(
            radius*0.35,
            0.08,
            20,
            80
        ),

        new THREE.MeshStandardMaterial({

            color:color,

            emissive:color,

            emissiveIntensity:3,

            transparent:true,

            opacity:0.40,

            roughness:0,

            metalness:0.20

        })

    );

    ring.rotation.x =
    Math.PI/2;

    group.add(ring);

    //--------------------------------
    // Outer Glow
    //--------------------------------

    const glow =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            radius*1.8,
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
        1.0 + i*0.08;

        electronGroup.userData.radius =
        radius*1.15;

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


        name:"d Orbital",


        orbital:"d",


        l:2,


        shape:"Cloverleaf",


        maxElectrons:10,


        electronCount:electronCount,


        possibleOrientations:

        "5 orientations (dxy, dyz, dz², dxz, dx²-y²)",


        quantumNumber:{

            l:2,

            description:
            "Angular momentum quantum number"

        },


        probabilityDensity:

        "Four-lobed clover shaped electron cloud",


        energyLevel:

        "Higher than p orbital of same shell",


        waveFunction:

        "ψ(d)"


    };


});





// Ring metadata

ring.userData = {


    type:"orbital",


    name:"d Orbital Ring",


    orbital:"d"


};







// Whole orbital data

group.userData = {


    type:"orbital",


    name:"d Orbital",


    orbital:"d",


    l:2,


    shape:"Cloverleaf",


    maxElectrons:10,


    electrons:electrons



};

    //--------------------------------
    // Animation
    //--------------------------------

    group.userData.update=function(time){

        group.rotation.y =
        time*0.12;

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

                1.60*pulse

            );

            lobe.rotation.z +=
            0.0008*(index+1);

        });

        //--------------------------------
        // Ring Rotation
        //--------------------------------

        ring.rotation.z =
        time*0.25;

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
            Math.sin(angle*2)*0.45;

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