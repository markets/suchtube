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
  .option('full', {
    description: 'Display full information',
    alias: 'f'
  })
  .option('server', {
    description: 'Start SuchTube server',
    alias: 's'
  })
  .option('port', {
    description: 'Port for SuchTube server',
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

    const video = await search(query, args)

    if (!video) {
      return console.log('Not found 乁(ツ)ㄏ')
    }

    if (args.open) {
      open(video.link)
      process.exit()
    } else {
      if (args.full) {
        console.log(video)
      } else {
        console.log(video.link)
      }
    }
  }
}
