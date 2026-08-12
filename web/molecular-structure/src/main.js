import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "../src/style.css";

const presets = {
 water:{name:"Water",formula:"H₂O",atoms:[{e:"O",x:0,y:0,z:0},{e:"H",x:.96,y:0,z:0},{e:"H",x:-.24,y:.93,z:0}]},
 methane:{name:"Methane",formula:"CH₄",atoms:[{e:"C",x:0,y:0,z:0},{e:"H",x:.63,y:.63,z:.63},{e:"H",x:-.63,y:-.63,z:.63},{e:"H",x:-.63,y:.63,z:-.63},{e:"H",x:.63,y:-.63,z:-.63}]},
 ammonia:{name:"Ammonia",formula:"NH₃",atoms:[{e:"N",x:0,y:0,z:0},{e:"H",x:.78,y:.45,z:0},{e:"H",x:-.78,y:.45,z:0},{e:"H",x:0,y:-.72,z:.55}]},
 co2:{name:"Carbon dioxide",formula:"CO₂",atoms:[{e:"C",x:0,y:0,z:0},{e:"O",x:1.16,y:0,z:0},{e:"O",x:-1.16,y:0,z:0}]},
 benzene:{name:"Benzene",formula:"C₆H₆",atoms:[...Array.from({length:6},(_,i)=>{let a=i*Math.PI/3;return{e:"C",x:Math.cos(a),y:Math.sin(a),z:0}}),...Array.from({length:6},(_,i)=>{let a=i*Math.PI/3;return{e:"H",x:1.48*Math.cos(a),y:1.48*Math.sin(a),z:0}})]},
 h2:{name:"Hydrogen",formula:"H₂",atoms:[{e:"H",x:-.37,y:0,z:0},{e:"H",x:.37,y:0,z:0}]},
 o2:{name:"Oxygen",formula:"O₂",atoms:[{e:"O",x:-.61,y:0,z:0},{e:"O",x:.61,y:0,z:0}]},
 n2:{name:"Nitrogen",formula:"N₂",atoms:[{e:"N",x:-.55,y:0,z:0},{e:"N",x:.55,y:0,z:0}]},
 hcl:{name:"Hydrogen chloride",formula:"HCl",atoms:[{e:"H",x:-.63,y:0,z:0},{e:"Cl",x:.63,y:0,z:0}]},
 h2s:{name:"Hydrogen sulfide",formula:"H₂S",atoms:[{e:"S",x:0,y:0,z:0},{e:"H",x:.95,y:.32,z:0},{e:"H",x:-.65,y:.72,z:0}]},
 so2:{name:"Sulfur dioxide",formula:"SO₂",atoms:[{e:"S",x:0,y:0,z:0},{e:"O",x:1.05,y:.45,z:0},{e:"O",x:-1.05,y:.45,z:0}]},
 so3:{name:"Sulfur trioxide",formula:"SO₃",atoms:[{e:"S",x:0,y:0,z:0},{e:"O",x:1.15,y:0,z:0},{e:"O",x:-.58,y:1,z:0},{e:"O",x:-.58,y:-1,z:0}]},
 nh4:{name:"Ammonium",formula:"NH₄⁺",atoms:[{e:"N",x:0,y:0,z:0},{e:"H",x:.63,y:.63,z:.63},{e:"H",x:-.63,y:-.63,z:.63},{e:"H",x:-.63,y:.63,z:-.63},{e:"H",x:.63,y:-.63,z:-.63}]},
 no2:{name:"Nitrogen dioxide",formula:"NO₂",atoms:[{e:"N",x:0,y:0,z:0},{e:"O",x:1.0,y:.35,z:0},{e:"O",x:-1.0,y:.35,z:0}]},
 no3:{name:"Nitrate",formula:"NO₃⁻",atoms:[{e:"N",x:0,y:0,z:0},{e:"O",x:1.05,y:0,z:0},{e:"O",x:-.52,y:.9,z:0},{e:"O",x:-.52,y:-.9,z:0}]},
 ch4o:{name:"Methanol",formula:"CH₄O",atoms:[{e:"C",x:0,y:0,z:0},{e:"O",x:1.15,y:0,z:0},{e:"H",x:1.48,y:.5,z:0},{e:"H",x:-.5,y:.7,z:.5},{e:"H",x:-.5,y:-.7,z:.5},{e:"H",x:-.5,y:0,z:-.8}]},
 ethanol:{name:"Ethanol",formula:"C₂H₆O",atoms:[{e:"C",x:-.65,y:0,z:0},{e:"C",x:.65,y:0,z:0},{e:"O",x:1.65,y:0,z:0},{e:"H",x:2.0,y:.5,z:0},{e:"H",x:-1.0,y:.55,z:.5},{e:"H",x:-1.0,y:-.55,z:.5},{e:"H",x:-1.0,y:0,z:-.7},{e:"H",x:.65,y:.65,z:.7},{e:"H",x:.65,y:-.65,z:.7}]},
 acetic:{name:"Acetic acid",formula:"C₂H₄O₂",atoms:[{e:"C",x:-.65,y:0,z:0},{e:"C",x:.65,y:0,z:0},{e:"O",x:1.25,y:.75,z:0},{e:"O",x:1.15,y:-.85,z:0},{e:"H",x:1.7,y:-1.1,z:0},{e:"H",x:-1.0,y:.55,z:.5},{e:"H",x:-1.0,y:-.55,z:.5},{e:"H",x:-1.0,y:0,z:-.7}]},
 glucose:{name:"Glucose",formula:"C₆H₁₂O₆",atoms:[{e:"C",x:0,y:0,z:0},{e:"C",x:1.1,y:.2,z:.2},{e:"C",x:1.6,y:1.25,z:0},{e:"C",x:.8,y:1.95,z:-.3},{e:"C",x:-.3,y:1.65,z:.2},{e:"O",x:-.65,y:.65,z:0},{e:"O",x:2.5,y:1.35,z:0},{e:"O",x:1.0,y:2.85,z:0},{e:"O",x:-.75,y:2.25,z:.6},{e:"O",x:-.55,y:-1.0,z:0}]},
 caffeine:{name:"Caffeine",formula:"C₈H₁₀N₄O₂",atoms:[
 {e:"N",x:-1.0,y:.55,z:0},{e:"C",x:-.25,y:1.05,z:0},{e:"N",x:.55,y:.55,z:0},{e:"C",x:.85,y:-.25,z:0},{e:"N",x:.15,y:-.95,z:0},{e:"C",x:-.7,y:-.8,z:0},{e:"C",x:-1.65,y:-.35,z:0},{e:"N",x:-1.8,y:.55,z:0},{e:"O",x:.0,y:1.85,z:0},{e:"O",x:-1.0,y:-1.65,z:0}]},
 aspirin:{name:"Aspirin",formula:"C₉H₈O₄",atoms:[{e:"C",x:0,y:0,z:0},{e:"C",x:1,y:.2,z:0},{e:"C",x:1.5,y:1.1,z:0},{e:"C",x:.8,y:1.8,z:0},{e:"C",x:-.2,y:1.6,z:0},{e:"C",x:-.7,y:.7,z:0},{e:"C",x:2.5,y:1.4,z:0},{e:"O",x:3.35,y:.85,z:0},{e:"O",x:2.7,y:2.5,z:0},{e:"O",x:-1.7,y:.5,z:0},{e:"O",x:-2.5,y:1.2,z:0}]},
 ammonia_complex:{name:"Sulfuric acid",formula:"H₂SO₄",atoms:[{e:"S",x:0,y:0,z:0},{e:"O",x:1.15,y:0,z:0},{e:"O",x:-1.15,y:0,z:0},{e:"O",x:0,y:1.15,z:0},{e:"O",x:0,y:-1.15,z:0},{e:"H",x:0,y:1.65,z:.2},{e:"H",x:0,y:-1.65,z:.2}]}
};
const colors={H:0xffffff,C:0x50555e,N:0x4d7cff,O:0xff4f6d,F:0x8ee66b,Cl:0x63d68a,S:0xffc84a,P:0xff9a42};
const radii={H:.24,C:.38,N:.34,O:.34,F:.31,Cl:.40,S:.40,P:.39};

