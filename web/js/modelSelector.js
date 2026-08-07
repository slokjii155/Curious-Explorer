//====================================
// Model Selector
//====================================

import { setModel } from "./modelManager.js";

export function initializeModelSelector(onChange) {

    const selector = document.getElementById("modelSelect");

    if (!selector) return;

    selector.value = "bohr";

    selector.addEventListener("change", () => {

        const model = selector.value;

        setModel(model);

        if (onChange) {

            onChange(model);

        }

    });

}