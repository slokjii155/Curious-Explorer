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

controls.dampingFactor=0.035;








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

let atomEntranceStart = null;
const ATOM_ENTRANCE_MS = 550;





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



const toggleBtn =
document.getElementById(
"panelToggleBtn"
);

if(toggleBtn){

toggleBtn.style.display="none";

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



const toggleBtn =
document.getElementById(
"panelToggleBtn"
);

if(toggleBtn){

toggleBtn.style.display="flex";

}



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



// Smooth "grow-in" entrance instead of an instant pop —
// the model scales up with an ease-out curve over ~550ms.
currentAtom.scale.set(0.001, 0.001, 0.001);
atomEntranceStart = performance.now();


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

<div class="panel-fade">

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
// PROPERTIES PANEL TOGGLE
//================================
// Lets the person hide/show the atom-details card whenever
// they want, independent of which element is selected.


const panelToggleBtn =
document.getElementById(
"panelToggleBtn"
);


if(panelToggleBtn){


panelToggleBtn.addEventListener(

"click",

()=>{

const panel =
document.getElementById(
"propertiesPanel"
);

if(!panel)
return;

const collapsed =
panel.classList.toggle("collapsed");

panelToggleBtn.classList.toggle(
"panel-hidden",
collapsed
);

panelToggleBtn.setAttribute(
"aria-pressed",
String(!collapsed)
);

}

);


}


//================================
// SPEED PANEL TOGGLE
//================================
// Mirrors the properties-panel toggle above, but for the
// electron-speed control on the opposite (bottom-left) corner —
// same tap-to-tuck-away behavior, own icon.


const speedToggleBtn =
document.getElementById(
"speedToggleBtn"
);


if(speedToggleBtn){


speedToggleBtn.addEventListener(

"click",

()=>{

const speedPanel =
document.getElementById(
"speedPanel"
);

if(!speedPanel)
return;

const collapsed =
speedPanel.classList.toggle("collapsed");

speedToggleBtn.classList.toggle(
"speed-hidden",
collapsed
);

speedToggleBtn.setAttribute(
"aria-pressed",
String(!collapsed)
);

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
// TOUCH SUPPORT (phones / tablets)
//================================
// Mobile devices don't fire "mousemove" the same way desktop
// does, so we mirror the same raycast + tooltip logic for taps,
// and auto-hide the tooltip after a short delay since there is
// no "mouse leave" event on touch screens.


let touchHideTimer = null;


renderer.domElement.addEventListener(

"touchstart",

(event)=>{

if(!event.touches || event.touches.length === 0)
return;

const touch = event.touches[0];

mouse.x =

(touch.clientX /
window.innerWidth)
*2-1;

mouse.y =

-(touch.clientY /
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

Math.min(touch.clientX, window.innerWidth - 20),

Math.min(touch.clientY, window.innerHeight - 20)

);


if(touchHideTimer)
clearTimeout(touchHideTimer);

touchHideTimer = setTimeout(()=>{

hideInfo();

}, 3200);

}

}

},

{ passive:true }

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


// Ease the "grow-in" entrance so a freshly picked element
// pops into view smoothly instead of appearing instantly.
if(atomEntranceStart !== null){

const t = Math.min(
1,
(performance.now() - atomEntranceStart) / ATOM_ENTRANCE_MS
);

const eased = 1 - Math.pow(1 - t, 3);
const s = 0.001 + (1 - 0.001) * eased;

currentAtom.scale.set(s, s, s);

if(t >= 1){
atomEntranceStart = null;
currentAtom.scale.set(1, 1, 1);
}

}


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


// Also react to mobile orientation changes (some phones don't
// fire a full "resize" event immediately when rotating)

window.addEventListener(

"orientationchange",

()=>{

setTimeout(()=>{

camera.aspect =

window.innerWidth /
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(

window.innerWidth,

window.innerHeight

);

}, 250);

}

);







// FIRST SCREEN

showWelcome();