document.querySelector("#app").innerHTML=`
<div class="shell">
<header><div class="brand"><span class="orb"></span><div><b>MOLECULAR</b><small>Structure</small></div></div>
<div class="search"><input id="name" placeholder="Search molecule • e.g. caffeine, glucose, aspirin"/><button id="load">Load</button></div>
<div class="status"><i></i> 3D ENGINE</div></header>
<main><section class="stage"><div id="viewer"></div>
<div class="hud"><div><strong id="molName">Water</strong><span id="formula">H₂O</span></div><button id="reset">Reset view</button></div>
<div class="hint">Drag to rotate · Scroll to zoom · Click an atom for details</div></section>
<aside><div class="panel-title">MOLECULE LIBRARY</div><input id="filter" class="filter" placeholder="Filter models…"><div class="preset-grid" id="library">${Object.entries(presets).map(([k,v])=>`<button class="preset" data-p="${k}"><b>${v.formula}</b><span>${v.name}</span></button>`).join("")}</div>
<div class="divider"></div><div class="panel-title">STYLE</div>
<div class="seg"><button class="active" data-style="stick">Ball & Stick</button><button data-style="sphere">Space Fill</button></div>
<label class="switchrow">Atom labels <input id="labels" type="checkbox"></label>
<label class="switchrow">Auto rotate <input id="autorot" type="checkbox"></label>
<div class="divider"></div><div class="panel-title">INSPECT</div><div id="info" class="info">Select an atom to inspect its element.</div>
<div class="footer">Data-ready architecture · PubChem compatible</div>
</aside></main></div>`;

