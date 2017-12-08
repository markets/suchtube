'use strict';

const YouTubeSearch = require('./youtube-search');

module.exports = async (query, options) => {
  options = options || {};
  const videos = await YouTubeSearch.run(query, options);

  if (videos.length == 0) return;

  let video;

  if (options.random) {
    let index = Math.floor((Math.random() * videos.length));
    video = Object.assign({}, videos[index]);
  } else {
    video = Object.assign({}, videos[0]);
  }

  if (options.time) {
    video.link = video.link + '&t=' + options.time;
  }

  return video;
}