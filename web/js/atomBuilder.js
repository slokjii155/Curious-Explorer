import * as THREE from "three";

import { Shell } from "./shell.js";
import { createNucleus } from "./nucleus.js";



export function createAtom(element){


    const atom = new THREE.Group();


    console.log("Creating atom:", element.name);



    // NUCLEUS

    const nucleus = createNucleus(
        element.protons || 1
    );


    atom.add(nucleus);



    // SHELLS

    const shells = [];



    if(!element.shells){

        console.error(
            "No shell data found",
            element
        );

        return atom;

    }



    element.shells.forEach(
        (electronCount,index)=>{


            const radius = 
                3 + index * 2;



            const shell =
                new Shell(
                    radius,
                    electronCount
                );



            shells.push(shell);


            atom.add(
                shell.group
            );


        }
    );



    atom.userData.shells =
        shells;



    return atom;

}





export function updateAtom(atom){


    if(
        !atom ||
        !atom.userData.shells
    )
    return;



    atom.userData.shells.forEach(
        shell=>{

            shell.update();

        }
    );


}