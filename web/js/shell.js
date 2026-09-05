import * as THREE from "three";

import { Electron } from "./electron.js";



export class Shell {


constructor(
    radius,
    electronCount,
    index,
    theme
){



this.group = new THREE.Group();


this.radius = radius;

this.electronCount = electronCount;

this.index = index;

this.theme = theme;




//================================
// SHELL NAME
//================================


const shellNames = [

    "K Shell",
    "L Shell",
    "M Shell",
    "N Shell",
    "O Shell",
    "P Shell",
    "Q Shell"

];


this.shellName =
shellNames[index] || `Shell ${index+1}`;




//================================
// ROTATION
//================================


this.group.rotation.x =
0.4 + index * 0.25;


this.group.rotation.z =
index * 0.3;



this.rotationSpeed =
0.002 + index * 0.001;





//================================
// ELECTRON SPEED
//================================


this.baseElectronSpeed =
0.02 + index * 0.004;


this.electronSpeed =
this.baseElectronSpeed;







//================================
// SHELL DATA
//================================


const capacity =
2 * Math.pow(index+1,2);



this.group.userData = {


    type:"shell",

    name:this.shellName,

    shellName:this.shellName,


    n:index+1,


    shellNumber:index+1,


    electrons:electronCount,


    maxElectrons:capacity,


    maxCapacity:capacity,


    capacity:capacity,


    radius:radius


};









//================================
// ORBIT RING
//================================


const orbitGeometry =

new THREE.TorusGeometry(

    radius,

    0.03,

    16,

    256

);






const orbitColor =

theme?.shellColor || 0x00aaff;





const orbitMaterial =

new THREE.MeshStandardMaterial({

    color:orbitColor,

    emissive:orbitColor,

    emissiveIntensity:1.2,

    transparent:true,

    opacity:0.85,

    toneMapped:false

});






const orbit =

new THREE.Mesh(

    orbitGeometry,

    orbitMaterial

);







// IMPORTANT
// RING DATA


orbit.userData = {


    type:"shell",

    name:this.shellName,

    shellName:this.shellName,


    n:index+1,


    shellNumber:index+1,


    electrons:electronCount,


    maxElectrons:capacity,


    maxCapacity:capacity,


    capacity:capacity,


    radius:radius


};





this.group.add(orbit);









//================================
// ELECTRONS
//================================


this.electrons=[];




for(let i=0;i<electronCount;i++){



const electron =

new Electron(theme);





const angle =

(Math.PI*2*i)/electronCount;






electron.mesh.position.set(

    radius*Math.cos(angle),

    radius*Math.sin(angle),

    0

);







electron.mesh.userData = {


    type:"electron",


    name:`Electron ${i+1}`,


    shell:this.shellName,


    shellNumber:index+1,


    charge:"-1e"


};






this.group.add(

    electron.mesh

);






this.electrons.push({

    mesh:electron.mesh,

    angle:angle

});



}



}









//================================
// SPEED
//================================


setElectronSpeed(multiplier){


this.electronSpeed =

this.baseElectronSpeed * multiplier;


}









//================================
// UPDATE
//================================


update(){



this.group.rotation.y +=

this.rotationSpeed;






this.electrons.forEach(electron=>{


electron.angle +=

this.electronSpeed;





electron.mesh.position.set(

this.radius*Math.cos(electron.angle),

this.radius*Math.sin(electron.angle),

0

);



});



}



}