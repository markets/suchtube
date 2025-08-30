import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

export const createArgumentsParser = (argv = process.argv) => {
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

export const parseArguments = (argString) => {
  const args = argString.split(' ')
  return createArgumentsParser(args).parse(argString)
}