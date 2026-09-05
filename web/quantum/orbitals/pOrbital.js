import * as THREE from "three";

//====================================
// p Orbital
// Premium Theme (Element Based)
//====================================

export function createPOrbital(
    radius = 2,
    electronCount = 4,
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
    // Dumbbell Lobes
    //--------------------------------

    const geometry =
    new THREE.SphereGeometry(
        radius,
        64,
        64
    );

    const left =
    new THREE.Mesh(
        geometry,
        material.clone()
    );

    const right =
    new THREE.Mesh(
        geometry,
        material.clone()
    );

    left.scale.set(
        0.75,
        0.75,
        1.8
    );

    right.scale.set(
        0.75,
        0.75,
        1.8
    );

    left.position.z =
    -radius*0.9;

    right.position.z =
    radius*0.9;

    group.add(left);
    group.add(right);

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

        electronGroup.userData.side =
        i%2===0 ? -1 : 1;

        electronGroup.userData.angle =
        (Math.PI*2/electronCount)*i;

        electronGroup.userData.speed =
        1.2 + i*0.15;

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


// Both lobes clickable

left.userData = {


    type:"orbital",


    name:"p Orbital",


    orbital:"p",


    l:1,


    shape:"Dumbbell",


    maxElectrons:6,


    electronCount:electronCount,


    possibleOrientations:

    "3 orientations (px, py, pz)",


    quantumNumber:{

        l:1,

        description:
        "Angular momentum quantum number"

    },


    probabilityDensity:

    "Two-lobed dumbbell shaped electron cloud",


    energyLevel:

    "Higher than s orbital of same shell",


    waveFunction:

    "ψ(p)"

};




right.userData = {


    type:"orbital",


    name:"p Orbital",


    orbital:"p",


    l:1,


    shape:"Dumbbell",


    maxElectrons:6,


    electronCount:electronCount,


    possibleOrientations:

    "3 orientations (px, py, pz)",


    quantumNumber:{

        l:1,

        description:
        "Angular momentum quantum number"

    },


    probabilityDensity:

    "Two-lobed dumbbell shaped electron cloud",


    energyLevel:

    "Higher than s orbital of same shell",


    waveFunction:

    "ψ(p)"


};





group.userData = {


    type:"orbital",


    name:"p Orbital",


    orbital:"p",


    l:1,


    shape:"Dumbbell",


    maxElectrons:6,


    electrons:electrons


};
    //--------------------------------
    // Animation
    //--------------------------------

    group.userData.update=function(time){

        group.rotation.y =
        time*0.15;

        //--------------------------------
        // Orbital Pulse
        //--------------------------------

        const pulse =
        1 +
        Math.sin(time*1.2)*0.04;

        left.scale.set(

            0.75*pulse,
            0.75*pulse,
            1.8*pulse

        );

        right.scale.set(

            0.75*pulse,
            0.75*pulse,
            1.8*pulse

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

            const side =
            electron.userData.side;

            const z =

                side *

                radius *

                1.1;

            electron.position.x =
            Math.cos(angle)*0.45;

            electron.position.y =
            Math.sin(angle)*0.45;

            electron.position.z =
            z +
            Math.sin(angle*2)*0.25;

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