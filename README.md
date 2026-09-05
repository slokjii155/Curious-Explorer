# Curious Explorer

> Explore. Visualize. Understand.
<img width="755" height="411" alt="image" src="https://github.com/user-attachments/assets/32ecfffc-5835-4e37-ab24-4577b9b76b44" />
<img width="832" height="421" alt="image" src="https://github.com/user-attachments/assets/2895469a-1065-4e27-82b1-f11cf3026719" />
<img width="502" height="358" alt="image" src="https://github.com/user-attachments/assets/d2387e83-995e-4d83-9599-8e499ae1b70e" />

<img width="853" height="533" alt="image" src="https://github.com/user-attachments/assets/0ae07c2e-e2cf-4f5b-b1e8-ba2001995822" />
<img width="851" height="533" alt="image" src="https://github.com/user-attachments/assets/53584804-c779-4602-9e88-ab05a4b3ca90" />
<img width="545" height="103" alt="image" src="https://github.com/user-attachments/assets/ba23843c-0d7e-47a8-8a92-93694915ed92" />
<img width="190" height="332" alt="image" src="https://github.com/user-attachments/assets/8fed3f56-2da3-4201-91ba-afe8e8f0ad38" />
<img width="851" height="533" alt="image" src="https://github.com/user-attachments/assets/aeb36d20-5e4f-4354-a66a-4155034048e4" />


Curious Explorer is an immersive interactive learning platform built to make science and mathematics easier to understand through visual, interactive experiences.

Instead of learning only from static pages, Curious Explorer is designed around exploration — interact with concepts, visualize structures, and understand how things work.

---

## 🌌 What is Curious Explorer?

Curious Explorer is being developed as a unified interactive educational platform for:

- ⚛️ Chemistry
- ⚡ Physics
- 📐 Mathematics

The platform is designed to grow into a collection of interactive learning experiences rather than a traditional textbook-style website.

### Current Status

| Subject | Status |
|---|---|
| ⚛️ Chemistry | 🟢 Available |
| ⚡ Physics | 🟡 Coming Soon |
| 📐 Mathematics | 🟡 Coming Soon |

---

# ⚛️ Visual Chemistry Explorer

Chemistry is the first major interactive experience inside Curious Explorer.

Visual Chemistry Explorer allows users to explore atomic structures through interactive 3D visualization.

### Features

- 🧪 Interactive Periodic Table
- ⚛️ 3D Atomic Visualization
- 🌀 Bohr Atomic Model
- ☁️ Quantum Orbital Model
- 🔵 Interactive Electrons
- 🌌 Immersive 3D Environment
- 🔬 Element Exploration
- 📱 Responsive interaction
- 🖱️ Interactive mouse controls
- 👆 Touch-friendly exploration

---

## 🧪 Interactive Periodic Table

The Chemistry experience includes an interactive periodic table where users can hover or tap elements to inspect them.

Selecting an element connects the periodic table with the 3D chemistry experience, allowing users to move from element information into visual exploration.

---

## ⚛️ Atomic Models

Visual Chemistry Explorer currently focuses on two major ways of visualizing atomic structure.

### Bohr Model

Explore electrons arranged around the nucleus in recognizable atomic shells.

The model provides an intuitive visual representation of electron-shell structure.

### Quantum Orbital Model

Explore atomic orbitals through a more modern representation of electron probability.

The project includes support for:

- s orbitals
- p orbitals
- d orbitals
- f orbitals

The goal is to make abstract quantum concepts easier to visually understand.

---

# 🖥️ Technology

Curious Explorer is built primarily for the modern web.

### Core Technologies

- HTML5
- CSS3
- JavaScript
- Three.js
- Vite
- WebGL

### 3D

Three.js and WebGL are used to create the interactive atomic visualization and immersive 3D environment.

### Build System

Vite is used for development and production builds.

---

# 📁 Project Structure

```text
VCE/
│
├── web/
│   ├── index.html
│   ├── chemistry.html
│   ├── explorer.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   ├── explorerHome.js
│   │   ├── atom.js
│   │   ├── atomBuilder.js
│   │   ├── electron.js
│   │   ├── elements.js
│   │   ├── modelManager.js
│   │   ├── modelSelector.js
│   │   ├── nucleus.js
│   │   ├── orbit.js
│   │   ├── periodicTable.js
│   │   ├── scene.js
│   │   ├── shell.js
│   │   ├── shellLayout.js
│   │   ├── stars.js
│   │   └── ui.js
│   │
│   ├── common/
│   │   ├── controls.js
│   │   ├── lighting.js
│   │   └── scene.js
│   │
│   ├── quantum/
│   │   ├── electronConfiguration.js
│   │   ├── nucleus.js
│   │   ├── orbitalData.js
│   │   ├── orbitalFactory.js
│   │   ├── quantumAtom.js
│   │   └── orbitals/
│   │       ├── sOrbital.js
│   │       ├── pOrbital.js
│   │       ├── dOrbital.js
│   │       └── fOrbital.js
│   │
│   ├── ui/
│   │   └── elementSelector.js
│   │
│   ├── bohr/
│   ├── models/
│   ├── textures/
│   ├── fonts/
│   └── assets/
│
├── package.json
├── vite.config.js
└── README.md
