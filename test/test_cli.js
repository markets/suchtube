import test from 'ava'
import { execSync } from 'child_process'

test('CLI does not crash when no arguments provided', t => {
  try {
    // Execute the CLI with no arguments - should show help without error
    const result = execSync('./bin/suchtube', { 
      cwd: '/home/runner/work/suchtube/suchtube',
      encoding: 'utf8',
      timeout: 5000
    })
    
    // If we get here without exception, the CLI worked
    t.pass('CLI successfully showed help without crashing')
  } catch (error) {
    // Check if it's just a non-zero exit code with help output
    if (error.status === 0 || (error.stdout && error.stdout.includes('Usage:'))) {
      t.pass('CLI successfully showed help')
    } else {
      t.fail(`CLI crashed with error: ${error.message}`)
    }
  }
})