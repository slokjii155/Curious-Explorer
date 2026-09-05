import * as THREE from "three";

import { createQuantumNucleus } from "./nucleus.js";

import { createSOrbital } from "./orbitals/sOrbital.js";
import { createPOrbital } from "./orbitals/pOrbital.js";
import { createDOrbital } from "./orbitals/dOrbital.js";
import { createFOrbital } from "./orbitals/fOrbital.js";





export function createQuantumAtom(element){


    const atom =
    new THREE.Group();



    //------------------------------------
    // Nucleus
    //------------------------------------

    const nucleus =
    createQuantumNucleus(
        element
    );


    atom.add(nucleus);




    //------------------------------------
    // Orbitals
    //------------------------------------


    const orbitals=[];


    let remaining =
    element.electrons;





    //------------------------------------
    // Orbital creation helper
    //------------------------------------


    function addOrbital(
        type,
        radius,
        max,
        color
    ){


        if(remaining<=0)
            return;



        const count =
        Math.min(
            remaining,
            max
        );



        let orbital;



        switch(type){


            case "s":

                orbital =
                createSOrbital(
                    radius,
                    count,
                    color
                );

            break;




            case "p":

                orbital =
                createPOrbital(
                    radius,
                    count,
                    color
                );

            break;




            case "d":

                orbital =
                createDOrbital(
                    radius,
                    count,
                    color
                );

            break;




            case "f":

                orbital =
                createFOrbital(
                    radius,
                    count,
                    color
                );

            break;


        }





        atom.add(orbital);


        orbitals.push(
            orbital
        );


        remaining -= count;



    }









    //------------------------------------
    // Electron filling order
    //------------------------------------


    addOrbital(
        "s",
        1.6,
        2,
        element.theme.glowColor
    );


    addOrbital(
        "s",
        2.5,
        2,
        element.theme.shellColor
    );


    addOrbital(
        "p",
        3.4,
        6,
        element.theme.atomColor
    );



    addOrbital(
        "s",
        4.2,
        2,
        0x66ffff
    );



    addOrbital(
        "p",
        5,
        6,
        0xff66ff
    );



    addOrbital(
        "d",
        6,
        10,
        0xffaa33
    );



    addOrbital(
        "s",
        7,
        2,
        0x55ff55
    );



    addOrbital(
        "f",
        8,
        14,
        0x99ff99
    );





    //------------------------------------
    // DATA
    //------------------------------------


    atom.userData.element =
    element;


    atom.userData.nucleus =
    nucleus;


    atom.userData.orbitals =
    orbitals;



    return atom;

}









//------------------------------------
// Update
//------------------------------------

export function updateQuantumAtom(
    atom,
    time
){


    if(!atom)
        return;



    if(atom.userData.nucleus?.userData.update){

        atom.userData.nucleus.userData.update(
            time
        );

    }





    atom.userData.orbitals.forEach(
        orbital=>{


            if(orbital.userData.update){

                orbital.userData.update(
                    time
                );

            }


        }
    );

}