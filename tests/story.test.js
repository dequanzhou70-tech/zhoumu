import test from 'node:test';
import assert from 'node:assert/strict';
import { scenes, getResult, resultTypes, profileExamples } from '../src/story.js';
import { researchSources } from '../src/research.js';

const answers = index => Array(scenes.length).fill(index);
const position = id => scenes.findIndex(scene => scene.id === id);
const sample = id => { const fixture = profileExamples[id]; return getResult(fixture.answers, fixture.context); };

// These tests verify observed behavior and user guidance, not a claim that the typology is clinically valid.
test('fourteen complete scenes cover four chapters and six separately observed dimensions', () => {
  assert.equal(scenes.length, 14);
  assert.equal(new Set(scenes.map(scene => scene.id)).size, scenes.length);
  assert.deepEqual([...new Set(scenes.map(scene => scene.chapter))], ['01', '02', '03', '04']);
  assert.deepEqual(new Set(scenes.map(scene => scene.dimension)), new Set(['initiative', 'attention', 'responsiveness', 'investment', 'consistency', 'boundaries']));
  for (const dimension of new Set(scenes.map(scene => scene.dimension))) assert.ok(scenes.filter(s => s.dimension === dimension).length >= 2);
  for (const scene of scenes) {
    for (const key of ['title', 'chapterTitle', 'narrative', 'prompt', 'time', 'location']) assert.ok(typeof scene[key] === 'string' && scene[key].length);
    assert.deepEqual(scene.options.map(option => option.signal), [0, 1, 2, 3, null]);
    for (const choice of scene.options) {
      assert.ok(choice.label && choice.detail && choice.reaction);
      if (choice.signal !== null) assert.ok(choice.evidence);
    }
  }
});

test('six visual-choice scenes describe actual observed interactions with four distinct images each', () => {
  const visual = scenes.filter(scene => scene.visual);
  assert.equal(visual.length, 6);
  assert.equal(new Set(visual.map(s => s.imageTheme)).size, visual.length);
  for (const scene of visual) {
    assert.ok(scene.prompt);
    assert.equal(new Set(scene.options.slice(0, 4).map(o => o.imageKey)).size, 4);
    assert.ok(scene.options.slice(0, 4).every(o => o.imageKey?.startsWith(scene.imageTheme)));
    assert.equal(scene.options[4].signal, null);
    assert.equal(scene.options[4].imageKey, undefined);
  }
});

test('all twelve relationship profiles are reachable from realistic deterministic observations', () => {
  assert.equal(Object.keys(resultTypes).length, 12);
  assert.deepEqual(Object.keys(profileExamples), Object.keys(resultTypes));
  const codes = new Set(); const motifs = new Set();
  for (const [id, fixture] of Object.entries(profileExamples)) {
    assert.equal(fixture.answers.length, scenes.length);
    assert.ok(['同学 / 同事', '朋友', '刚刚认识', '主要在线上'].includes(fixture.context.relation));
    assert.ok(['比较主动', '比较慢热', '还不确定'].includes(fixture.context.style));
    const result = getResult(fixture.answers, fixture.context);
    assert.equal(result.id, id, `profile ${id}`);
    assert.equal(result.profileCode, resultTypes[id].code);
    assert.equal(result.relationshipAttribute, resultTypes[id].attribute);
    assert.ok(result.tags.length === 3);
    codes.add(result.profileCode); motifs.add(result.motif);
    for (const field of ['title', 'subtitle', 'kicker', 'accent', 'description', 'quote', 'nextStep']) assert.ok(result[field]);
  }
  assert.equal(codes.size, 12); assert.equal(motifs.size, 12);
});

test('profiles capture relationship patterns instead of simply relabeling the same total score', () => {
  const chatty = sample('chatty'); const steady = sample('steady');
  assert.equal(chatty.score, steady.score);
  assert.notEqual(chatty.id, steady.id);
  assert.notEqual(chatty.nextStep, steady.nextStep);
  assert.notDeepEqual(chatty.actionPlan, steady.actionPlan);
});

test('missing observations remain unknown rather than scoring as rejection', () => {
  const unknown = getResult(answers(4));
  assert.equal(unknown.id, 'unknown'); assert.equal(unknown.score, null);
  assert.equal(unknown.confidence, '线索不足'); assert.equal(unknown.knownCount, 0);
  assert.deepEqual(unknown.evidence, []);
  assert.ok(unknown.dimensions.every(d => d.value === null && d.knownCount === 0));
  assert.ok(unknown.guidance.every(d => d.value === null && /没有|还没|未|有限/.test(d.interpretation)));
  assert.equal(getResult([3, 3, 3]).score, null);
});

test('unknown items are excluded from totals and sparse observations carry an explicit limitation', () => {
  const selected = answers(4);
  for (const id of ['midnight', 'coffee', 'invitation', 'boundary']) selected[position(id)] = 3;
  const result = getResult(selected);
  assert.equal(result.score, 100); assert.equal(result.knownCount, 4);
  assert.equal(result.confidence, '线索有限'); assert.match(result.caution, /只有 4 \/ 14/);
  assert.equal(result.dimensions.find(d => d.key === 'consistency').value, null);
  assert.notEqual(result.id, 'mutual');
});

test('romantic-sounding mutual profile requires broad observations of initiative, action and respect', () => {
  assert.equal(sample('mutual').id, 'mutual');
  const warmOnly = answers(4);
  scenes.forEach((scene, i) => { if (['attention', 'responsiveness', 'boundaries'].includes(scene.dimension)) warmOnly[i] = 3; });
  assert.equal(getResult(warmOnly).score, 100);
  assert.notEqual(getResult(warmOnly).id, 'mutual');
  assert.match(getResult(warmOnly).caution, /并非经过验证/);
});

