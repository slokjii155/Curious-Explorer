import * as THREE from "three";

export function createQuantumNucleus() {

    const group = new THREE.Group();

    //---------------------------------------
    // Core
    //---------------------------------------

    const core = new THREE.Mesh(

        new THREE.IcosahedronGeometry(0.8, 5),

        new THREE.MeshPhysicalMaterial({

            color: 0xff4444,

            emissive: 0xff0000,

            emissiveIntensity: 4,

            roughness: 0.15,

            metalness: 0.2,

            clearcoat: 1,

            transmission: 0.15

        })

    );

    group.add(core);





    //---------------------------------------
    // Inner Glow
    //---------------------------------------

    const glow = new THREE.Mesh(

        new THREE.SphereGeometry(1.05, 64, 64),

        new THREE.MeshBasicMaterial({

            color: 0xff4444,

            transparent: true,

            opacity: 0.12,

            blending: THREE.AdditiveBlending,

            side: THREE.DoubleSide

        })

    );

    group.add(glow);






    //---------------------------------------
    // Outer Energy Shell
    //---------------------------------------

    const aura = new THREE.Mesh(

        new THREE.SphereGeometry(1.45, 64, 64),

        new THREE.MeshBasicMaterial({

            color: 0xff6666,

            transparent: true,

            opacity: 0.05,

            blending: THREE.AdditiveBlending,

            side: THREE.DoubleSide

        })

    );

    group.add(aura);







    //---------------------------------------
    // Animation
    //---------------------------------------

    group.userData.update = function(time){

        core.rotation.x += 0.003;

        core.rotation.y += 0.004;

        core.rotation.z += 0.002;



        const pulse =

            1 +

            Math.sin(time * 2.5) * 0.04;



        glow.scale.set(

            pulse,

            pulse,

            pulse

        );



        aura.scale.set(

            pulse * 1.08,

            pulse * 1.08,

            pulse * 1.08

        );



        glow.material.opacity =

            0.10 +

            Math.sin(time * 2.5) * 0.02;



        aura.material.opacity =

            0.04 +

            Math.sin(time * 2.0) * 0.015;

    };





    return group;

}