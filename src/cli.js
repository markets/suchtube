'use strict';

const argv = require('yargs')
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

exports.start = async () => {
  if (argv.server) {
    if (argv.port) {
      process.env.SUCHTUBE_SERVER_PORT = argv.port
    }
    require('./server');
  } else {
    const search = require('./search');
    const query = argv._.join();

    const video = await search(query, argv);

    if (!video) {
      return console.log('Not found 乁(ツ)ㄏ');
    }

    if (argv.open) {
      const opn = require('opn');
      opn(video.link);
    } else {
      console.log(video.link);
    }
  }
};
