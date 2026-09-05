import * as THREE from "three";



export class Electron {



    constructor(theme) {



        //--------------------------------
        // Electron Geometry
        //--------------------------------

        const geometry = new THREE.SphereGeometry(

            0.12,

            32,

            32

        );







        //--------------------------------
        // Theme Colors
        //--------------------------------


        const electronColor =

            theme?.electronColor || 0x66ffff;



        const glowColor =

            theme?.glowColor || 0x00ffff;








        //--------------------------------
        // Electron Material
        //--------------------------------


        const material = new THREE.MeshStandardMaterial({


            color: electronColor,


            emissive: glowColor,


            emissiveIntensity:2.2,


            metalness:0.15,


            roughness:0.2,


        });








        this.mesh = new THREE.Mesh(

            geometry,

            material

        );







        //--------------------------------
        // Electron Information Data
        //--------------------------------


        this.mesh.userData = {


            type:"electron",


            name:"Electron",


            charge:"-1 e",


            mass:"9.109 × 10⁻³¹ kg",


            spin:"±1/2",


            shell:null,


            shellNumber:null,


            orbital:null,


            velocity:"Variable",


            quantumNumbers:{


                n:null,

                l:null,

                m:null,

                s:null


            }



        };









        //--------------------------------
        // Soft Electron Glow
        //--------------------------------


        const glow = new THREE.PointLight(


            glowColor,


            0.35,


            2.2


        );



        this.mesh.add(

            glow

        );




    }



}