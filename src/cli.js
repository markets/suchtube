import open from 'open'
import { search } from './search.js'
import * as server from './server.js'
import { createQueryParser } from './query-parser.js'

const queryParser = createQueryParser()
const args = queryParser.argv

export const start = async () => {
  if (args.server) {
    if (args.port) {
      process.env.PORT = args.port
    }
    server.start()
  } else {
    const query = args._.join()
    if (!query) {
      return queryParser.showHelp()
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
