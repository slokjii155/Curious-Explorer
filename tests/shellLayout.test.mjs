import test from 'node:test';
import assert from 'node:assert/strict';

import { buildElectronLayout } from '../web/js/shellLayout.js';

test('buildElectronLayout creates one placement per electron', () => {
  const layout = buildElectronLayout({ shellIndex: 1, electronCount: 8, radius: 5 });

  assert.equal(layout.length, 8);
  layout.forEach((position) => {
    assert.equal(typeof position.angle, 'number');
    assert.equal(typeof position.x, 'number');
    assert.equal(typeof position.y, 'number');
    assert.equal(typeof position.z, 'number');
  });
});

test('buildElectronLayout uses a different 3D position for each electron', () => {
  const layout = buildElectronLayout({ shellIndex: 2, electronCount: 7, radius: 6 });

  assert.notEqual(layout[0].x, layout[1].x);
  assert.notEqual(layout[0].z, layout[1].z);
  assert.notEqual(layout[0].y, layout[1].y);
});
