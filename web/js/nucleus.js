import * as THREE from "three";



export function createNucleus(

    protons = 1,

    neutrons = 0,

    theme = {}

){



const nucleus = new THREE.Group();





//--------------------------------
// Colors
//--------------------------------


const protonColor =

    theme?.protonColor || 0xff3333;



const protonGlow =

    theme?.protonGlow || 0xaa0000;



const neutronColor =

    theme?.neutronColor || 0x777777;



const neutronGlow =

    theme?.neutronGlow || 0x222222;






//--------------------------------
// Materials
//--------------------------------


const protonMat =

new THREE.MeshStandardMaterial({


    color: protonColor,


    emissive: protonGlow,


    emissiveIntensity:2.2,


    roughness:0.25,


    metalness:0.1


});






const neutronMat =

new THREE.MeshStandardMaterial({


    color: neutronColor,


    emissive: neutronGlow,


    emissiveIntensity:0.8,


    roughness:0.35


});







//--------------------------------
// Geometry
//--------------------------------


const size = 0.18;



const protonGeo =

new THREE.SphereGeometry(

    size,

    32,

    32

);



const neutronGeo =

new THREE.SphereGeometry(

    size,

    32,

    32

);







//--------------------------------
// Create Protons
//--------------------------------


for(let i=0;i<protons;i++){


    const proton = new THREE.Mesh(

        protonGeo,

        protonMat

    );



    proton.position.set(

        (Math.random()-0.5)*0.7,

        (Math.random()-0.5)*0.7,

        (Math.random()-0.5)*0.7

    );



    nucleus.add(proton);


}








//--------------------------------
// Create Neutrons
//--------------------------------


for(let i=0;i<neutrons;i++){


    const neutron = new THREE.Mesh(

        neutronGeo,

        neutronMat

    );



    neutron.position.set(

        (Math.random()-0.5)*0.7,

        (Math.random()-0.5)*0.7,

        (Math.random()-0.5)*0.7

    );



    nucleus.add(neutron);


}







//--------------------------------
// Nucleus Glow
//--------------------------------


const glow = new THREE.PointLight(


    theme?.nucleusGlow || 0xff3333,


    1.5,


    5


);



nucleus.add(glow);






return nucleus;



}