import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

/**
 * Creates a configured yargs instance with all SuchTube options and aliases
 * @param {string[]} argv - The argv array to parse (optional)
 * @returns {yargs.Argv} Configured yargs instance
 */
export const createYargsInstance = (argv = process.argv) => {
  return yargs(hideBin(argv))
    .locale('en')
    .usage('Usage: suchtube query [options]')
    .example('suchtube funny cats')
    .example('suchtube football top goals --open')
    .example('suchtube top summer songs --random')
    .example('suchtube trending videos --duration=short')
    .example('suchtube javascript tutorials --all')
    .example('suchtube --server')
    .alias('version', 'v')
    .alias('help', 'h')
    .option('random', {
      description: 'Search a random video',
      alias: 'r'
    })
    .option('time', {
      description: 'Start the video at the given time',
      alias: 't'
    })
    .option('open', {
      description: 'Open the video in your browser',
      alias: 'o'
    })
    .option('duration', {
      description: 'Filter videos by duration',
      alias: 'd',
      choices: ['any', 'short', 'medium', 'long']
    })
    .option('full', {
      description: 'Display full information',
      alias: 'f'
    })
    .option('all', {
      description: 'Return all videos from the search',
      alias: 'a'
    })
    .option('server', {
      description: 'Start SuchTube server',
      alias: 's'
    })
    .option('port', {
      description: 'Port for SuchTube server',
      alias: 'p',
      number: true
    })
}

/**
 * Parses command-line arguments using the SuchTube configuration
 * @param {string} argString - String of arguments to parse
 * @returns {object} Parsed arguments object
 */
export const parseArguments = (argString) => {
  const args = argString.split(' ')
  return createYargsInstance(args).parse(argString)
}