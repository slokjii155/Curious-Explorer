import * as THREE from "three";


export function createStars(scene){



    //--------------------------------
    // Deep Space Stars
    //--------------------------------


    const starGeometry =

        new THREE.BufferGeometry();



    const starCount = 1800;



    const positions = [];



    for(let i = 0; i < starCount; i++){


        const radius = 220;



        positions.push(

            (Math.random()-0.5) * radius,

            (Math.random()-0.5) * radius,

            (Math.random()-0.5) * radius

        );


    }






    starGeometry.setAttribute(

        "position",

        new THREE.Float32BufferAttribute(

            positions,

            3

        )

    );







    //--------------------------------
    // Star Material
    //--------------------------------


    const starMaterial =

        new THREE.PointsMaterial({


            color:0xffffff,


            size:0.1,


            transparent:true,


            opacity:0.8,


            depthWrite:false,


            blending:THREE.AdditiveBlending


        });






    const stars = new THREE.Points(

        starGeometry,

        starMaterial

    );



    stars.name = "Deep Space Stars";



    scene.add(stars);







    //--------------------------------
    // Space Dust
    //--------------------------------


    const dustGeometry =

        new THREE.BufferGeometry();



    const dustPositions = [];



    for(let i = 0; i < 900; i++){



        dustPositions.push(

            (Math.random()-0.5)*140,

            (Math.random()-0.5)*140,

            (Math.random()-0.5)*140

        );


    }





    dustGeometry.setAttribute(

        "position",

        new THREE.Float32BufferAttribute(

            dustPositions,

            3

        )

    );







    const dustMaterial =

        new THREE.PointsMaterial({


            color:0x4466aa,


            size:0.035,


            transparent:true,


            opacity:0.22,


            depthWrite:false


        });






    const dust = new THREE.Points(

        dustGeometry,

        dustMaterial

    );



    dust.name = "Space Dust";



    scene.add(dust);



}