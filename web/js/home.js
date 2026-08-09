import * as THREE from "three";


let homeGroup = null;



export function createHomeScreen(scene){


    homeGroup = new THREE.Group();



    //========================
    // Nucleus Glow
    //========================


    const nucleusGeo =
    new THREE.SphereGeometry(
        0.35,
        64,
        64
    );


    const nucleusMat =
    new THREE.MeshBasicMaterial({

        color:0x9b6bff,

        transparent:true,

        opacity:0.8

    });


    const nucleus =
    new THREE.Mesh(
        nucleusGeo,
        nucleusMat
    );


    homeGroup.add(nucleus);





    //========================
    // Orbital Rings
    //========================


    for(let i=0;i<4;i++){


        const orbit =
        new THREE.Mesh(

            new THREE.TorusGeometry(

                1.3 + i*0.45,

                0.008,

                32,

                128

            ),


            new THREE.MeshBasicMaterial({

                color:
                i%2?
                0x8a5cff:
                0x5b8cff,


                transparent:true,

                opacity:0.35

            })

        );



        orbit.rotation.x =
        Math.PI/2;



        orbit.rotation.z =
        i*0.7;



        homeGroup.add(
            orbit
        );


    }







    //========================
    // Floating Particles
    //========================


    const particleGeo =
    new THREE.BufferGeometry();


    const positions=[];



    for(let i=0;i<200;i++){


        positions.push(

            (Math.random()-0.5)*8,

            (Math.random()-0.5)*8,

            (Math.random()-0.5)*4

        );


    }



    particleGeo.setAttribute(

        "position",

        new THREE.Float32BufferAttribute(

            positions,

            3

        )

    );




    const particleMat =
    new THREE.PointsMaterial({

        color:0xcbb6ff,

        size:0.025,

        transparent:true,

        opacity:0.8

    });



    const particles =
    new THREE.Points(

        particleGeo,

        particleMat

    );


    homeGroup.add(
        particles
    );







    homeGroup.position.set(

        0,

        0,

        -2

    );



    scene.add(
        homeGroup
    );



    animateHome();

}



function animateHome(){


    if(!homeGroup)
        return;



    homeGroup.rotation.y +=0.002;


    homeGroup.rotation.x +=0.001;



    requestAnimationFrame(
        animateHome
    );


}







export function removeHomeScreen(scene){


    if(homeGroup){


        scene.remove(
            homeGroup
        );


    }


}