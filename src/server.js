'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const yargs = require('yargs');
const search = require('./search');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const version = process.env.npm_package_version;

const server = app.listen(process.env.SUCHTUBE_SERVER_PORT || 3333, () => {
  console.log(
    `SuchTube server v${version} listening
    on port ${server.address().port}
    in ${app.settings.env} mode \n`);
});

exports = server;

app.all('/search.:format?', async (req, res) => {
  const format = req.params.format;
  let query = (format == "slack") && (req.method == 'POST')
    ? req.body.text
    : req.query.q;
  const argv = yargs.parse(query);
  query = argv._.join(" ");

  console.log(`[LOG] format ${format} => ${query}\n`);

  const video = await search(query, argv);

  let videoLink, videoTitle;

  if (video) {
    videoLink = video.link;
    videoTitle = video.title;
  } else {
    videoLink = 'Not found 乁(ツ)ㄏ';
    videoTitle = videoLink;
  }

  if (format == 'slack') {
    res.send({
      response_type: 'in_channel',
      text: videoLink
    });
  } else if (format == 'text') {
    res.send(videoLink);
  } else if (format == 'json') {
    res.send(video);
  } else if (format == 'html' || format == null) {
    let html =
      `<html><body style="background-color: #ccc; padding: 2em; font-family: arial;">
      <h1>SuchTube v${version}</h1>
      <h2>${videoTitle}</h2>`;

    if (video) {
      html +=
        `<small>${video.publishedAt} -- ${video.channelTitle}</small>
        <p>${video.description}</p>
        <p><a href="${videoLink}" target="_blank">${videoLink}</a></p>
        <iframe src="${video.linkEmbed}" width="640" height="360" frameborder="0"></iframe>`;
    }

    html += '</body></html>'

    res.send(html);
  }
});
