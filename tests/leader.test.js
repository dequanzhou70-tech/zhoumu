import test from 'node:test';
import assert from 'node:assert/strict';
import {types, questions, evaluate} from '../src/leader/data.js';
test('all leader profiles can be reached with independent observed evidence',()=>{
 assert.equal(questions.length,18);
 for(const type of types){
 const answers=questions.map(q=>{const i=q.options.findIndex(o=>o.scores.includes(type.id));return i<0?4:i;});
 const r=evaluate(answers);assert.equal(r.primary?.id,type.id);assert.ok(r.primary.score>=3);
 }
});
test('missing and sparse observations cannot invent a profile',()=>{
 assert.equal(evaluate(Array(18).fill(4)).primary,null);
 assert.equal(evaluate([0,0,0]).primary,null);
 assert.equal(evaluate(Array(18).fill(99)).known,0);
});
test('mixed leaders retain evidence for a secondary style',()=>{
 let found=false;
 for(let n=1;n<18;n++){
 const a=questions.map((q,i)=>{const id=i<n?'meeting':'detail';const j=q.options.findIndex(o=>o.scores.includes(id));return j<0?4:j;});
 const r=evaluate(a);if(r.secondary){assert.ok(r.secondary.score>=3);found=true;break;}
 }assert.ok(found);
});
