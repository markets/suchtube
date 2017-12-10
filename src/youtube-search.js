'use strict';

const axios = require('axios');
const URL = 'https://www.googleapis.com/youtube/v3/search';

exports.run = async (query, options) => {
  const params = {
    q: query,
    key: process.env.SUCHTUBE_YOUTUBE_DATA_API_V3,
    maxResults: options.random ? 20 : 1,
    part: 'snippet'
  };

  if (!params.key || params.key == "") {
    console.error('Whoops! You should setup your YouTube Data API key');
  }

  const response = await axios.get(URL, { params });

  return response.data.items.map((item) => {
    let id, link, linkEmbed;

    switch (item.id.kind) {
      case 'youtube#channel':
        id = item.id.channelId;
        link = 'https://www.youtube.com/channel/' + id;
        break;
      case 'youtube#playlist':
        id = item.id.playlistId;
        link = 'https://www.youtube.com/playlist?list=' + id;
        break
      default:
        id = item.id.videoId;
        link = 'https://www.youtube.com/watch?v=' + id;
        break;
    }

    linkEmbed = 'https://www.youtube.com/embed/' + id;

    return {
      id:           id,
      link:         link,
      linkEmbed:    linkEmbed,
      title:        item.snippet.title,
      kind:         item.id.kind,
      description:  item.snippet.description,
      thumbnail:    item.snippet.thumbnails.medium.url,
      publishedAt:  item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle
    }
  });
}
