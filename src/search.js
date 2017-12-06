'use strict';

const YTSearch = require('youtube-search');

module.exports = (query, options) => {
  const youtubeApiOptions = {
    maxResults: options.random ? 20 : 1,
    key: process.env.YOUTUBE_DATA_API_V3
  };

  if (!youtubeApiOptions.key || youtubeApiOptions.key == "") {
    console.error('Whoops! You should setup your YouTube Data API key');
  }

  return new Promise((resolve, reject) => {
    YTSearch(query, youtubeApiOptions, (err, videos) => {
      if (err) return reject(err);

      let video = null;

      if (options.random) {
        video = videos[Math.floor((Math.random() * videos.length))];
      } else {
        video = videos[0]
      }

      if (options.time) {
        video.link = video.link + '&t=' + options.time;
      }

      resolve(video);
    })
  })
}
