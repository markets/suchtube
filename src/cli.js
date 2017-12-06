'use strict';

const argv = require('yargs')
  .locale('en')
  .usage('Usage: suchtube query [options]')
  .alias('version', 'v')
  .alias('help', 'h')
  .option('server', {
    description: 'Start SuchTube server',
  })
  .option('random', {
    description: 'Search a random video'
  })
  .option('time', {
    alias: 't',
    description: 'Start the video at the given time'
  })
  .option('open', {
    alias: 'o',
    description: 'Open the video in your browser'
  })
  .argv;

exports.start = () => {
  if (argv.server) {
    require('../src/server.js');
  } else {
    const search = require('../src/search.js');
    const query = argv._.join();

    search(query, argv)
      .catch((err) => {
        console.log(err);
      })
      .then((video) => {
        if (!video) {
          return console.log('Not found 乁(ツ)ㄏ')
        }

        if (argv.open) {
          const opn = require('opn');
          opn(video.link);
        } else {
          console.log(video.link);
        }
      });
  }
};
