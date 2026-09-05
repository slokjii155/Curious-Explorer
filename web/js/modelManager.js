import {
    createAtom,
    updateAtom,
    setAtomElectronSpeed
} from "./atom.js";

import {
    createQuantumAtom,
    updateQuantumAtom
} from "../quantum/quantumAtom.js";

let currentModel = "bohr";


//====================================
// Set Current Model
//====================================

export function setModel(model) {

    currentModel = model;

}


//====================================
// Get Current Model
//====================================

export function getCurrentModel() {

    return currentModel;

}


//====================================
// Create Selected Model
//====================================

export function createModel(element) {

    if (currentModel === "bohr") {

        return createAtom(element);

    }

    return createQuantumAtom(element);

}


//====================================
// Update Selected Model
//====================================

export function updateModel(atom, time) {

    if (!atom) return;

    if (currentModel === "bohr") {

        updateAtom(atom);

    } else {

        updateQuantumAtom(atom, time);

    }

}


//====================================
// Electron Speed
//====================================

export function setModelElectronSpeed(atom, speed) {

    if (!atom) return;

    if (currentModel === "bohr") {

        setAtomElectronSpeed(atom, speed);

    }

    // Quantum model me abhi speed control implement nahi hai.
    // Future me orbital animation speed yahin handle hogi.

}