test('boundary pressure overrides glowing romantic signals in either independently observed scene', () => {
  for (const id of ['boundary', 'disagreement']) for (const signal of [0, 1]) {
    const selected = answers(3); selected[position(id)] = signal;
    const result = getResult(selected);
    assert.equal(result.id, 'boundary');
    assert.match(result.description, /施压|越界/); assert.match(result.nextStep, /界限/);
    assert.ok(result.evidence.includes(scenes[position(id)].options[signal].evidence));
  }
});

test('a single recorded boundary violation prioritizes limits without inventing a total score', () => {
  for (const id of ['boundary', 'disagreement']) for (const signal of [0, 1]) {
    const selected = answers(4); selected[position(id)] = signal;
    const result = getResult(selected);
    assert.equal(result.id, 'boundary'); assert.equal(result.score, null);
    assert.equal(result.confidence, '线索不足'); assert.equal(result.knownCount, 1);
    assert.match(result.nextStep, /界限/);
    assert.doesNotMatch(result.nextStep, /邀约|邀请|发起/);
    assert.ok(result.guidance.every(g => !/邀约|邀请|共同活动/.test(g.tryThis)));
    assert.ok(result.actionPlan.every(g => !/约会|邀约/.test(g.action)));
  }
});

test('boundary guidance remains a priority even if its averaged dimension score looks moderate', () => {
  const selected = answers(3); selected[position('boundary')] = 1;
  const result = getResult(selected);
  assert.equal(result.id, 'boundary');
  assert.equal(result.guidance.find(g => g.key === 'boundaries').value, 67);
  assert.match(result.guidance.find(g => g.key === 'boundaries').interpretation, /施压|越界/);
  assert.match(result.guidance.find(g => g.key === 'boundaries').tryThis, /界限/);
  // The low observation itself, not an average, must govern advice.
  assert.match(result.nextStep, /界限/);
});

test('UI style background does not manufacture signals or change scores', () => {
  const fixture = profileExamples.slow;
  const baseline = getResult(fixture.answers);
  for (const style of ['比较主动', '比较慢热', '还不确定']) {
    const result = getResult(fixture.answers, { relation: '朋友', style });
    assert.equal(result.score, baseline.score); assert.equal(result.id, baseline.id);
    assert.deepEqual(result.dimensions, baseline.dimensions);
    if (style === '比较慢热') assert.match(result.caution, /不因此加分/);
  }
});

test('online context only selects its profile with real chat observations and unknown activity experiences', () => {
  const example = profileExamples.online;
  const online = getResult(example.answers, example.context);
  assert.equal(online.id, 'online');
  assert.equal(online.dimensions.find(d => d.key === 'investment').value, null);
  const baseline = getResult(example.answers, { relation: '朋友' });
  assert.equal(online.score, baseline.score); assert.notEqual(baseline.id, 'online');
  assert.notEqual(getResult(answers(4), example.context).id, 'online');
  assert.equal(getResult(profileExamples.mutual.answers, example.context).id, 'mutual');
});

test('each dimension has observation-specific practical guidance, a phrase to try and valid research links', () => {
  const sourceIds = new Set(researchSources.map(source => source.id));
  for (const example of Object.values(profileExamples)) {
    const result = getResult(example.answers, example.context);
    assert.equal(result.guidance.length, 6);
    for (const guide of result.guidance) {
      for (const field of ['observation', 'interpretation', 'tryThis', 'avoid', 'say']) assert.ok(guide[field]);
      assert.ok(guide.sourceIds.length && guide.sourceIds.every(id => sourceIds.has(id)));
    }
    assert.equal(result.actionPlan.length, 3);
    for (const step of result.actionPlan) assert.ok(step.label && step.action && step.observe);
  }
  const high = sample('mutual').guidance.find(g => g.key === 'responsiveness');
  const low = sample('spark').guidance.find(g => g.key === 'responsiveness');
  const unknown = sample('unknown').guidance.find(g => g.key === 'responsiveness');
  assert.notEqual(high.tryThis, low.tryThis); assert.notEqual(low.tryThis, unknown.tryThis);
});

test('evidence and per-dimension observation text quote only actually selected answers', () => {
  const selected = scenes.map((_, i) => i % 5);
  const allowed = new Set(selected.map((a, i) => scenes[i].options[a].evidence).filter(Boolean));
  const result = getResult(selected);
  assert.ok(result.evidence.length > 0 && result.evidence.length <= 3);
  assert.equal(new Set(result.evidence).size, result.evidence.length);
  assert.ok(result.evidence.every(evidence => allowed.has(evidence)));
  for (const guide of result.guidance) {
    for (const { choice } of scenes.map((scene, i) => ({ scene, choice: scene.options[selected[i]] })).filter(({ scene, choice }) => scene.dimension === guide.key && choice.evidence)) assert.ok(guide.observation.includes(choice.evidence));
  }
});

test('invalid selections cannot add invented signals, advice observations or evidence', () => {
  const result = getResult([null, -1, 999, 1.2, '3', undefined]);
  assert.equal(result.knownCount, 0); assert.equal(result.score, null);
  assert.equal(result.id, 'unknown'); assert.deepEqual(result.evidence, []);
  assert.ok(result.guidance.every(g => g.knownCount === 0));
});

test('conflicted and one-sided plans never ask users to chase repeated refusals', () => {
  assert.match(sample('onesided').nextStep, /明确拒绝/);
  assert.match(sample('onesided').actionPlan[1].action, /不再重复邀约/);
  assert.match(sample('fog').actionPlan[2].action, /调整投入/);
  assert.match(sample('chatty').nextStep, /停止追加投入/);
});
