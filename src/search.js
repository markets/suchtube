'use strict';

const YTSearch = require('youtube-search');

module.exports = (query, callback) => {
  const youtubeApiOptions = {
    maxResults: 10,
    key: process.env.YOUTUBE_DATA_API_V3
  };

  YTSearch(query, youtubeApiOptions, (err, results) => {
    callback({ err, results });
  });
}
