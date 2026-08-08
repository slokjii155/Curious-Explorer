import * as THREE from "three";

import { Shell } from "./shell.js";

import { createNucleus } from "./nucleus.js";


let currentAtom = null;





//================================
// CREATE ATOM
//================================

export function createAtom(element){


    const atom = new THREE.Group();




    //--------------------------------
    // Nucleus
    //--------------------------------


    const nucleus = createNucleus(

        element.protons,

        element.neutrons,

        element.theme

    );


    atom.add(nucleus);






    //--------------------------------
    // Atom Data
    //--------------------------------


    atom.userData = {


        type:"element",

        name:element.name,

        symbol:element.symbol,

        atomicNumber:element.atomicNumber,

        protons:element.protons,

        neutrons:element.neutrons,

        electrons:element.electrons,

        category:element.category,

        theme:element.theme,

        shells:[]

    };







    //--------------------------------
    // CHEMISTRY SHELL NAMES
    //--------------------------------


    const shellNames = [

        "K Shell",
        "L Shell",
        "M Shell",
        "N Shell",
        "O Shell",
        "P Shell",
        "Q Shell"

    ];









    //--------------------------------
    // CREATE SHELLS
    //--------------------------------


    element.shells.forEach(

        (electronCount,index)=>{


            const radius =

            3 + index * 2;





            const shell = new Shell(

                radius,

                electronCount,

                index,

                element.theme

            );






            atom.add(

                shell.group

            );








            //--------------------------------
            // SHELL DATA
            //--------------------------------


            shell.group.userData = {


                type:"shell",



                // K/L/M/N name

                name:

                shellNames[index],



                shellName:

                shellNames[index],




                n:

                index + 1,



                shellNumber:

                index + 1,



                electrons:

                electronCount,



                maxElectrons:

                2 * Math.pow(

                    index + 1,

                    2

                ),



                radius:

                radius,



                element:

                element.name,



                symbol:

                element.symbol,



                atomicNumber:

                element.atomicNumber


            };






            atom.userData.shells.push(

                shell

            );



        }

    );







    return atom;


}









//================================
// UPDATE ATOM
//================================


export function updateAtom(atom){


    if(!atom)

        return;




    atom.userData.shells.forEach(

        shell=>{


            shell.update();


        }

    );


}









//================================
// SPEED CONTROL
//================================


export function setAtomElectronSpeed(

    atom,

    speedMultiplier

){


    if(!atom)

        return;




    atom.userData.shells.forEach(

        shell=>{


            shell.setElectronSpeed(

                speedMultiplier

            );


        }

    );


}









//================================
// CHANGE ATOM
//================================


export function changeAtom(

    scene,

    element

){


    if(currentAtom){


        scene.remove(

            currentAtom

        );


    }





    currentAtom = createAtom(

        element

    );





    scene.add(

        currentAtom

    );





    return currentAtom;


}