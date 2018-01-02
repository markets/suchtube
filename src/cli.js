const opn = require('opn');
const args = require('yargs')
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
  .option('server', {
    description: 'Start SuchTube server',
    alias: 's'
  })
  .option('port', {
    description: 'Port for SuchTube server',
    number: true
  })
  .argv;

const search = require('./search');
const server = require('./server');

exports.start = async () => {
  if (args.server) {
    if (args.port) {
      process.env.SUCHTUBE_SERVER_PORT = args.port
    }
    server.start();
  } else {
    const query = args._.join();
    const video = await search(query, args);

    if (!video) {
      return console.log('Not found 乁(ツ)ㄏ');
    }

    if (args.open) {
      opn(video.link);
    } else {
      console.log(video.link);
    }
  }
};
