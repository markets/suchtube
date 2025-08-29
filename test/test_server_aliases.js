import test from 'ava'
import { parseArguments } from '../src/yargs-config.js'

test('server-style argument parsing handles aliases correctly', t => {
  // Simulate how server.js parses arguments
  const query1 = 'top music 2025 --random'
  const query2 = 'top music 2025 -r'
  
  const args1 = parseArguments(query1)
  const args2 = parseArguments(query2)
  
  // Both should parse to the same arguments
  t.is(args1.random, true)
  t.is(args2.random, true)
  t.deepEqual(args1._, args2._)
})

test('server-style parsing handles multiple aliases', t => {
  const query = 'javascript tutorials -r -a -d=short'
  const args = parseArguments(query)
  
  t.is(args.random, true)
  t.is(args.all, true)
  t.is(args.duration, 'short')
  t.deepEqual(args._, ['javascript', 'tutorials'])
})

test('server-style parsing matches original issue example', t => {
  // This is the exact scenario from the issue
  const args1 = parseArguments('top music 2025 --random')
  const args2 = parseArguments('top music 2025 -r')
  
  // Both should produce identical parsing results
  t.is(args1.random, true)
  t.is(args2.random, true)
  t.deepEqual(args1._, args2._)
  
  // The issue was that -r didn't work in the server, so this validates the fix
  t.is(args2.random, true, 'The -r alias should be properly recognized as --random')
})