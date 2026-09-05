import * as THREE from "three";


export function createOrbit(radius){



    const geometry =
        new THREE.TorusGeometry(

            radius,

            0.035,

            64,

            256

        );



    const material =
        new THREE.MeshStandardMaterial({


            color:0x00ccff,


            emissive:0x0088ff,


            emissiveIntensity:2,


            transparent:true,


            opacity:0.7


        });



    const orbit =
        new THREE.Mesh(

            geometry,

            material

        );



    // NO ROTATION HERE

    // Shell controls rotation


    return orbit;



}