const viewer=document.querySelector("#viewer");
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x06070b);
const camera=new THREE.PerspectiveCamera(42,viewer.clientWidth/viewer.clientHeight,.1,100);
camera.position.set(0,0,6);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(viewer.clientWidth,viewer.clientHeight); renderer.outputColorSpace=THREE.SRGBColorSpace;
viewer.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true; controls.minDistance=2.5; controls.maxDistance=15;
scene.add(new THREE.HemisphereLight(0xcdd7ff,0x161827,2.2));
const key=new THREE.DirectionalLight(0xffffff,3); key.position.set(3,4,6); scene.add(key);
const group=new THREE.Group(); scene.add(group);
let current="water", style="stick", auto=false, atomMeshes=[];

function cylBetween(a,b,r=.08){
 const dir=new THREE.Vector3().subVectors(b,a), len=dir.length(), mid=new THREE.Vector3().addVectors(a,b).multiplyScalar(.5);
 const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,18),new THREE.MeshStandardMaterial({color:0xb7bdcc,metalness:.65,roughness:.24}));
 m.position.copy(mid); m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()); return m;
}
function bonds(atoms){
  // Educational proximity bonding; presets can be replaced with exact SDF bonds.
  const out=[]; for(let i=0;i<atoms.length;i++) for(let j=i+1;j<atoms.length;j++){
    const a=new THREE.Vector3(atoms[i].x,atoms[i].y,atoms[i].z), b=new THREE.Vector3(atoms[j].x,atoms[j].y,atoms[j].z);
    const d=a.distanceTo(b);
    if(d<1.45 && !(atoms[i].e==="H"&&atoms[j].e==="H")) out.push([i,j]);
  } return out;
}
function loadMol(key){
 current=key; const mol=presets[key]; group.clear(); atomMeshes=[];
 mol.atoms.forEach((a,i)=>{const p=new THREE.Vector3(a.x,a.y,a.z);
   const mesh=new THREE.Mesh(new THREE.SphereGeometry(radii[a.e]||(style==="sphere"?0.45:.3),32,20),
   new THREE.MeshStandardMaterial({color:colors[a.e]??0xffffff,metalness:.18,roughness:.25,emissive:colors[a.e]??0xffffff,emissiveIntensity:.04}));
   mesh.position.copy(p); mesh.userData={element:a.e,index:i}; group.add(mesh); atomMeshes.push(mesh);
 });
 bonds(mol.atoms).forEach(([i,j])=>group.add(cylBetween(atomMeshes[i].position,atomMeshes[j].position,style==="sphere"?0.045:.075)));
 document.querySelector("#molName").textContent=mol.name; document.querySelector("#formula").textContent=mol.formula;
 camera.position.set(0,0,6); controls.target.set(0,0,0); controls.update();
}
loadMol("water");

const ray=new THREE.Raycaster(), mouse=new THREE.Vector2();
renderer.domElement.addEventListener("pointerdown",e=>{
 const r=renderer.domElement.getBoundingClientRect(); mouse.x=((e.clientX-r.left)/r.width)*2-1; mouse.y=-((e.clientY-r.top)/r.height)*2+1;
 ray.setFromCamera(mouse,camera); const hit=ray.intersectObjects(atomMeshes)[0];
 if(hit){const {element,index}=hit.object.userData; document.querySelector("#info").innerHTML=`<b>${element}</b><span>Atom ${index+1} · atomic element</span><small>Click another atom to inspect it.</small>`;}
});
document.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>loadMol(b.dataset.p));
document.querySelector("#filter").oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll("#library .preset").forEach(b=>b.style.display=b.textContent.toLowerCase().includes(q)?"":"none")};
document.querySelectorAll("[data-style]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-style]").forEach(x=>x.classList.remove("active"));b.classList.add("active");style=b.dataset.style;loadMol(current)});
document.querySelector("#reset").onclick=()=>{camera.position.set(0,0,6);controls.target.set(0,0,0);controls.update()};
document.querySelector("#autorot").onchange=e=>auto=e.target.checked;
document.querySelector("#labels").onchange=e=>alert("Labels are prepared for the next molecular-data layer.");
document.querySelector("#load").onclick=async()=>{
 const q=document.querySelector("#name").value.trim(); if(!q)return;
 document.querySelector("#info").textContent="Looking up molecule…";
 try{
   const url=`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(q)}/property/Title,MolecularFormula,Conformer3D/JSON`;
   const res=await fetch(url); if(!res.ok) throw new Error("not found"); const data=await res.json();
   const p=data.PropertyTable?.Properties?.[0];
   document.querySelector("#molName").textContent=p?.Title||q;
   document.querySelector("#formula").textContent=p?.MolecularFormula||"";
   document.querySelector("#info").innerHTML="<b>PubChem match found</b><span>3D conformer metadata loaded.</span><small>Use the preset molecules for the fully rendered demo scene.</small>";
 }catch(e){document.querySelector("#info").innerHTML="<b>Not found</b><span>Try water, methane, ammonia, CO₂, or benzene.</span>";}
};
window.addEventListener("resize",()=>{camera.aspect=viewer.clientWidth/viewer.clientHeight;camera.updateProjectionMatrix();renderer.setSize(viewer.clientWidth,viewer.clientHeight)});
function animate(){requestAnimationFrame(animate);if(auto)group.rotation.y+=.004;controls.update();renderer.render(scene,camera)} animate();
