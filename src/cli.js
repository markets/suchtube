'use strict';

exports.start = () => {
  let query = process.argv.slice(2)[0];

  if (query == 'server') {
    const spawn = require('child_process').spawn;
    const serverProcess = spawn('npm', ['start']);

    serverProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    serverProcess.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
  } else {
    const search = require('../src/search.js');

    search(query, ({ err, results }) => {
      console.log(results[0].link);
    });
  }
};
