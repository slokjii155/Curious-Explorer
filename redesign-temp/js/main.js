import * as THREE from "three";

import { OrbitControls } from 
"three/examples/jsm/controls/OrbitControls.js";


import { createStars } from "./stars.js";


import { 
    createHomeScreen,
    removeHomeScreen
} from "./home.js";



import {

    createModel,
    updateModel,
    setModelElectronSpeed,
    setModel

} from "./modelManager.js";



import { initializeModelSelector }

from "./modelSelector.js";



import { ELEMENTS }

from "./elements.js";



import {

createInfoPanel,
showInfo,
hideInfo

} from "./ui.js";



import "../css/style.css";




//================================
// SCENE
//================================


const scene = new THREE.Scene();


scene.background =
new THREE.Color(
0x050816
);






//================================
// CAMERA
//================================


const camera =
new THREE.PerspectiveCamera(

60,

window.innerWidth /
window.innerHeight,

0.1,

1000

);



camera.position.set(
0,
2,
14
);






//================================
// RENDERER
//================================


const renderer =
new THREE.WebGLRenderer({

antialias:true

});



renderer.setPixelRatio(

Math.min(

window.devicePixelRatio,

2

)

);



renderer.setSize(

window.innerWidth,

window.innerHeight

);



renderer.outputColorSpace =
THREE.SRGBColorSpace;



document.body.appendChild(
renderer.domElement
);








//================================
// LIGHT
//================================


scene.add(

new THREE.HemisphereLight(

0x88aaff,

0x080814,

0.8

)

);



const light =
new THREE.DirectionalLight(

0xffffff,

1.8

);



light.position.set(

8,

10,

8

);



scene.add(light);





const rim =
new THREE.PointLight(

0x4488ff,

1.5,

30

);



rim.position.set(

-6,

4,

-8

);



scene.add(rim);








//================================
// CONTROLS
//================================


const controls =
new OrbitControls(

camera,

renderer.domElement

);



controls.enableDamping=true;

controls.dampingFactor=0.05;








//================================
// BACKGROUND
//================================


createStars(scene);


// HOME SCREEN 3D

createHomeScreen(scene);







//================================
// UI
//================================


createInfoPanel();








//================================
// CURRENT STATE
//================================


let currentElement = null;


let currentAtom = null;





setModel("bohr");








//================================
// WELCOME
//================================


function showWelcome(){



if(currentAtom){


scene.remove(
currentAtom
);


currentAtom=null;


}



removeHomeScreen(scene);



createHomeScreen(scene);




const welcome =
document.getElementById(
"welcomeScreen"
);



if(welcome)

welcome.style.display="block";




const panel =
document.getElementById(
"propertiesPanel"
);



if(panel){

panel.style.display="none";

}



}









//================================
// SHOW ATOM
//================================


function showAtom(element){



removeHomeScreen(scene);




const welcome =
document.getElementById(
"welcomeScreen"
);



if(welcome)

welcome.style.display="none";





const panel =
document.getElementById(
"propertiesPanel"
);



if(panel)

panel.style.display="block";





if(currentAtom){


scene.remove(
currentAtom
);


}




currentElement =
element;




currentAtom =
createModel(
element
);



scene.add(
currentAtom
);



updatePropertiesPanel(
element
);



updateSceneTheme(
element
);



}









//================================
// PROPERTY PANEL
//================================


function updatePropertiesPanel(element){



const panel =
document.getElementById(
"propertiesPanel"
);



if(!panel)
return;





panel.innerHTML = `


<div class="properties-title">

${element.symbol}

</div>



<div class="properties-item">

<span>Name</span>

<strong>

${element.name}

</strong>

</div>




<div class="properties-item">

<span>Atomic Number</span>

<strong>

${element.atomicNumber}

</strong>

</div>




<div class="properties-item">

<span>Protons</span>

<strong>

${element.protons}

</strong>

</div>



<div class="properties-item">

<span>Neutrons</span>

<strong>

${element.neutrons}

</strong>

</div>




<div class="properties-item">

<span>Electrons</span>

<strong>

${element.electrons}

</strong>

</div>




<div class="properties-item">

<span>Shells</span>

<strong>

${element.shells.join(",")}

</strong>

</div>


`;



}









//================================
// THEME
//================================


function updateSceneTheme(element){



if(!element.theme)
return;



scene.background =
new THREE.Color(

element.theme.backgroundColor

);



document.documentElement.style
.setProperty(

"--accent",

element.theme.accentColor

);



}









//================================
// ELEMENT SELECTOR
//================================


const elementSelector =
document.getElementById(
"elementSelect"
);




if(elementSelector){



ELEMENTS.forEach(element=>{


const option =
document.createElement(
"option"
);



option.value =
element.symbol;



option.textContent =

`${element.atomicNumber}. ${element.name} (${element.symbol})`;



elementSelector.appendChild(
option
);



});






elementSelector.addEventListener(

"change",

()=>{


const selected =
ELEMENTS.find(

e=>

e.symbol ===
elementSelector.value

);





if(!selected){


showWelcome();


return;


}




showAtom(selected);



}

);


}









//================================
// MODEL SELECTOR
//================================


initializeModelSelector(()=>{



if(currentElement){


showAtom(
currentElement
);



}



});









//================================
// SPEED
//================================


const speedSlider =
document.getElementById(
"speedSlider"
);



if(speedSlider){



speedSlider.addEventListener(

"input",

()=>{



if(currentAtom){



setModelElectronSpeed(

currentAtom,

Number(
speedSlider.value
)

);



}



}

);



}









//================================
// RAYCASTER
//================================


const raycaster =
new THREE.Raycaster();



const mouse =
new THREE.Vector2();





renderer.domElement.addEventListener(

"mousemove",

(event)=>{



mouse.x =

(event.clientX /
window.innerWidth)
*2-1;



mouse.y =

-(event.clientY /
window.innerHeight)
*2+1;





raycaster.setFromCamera(

mouse,

camera

);





const hit =
raycaster.intersectObjects(

scene.children,

true

);





if(hit.length){



const obj =
hit[0].object;



if(obj.userData.type){



showInfo(

obj.userData,

event.clientX,

event.clientY

);



}



}

else{


hideInfo();


}



}

);









//================================
// ANIMATION
//================================


const clock =
new THREE.Clock();



function animate(){



requestAnimationFrame(
animate
);



const time =
clock.getElapsedTime();



controls.update();



if(currentAtom){


updateModel(

currentAtom,

time

);



}



renderer.render(

scene,

camera

);



}



animate();








//================================
// RESIZE
//================================


window.addEventListener(

"resize",

()=>{



camera.aspect =

window.innerWidth /
window.innerHeight;



camera.updateProjectionMatrix();



renderer.setSize(

window.innerWidth,

window.innerHeight

);



}

);







// FIRST SCREEN

showWelcome();