//====================================
// Electron Configuration Generator
// Aufbau Principle
//====================================


const orbitals = [

    {
        name:"1s",
        capacity:2
    },

    {
        name:"2s",
        capacity:2
    },

    {
        name:"2p",
        capacity:6
    },

    {
        name:"3s",
        capacity:2
    },

    {
        name:"3p",
        capacity:6
    },

    {
        name:"4s",
        capacity:2
    },

    {
        name:"3d",
        capacity:10
    },

    {
        name:"4p",
        capacity:6
    },

    {
        name:"5s",
        capacity:2
    },

    {
        name:"4d",
        capacity:10
    },

    {
        name:"5p",
        capacity:6
    },

    {
        name:"6s",
        capacity:2
    },

    {
        name:"4f",
        capacity:14
    },

    {
        name:"5d",
        capacity:10
    },

    {
        name:"6p",
        capacity:6
    },

    {
        name:"7s",
        capacity:2
    },

    {
        name:"5f",
        capacity:14
    },

    {
        name:"6d",
        capacity:10
    }

];





export function getElectronConfiguration(
    electronCount
){


    let remaining =
    electronCount;


    const configuration = [];



    for(
        let orbital of orbitals
    ){


        if(remaining <=0)
            break;



        const electrons =
        Math.min(
            remaining,
            orbital.capacity
        );



        configuration.push({

            orbital:orbital.name,

            electrons:electrons

        });



        remaining -= electrons;


    }



    return configuration;


}