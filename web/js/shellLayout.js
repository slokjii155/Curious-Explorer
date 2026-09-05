export function buildElectronLayout({ shellIndex, electronCount, radius }) {
  const positions = [];

  if (electronCount <= 0) {
    return positions;
  }

  // Position electrons directly ON the orbital ring (circular path at radius distance)
  for (let i = 0; i < electronCount; i++) {
    const angle = (i / electronCount) * Math.PI * 2;
    
    // Position exactly on the orbital ring
    const x = radius * Math.cos(angle);
    const y = 0; // On the orbital plane
    const z = radius * Math.sin(angle);

    positions.push({
      angle,
      x,
      y,
      z,
    });
  }

  console.log(`Layout for shell ${shellIndex}: ${electronCount} electrons positioned ON orbital ring`);
  return positions;
}
