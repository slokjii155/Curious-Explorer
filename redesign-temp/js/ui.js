// ui.js
// ===============================================
// VisualChemistryExplorer
// Small Pointer Tooltip System
// ===============================================


let tooltip = null;



// ===============================================
// CREATE TOOLTIP
// ===============================================


export function createInfoPanel(){


    if(tooltip)
        return;



    tooltip =
    document.createElement("div");


    tooltip.id =
    "hover-tooltip";



    document.body.appendChild(
        tooltip
    );




    const style =
    document.createElement("style");



    style.innerHTML = `


#hover-tooltip{


    position:fixed;


    pointer-events:none;


    min-width:220px;


    padding:14px 18px;


    background:

    rgba(15,20,45,0.65);



    backdrop-filter:

    blur(15px);



    -webkit-backdrop-filter:

    blur(15px);



    border:

    1px solid rgba(255,255,255,0.18);



    border-radius:16px;



    color:white;



    font-family:

    Arial, sans-serif;



    font-size:14px;



    line-height:1.6;



    opacity:0;



    transform:translateY(10px);



    transition:

    opacity .2s ease,

    transform .2s ease;



    z-index:9999;



    box-shadow:

    0 0 25px rgba(0,220,255,0.35);



}



#hover-tooltip b{


    color:#66ffff;


    font-size:16px;


}


`;



    document.head.appendChild(
        style
    );


}







// ===============================================
// SHOW TOOLTIP
// ===============================================


export function showInfo(
    data,
    x,
    y
){



    if(!tooltip)

        createInfoPanel();





    if(data.type==="shell"){



        tooltip.innerHTML = `


        <b>${data.name}</b>

        <br><br>


        Principal Quantum Number:

        <b>${data.n}</b>


        <br>


        Electrons:

        <b>${data.electrons}</b>


        <br>


        Radius:

        <b>${data.radius.toFixed(2)}</b>


        <br>


        Maximum Capacity:

        <b>${data.capacity}</b>


        `;



    }





    else if(data.type==="electron"){



        tooltip.innerHTML = `


        <b>${data.name}</b>


        <br><br>


        Shell:

        <b>${data.shell}</b>


        <br>


        Charge:

        <b>${data.charge}</b>


        `;



    }





    else if(data.type==="element"){



        tooltip.innerHTML = `


        <b>${data.name}</b>


        <br><br>


        Symbol:

        <b>${data.symbol}</b>


        <br>


        Atomic Number:

        <b>${data.atomicNumber}</b>


        <br>


        Category:

        <b>${data.category}</b>


        `;



    }





    else if(data.type==="orbital"){



        tooltip.innerHTML = `


        <b>${data.name}</b>


        <br><br>


        Shape:

        <b>${data.shape}</b>


        <br>


        Maximum Electrons:

        <b>${data.maxElectrons}</b>


        `;



    }





    else{


        tooltip.innerHTML = `


        <b>${data.name ?? data.type}</b>


        `;


    }







    tooltip.style.left =

    (x + 18) + "px";



    tooltip.style.top =

    (y + 18) + "px";





    tooltip.style.opacity = 1;


    tooltip.style.transform =
    "translateY(0)";



}







// ===============================================
// HIDE TOOLTIP
// ===============================================


export function hideInfo(){



    if(!tooltip)

        return;




    tooltip.style.opacity = 0;


    tooltip.style.transform =
    "translateY(10px)";



}