import test from 'ava'
import { parseArguments } from '../src/yargs-config.js'

test('parseArguments handles --random alias', t => {
  const args1 = parseArguments('top music 2025 --random')
  const args2 = parseArguments('top music 2025 -r')
  
  t.is(args1.random, true)
  t.is(args2.random, true)
  t.deepEqual(args1._, args2._)
})

test('parseArguments handles --all alias', t => {
  const args1 = parseArguments('javascript tutorials --all')
  const args2 = parseArguments('javascript tutorials -a')
  
  t.is(args1.all, true)
  t.is(args2.all, true)
  t.deepEqual(args1._, args2._)
})

test('parseArguments handles --duration alias', t => {
  const args1 = parseArguments('funny videos --duration=short')
  const args2 = parseArguments('funny videos -d=short')
  
  t.is(args1.duration, 'short')
  t.is(args2.duration, 'short')
  t.deepEqual(args1._, args2._)
})

test('parseArguments handles --time alias', t => {
  const args1 = parseArguments('cats --time=10')
  const args2 = parseArguments('cats -t=10')
  
  t.is(args1.time, 10)
  t.is(args2.time, 10)
  t.deepEqual(args1._, args2._)
})

test('parseArguments handles multiple aliases together', t => {
  const args1 = parseArguments('music videos --random --all --duration=short')
  const args2 = parseArguments('music videos -r -a -d=short')
  
  t.is(args1.random, true)
  t.is(args1.all, true) 
  t.is(args1.duration, 'short')
  t.is(args2.random, true)
  t.is(args2.all, true)
  t.is(args2.duration, 'short')
  t.deepEqual(args1._, args2._)
})

test('parseArguments extracts query correctly', t => {
  const args = parseArguments('top music 2025 -r')
  
  t.deepEqual(args._, ['top', 'music', 2025])
  t.is(args.random, true)
})