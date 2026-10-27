import test from 'node:test';
import assert from 'node:assert/strict';
import { scenes } from '../src/story.js';
import { choiceScenes, storySheets, sceneCrop } from '../src/choice-scenes.js';

test('all 24 visual choices bind to a distinct storyboard and observed-behaviour caption', () => {
  const options = scenes.filter(s => s.visual).flatMap(s => s.options.filter(o => o.signal !== null));
  assert.equal(options.length, 24);
  assert.deepEqual(new Set(options.map(o => o.imageKey)), new Set(Object.keys(choiceScenes)));
  for (const option of options) {
    const scene = choiceScenes[option.imageKey];
    assert.equal(scene.index, option.signal);
    assert.ok(scene.dialogue && scene.caption && scene.description.length > 20);
  }
  assert.equal(new Set(Object.values(choiceScenes).map(s => s.description)).size, 24);
});

test('each four-panel sheet has four separate, non-overlapping crops within its source image', () => {
  for (const [theme,sheet] of Object.entries(storySheets)) {
    const crops = [0,1,2,3].map(i => sceneCrop(`${theme}-${i}`));
    let area = 0;
    for (const crop of crops) {
      assert.ok(crop.x >= 0 && crop.y >= 0 && crop.width > 0 && crop.height > 0);
      assert.ok(crop.x + crop.width <= sheet.width && crop.y + crop.height <= sheet.height);
      area += crop.width * crop.height;
    }
    assert.equal(area, sheet.width * sheet.height);
    assert.equal(crops[0].x + crops[0].width, crops[1].x);
    assert.equal(crops[0].y + crops[0].height, crops[2].y);
    assert.equal(crops[2].x + crops[2].width, crops[3].x);
  }
  assert.equal(sceneCrop('not-an-option'), null);
});

test('the action and follow-up panels stay distinguishable from remembering or polite replies', () => {
  assert.match(choiceScenes['coffee-2'].description, /还没有.*购买/);
  assert.match(choiceScenes['coffee-3'].description, /递给我.*行动/);
  assert.match(choiceScenes['crowd-1'].description, /均等.*大家/);
  assert.match(choiceScenes['crowd-3'].description, /离开.*多走一段/);
  assert.match(choiceScenes['news-3'].description, /当时与后来/);
  assert.match(choiceScenes['calendar-3'].dialogue, /周六.*周日/);
  assert.match(choiceScenes['activity-1'].description, /没有一起规划/);
  assert.match(choiceScenes['activity-3'].description, /两个时点/);
});
