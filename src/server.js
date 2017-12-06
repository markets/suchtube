'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const yargs = require('yargs');
const search = require('./search.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 3333, () => {
  console.log(
    `SuchTube server v${process.env.npm_package_version} listening
    on port ${server.address().port}
    in ${app.settings.env} mode \n`);
});

exports = server;

app.all('/search.:format?', (req, res) => {
  const format = req.params.format;
  let query = (format == "slack") && (req.method == 'POST')
    ? req.body.text
    : req.query.q;
  const argv = yargs.parse(query);
  query = argv._.join(" ");

  console.log(`[LOG] format ${format} => ${query}\n`);

  search(query, argv)
    .catch((err) => {
      return console.log(`[ERROR] ${err}`);
    })
    .then((video) => {
      let videoLink, videoTitle;

      if (video) {
        videoLink = video.link;
        videoTitle = video.title;
      } else {
        videoLink = 'Not found 乁(ツ)ㄏ';
        videoTitle = videoLink;
      }

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
        let html =
          `<h1>SuchTube</h1>
          <h2>${videoTitle}</h2>`;

        if (!video) {
          html += `<a href="${videoLink}" target="_blank">${videoLink}</a>`;
        }

        res.send(html);
      }
    });
});
