import test from 'node:test';
import assert from 'node:assert/strict';
import {ventilation} from '../src/lib/airflow.ts';

test('a closed internal door isolates a zone from the open window',()=>{
 assert.deepEqual(ventilation({west:true,doorA:false,doorB:true,east:false}).zones,[true,false,false]);
});
test('opening the connecting door propagates ventilation to the next zone',()=>{
 assert.deepEqual(ventilation({west:true,doorA:true,doorB:false,east:false}).zones,[true,true,false]);
});
test('east-side ventilation propagates in reverse through both open doors',()=>{
 const result=ventilation({west:false,doorA:true,doorB:true,east:true});
 assert.deepEqual(result.zones,[true,true,true]);assert.equal(result.cross,false);
});
test('all 16 opening combinations respect sealed boundaries and cross-flow requirements',()=>{
 for(let mask=0;mask<16;mask++){
  const [west,doorA,doorB,east]=[0,1,2,3].map(bit=>Boolean(mask&(1<<bit)));
  const result=ventilation({west,doorA,doorB,east});
  assert.equal(result.cross,mask===15);
  if(!west&&!east)assert.deepEqual(result.zones,[false,false,false]);
  if(!doorA)assert.equal(result.zones[0],west);
  if(!doorB)assert.equal(result.zones[2],east);
  if(!doorA&&!doorB)assert.equal(result.zones[1],false);
 }
});
