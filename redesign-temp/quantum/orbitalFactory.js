import { createSOrbital } 
from "./orbitals/sOrbital.js";

import { createPOrbital } 
from "./orbitals/pOrbital.js";

import { createDOrbital } 
from "./orbitals/dOrbital.js";

import { createFOrbital } 
from "./orbitals/fOrbital.js";




//====================================
// Orbital Factory
//====================================


export function createOrbital(
    orbitalName,
    electronCount,
    color
){



    const type =
    orbitalName.slice(-1);



    const level =
    parseInt(
        orbitalName[0]
    );



    // Size based on shell number

    const radius =
    1.2 + (level * 0.45);




    switch(type){


        case "s":


            return createSOrbital(
                radius,
                electronCount,
                color
            );





        case "p":


            return createPOrbital(
                radius,
                electronCount,
                color
            );





        case "d":


            return createDOrbital(
                radius,
                electronCount,
                color
            );





        case "f":


            return createFOrbital(
                radius,
                electronCount,
                color
            );





        default:


            console.warn(
                "Unknown orbital:",
                orbitalName
            );


            return null;

    }


}