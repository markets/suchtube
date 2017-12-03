'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const search = require('./search.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 3333, () => {
  console.log(
    `SuchTube server v${process.env.npm_package_version} listening
    on port ${server.address().port}
    in ${app.settings.env} mode \n`
  );
});

app.all('/search.:format?', (req, res) => {
  var format = req.params.format;
  var query = (format == "slack") && (req.method == 'POST')
    ? req.body.text
    : req.query.q;
  var timestamp = '0';
  var timeFormat = /--t=/;
  var splittedQuery = query.split(timeFormat);

  if (splittedQuery.length == 2) {
    query = splittedQuery[0];
    timestamp = splittedQuery[1].match(/\d+/);
  }

  console.log(`[LOG] format ${format} => ${query}\n`);

  search(query, ({ err, results }) => {
    if (err) return console.log(`[ERROR] YouTube API error: ${err}`);

    var video = results[0];
    var videoLink = video.link + '&t=' + timestamp;

    if (format == 'slack') {
      res.json({
        response_type: 'in_channel',
        text: videoLink
      });
    } else if (format == 'text') {
      res.send(videoLink);
    } else if (format == 'json') {
      res.send(video);
    } else if (format == 'html' || format == null) {
      res.send(
        '<h1>SuchTube</h1>' +
        '<h2>' + video.title + '</h2>' +
        '<a href="' + videoLink + '" target="_blank">' + videoLink + '</a>'
      );
    }
  });
});
