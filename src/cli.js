'use strict';

const argv = require('yargs')
  .locale('en')
  .usage('Usage: suchtube query [options]')
  .alias('version', 'v')
  .alias('help', 'h')
  .option('server', {
    description: 'Start SuchTube server',
    alias: 's'
  })
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
  .argv;

exports.start = () => {
  if (argv.server) {
    require('./server.js');
  } else {
    const search = require('./search.js');
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
