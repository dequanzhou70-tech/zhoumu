import test from 'node:test';
import assert from 'node:assert/strict';
import { scenes, getResult, resultTypes } from '../src/story.js';

const answers = index => Array(scenes.length).fill(index);

test('ten complete scenes cover four chapters and every signal dimension', () => {
  assert.equal(scenes.length, 10);
  assert.equal(new Set(scenes.map(scene => scene.id)).size, scenes.length);
  assert.deepEqual([...new Set(scenes.map(scene => scene.chapter))], ['01', '02', '03', '04']);
  assert.deepEqual(new Set(scenes.map(scene => scene.dimension)), new Set(['initiative', 'attention', 'investment', 'consistency']));
  for (const scene of scenes) {
    for (const key of ['title', 'chapterTitle', 'narrative', 'prompt', 'time', 'location']) {
      assert.equal(typeof scene[key], 'string');
      assert.ok(scene[key].length > 0);
    }
    assert.deepEqual(scene.options.map(option => option.signal), [0, 1, 2, 3, null]);
    for (const option of scene.options) {
      assert.ok(option.label && option.detail && option.reaction);
      if (option.signal !== null) assert.ok(option.evidence);
    }
  }
});

test('missing observations do not masquerade as low interest', () => {
  const unknown = getResult(answers(4));
  assert.equal(unknown.id, 'unknown');
  assert.equal(unknown.score, null);
  assert.equal(unknown.confidence, '线索不足');
  assert.equal(unknown.knownCount, 0);
  assert.deepEqual(unknown.evidence, []);
  assert.ok(unknown.dimensions.every(dimension => dimension.value === null));
  assert.equal(getResult([3, 3, 3]).score, null);
});

test('unknown observations are excluded from totals and confidence reflects sparse evidence', () => {
  const sparse = [3, 3, 4, 4, 4, 3, 4, 4, 3, 4];
  const result = getResult(sparse);
  assert.equal(result.score, 100);
  assert.equal(result.knownCount, 4);
  assert.equal(result.confidence, '线索有限');
  assert.match(result.caution, /只有 4 \/ 10 个片段/);
  assert.equal(result.dimensions.find(d => d.key === 'attention').value, null);
});

test('ordinary, growing and sustained observations produce different endings', () => {
  const friendly = answers(1);
  friendly[8] = 2; // Respectful behavior, without overriding the overall low initiative.
  assert.equal(getResult(friendly).id, 'friendly');
  assert.equal(getResult(friendly).score, 37);
  assert.equal(getResult(answers(2)).id, 'spark');
  assert.equal(getResult(answers(2)).score, 67);
  assert.equal(getResult(answers(3)).id, 'mutual');
  assert.equal(getResult(answers(3)).score, 100);
  assert.equal(getResult(answers(3)).confidence, '线索充足');
});

test('contradictory high and low observations produce the uncertain ending', () => {
  const mixed = answers(2);
  mixed[0] = 3; mixed[1] = 3; mixed[2] = 0; mixed[3] = 0;
  assert.equal(getResult(mixed).id, 'fog');
});

test('pressure or repeated boundary violations overrides otherwise glowing evidence', () => {
  for (const boundaryAnswer of [0, 1]) {
    const glowing = answers(3);
    glowing[8] = boundaryAnswer;
    const result = getResult(glowing);
    assert.equal(result.id, 'fog');
    assert.match(result.description, /边界/);
    assert.match(result.nextStep, /界限/);
    assert.ok(result.evidence.includes(scenes[8].options[boundaryAnswer].evidence));
  }
});

test('respect and attention alone do not produce a romantic mutual ending', () => {
  const attentionOnly = answers(4);
  for (const index of [2, 3, 4, 8, 9]) attentionOnly[index] = 3;
  const result = getResult(attentionOnly);
  assert.equal(result.score, 100);
  assert.equal(result.id, 'spark');
  assert.match(result.caution, /缺少主动靠近或具体投入/);
});

test('UI relation and style values change context reminders without changing scores', () => {
  const baseline = getResult(answers(2));
  for (const relation of ['同学 / 同事', '朋友', '刚刚认识', '主要在线上']) {
    for (const style of ['比较主动', '比较慢热', '还不确定']) {
      const result = getResult(answers(2), { relation, style });
      assert.equal(result.score, baseline.score);
      assert.equal(result.id, baseline.id);
      assert.deepEqual(result.dimensions, baseline.dimensions);
      if (style === '比较慢热') assert.match(result.caution, /比较慢热/);
      if (relation === '主要在线上') assert.match(result.caution, /线上互动/);
    }
  }
});

test('evidence comes only from selected known answers', () => {
  const selected = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  const allowed = new Set(selected.map((answer, index) => scenes[index].options[answer].evidence).filter(Boolean));
  const result = getResult(selected);
  assert.ok(result.evidence.length > 0 && result.evidence.length <= 3);
  assert.equal(new Set(result.evidence).size, result.evidence.length);
  assert.ok(result.evidence.every(evidence => allowed.has(evidence)));
});

test('invalid selections cannot add invented signals or evidence', () => {
  const result = getResult([null, -1, 999, 1.2, '3', undefined]);
  assert.equal(result.knownCount, 0);
  assert.equal(result.score, null);
  assert.equal(result.id, 'unknown');
  assert.deepEqual(result.evidence, []);
});

test('gallery has the same five endings the result engine can produce', () => {
  assert.deepEqual(Object.keys(resultTypes), ['unknown', 'friendly', 'spark', 'mutual', 'fog']);
  for (const entry of Object.values(resultTypes)) {
    for (const field of ['title', 'subtitle', 'kicker', 'accent', 'description', 'quote', 'nextStep']) {
      assert.ok(entry[field]);
    }
  }
});
