'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const search = require('youtube-search');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 3333, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.all('/:format?', (req, res) => {
  var opts = {
    maxResults: 1,
    key: process.env.YOUTUBE_DATA_API_V3
  };

  console.log(req.body.text);

  search(req.body.text, opts, function(err, results) {
    if (err) return console.log(err);

    var format = req.params.format;
    var video = results[0];

    if (format == 'slack') {
      var slack_json = {
        response_type: 'in_channel',
        text: video.link
      };
      res.json(slack_json);
    } else if (format == 'text') {
      res.send(video.link);
    } else if (format == 'json') {
      res.send(video);
    } else if (format == 'html' || format == null) {
      var link = video.link;
      res.send(
        '<h1>Slucktube</h1>' +
        '<h2>' + video.title + '</h2>' +
        '<a href="' + link + '" target="_blank">' + link + '</a>'
      );
    }
  });
});
