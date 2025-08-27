import open from 'open'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { search } from './search.js'
import * as server from './server.js'

const yargsInstance = yargs(hideBin(process.argv))
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

const args = yargsInstance.argv

export const start = async () => {
  if (args.server) {
    if (args.port) {
      process.env.PORT = args.port
    }
    server.start()
  } else {
    const query = args._.join()
    if (!query) {
      return yargsInstance.showHelp()
    }

    const result = await search(query, args)

    if (!result) {
      return console.log('Not found 乁(ツ)ㄏ')
    }

    // Handle --all option (returns array of videos)
    if (args.all) {
      if (args.open) {
        // Open the first video when --all and --open are used together
        open(result[0].link)
        process.exit()
      } else {
        if (args.full) {
          console.log(result)
        } else {
          // Print just the links for all videos
          result.forEach(video => console.log(video.link))
        }
      }
    } else {
      // Handle single video result
      if (args.open) {
        open(result.link)
        process.exit()
      } else {
        if (args.full) {
          console.log(result)
        } else {
          console.log(result.link)
        }
      }
    }
  }
}
