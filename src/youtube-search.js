const axios = require('axios')
const URL = 'https://www.googleapis.com/youtube/v3/search'

exports.run = async (query, options) => {
  const params = {
    q: query,
    key: process.env.SUCHTUBE_YOUTUBE_DATA_API_V3,
    maxResults: options.random ? 20 : 1,
    part: 'snippet'
  }

  if (!params.key || params.key == "") {
    console.error('Whoops! You should setup your YouTube Data API key')
  }

  const response = await axios.get(URL, { params })

  return response.data.items.map(item => {
    let id, link, linkEmbed, kind

    switch (item.id.kind) {
      case 'youtube#channel':
        id = item.id.channelId
        kind = 'channel'
        link = `https://www.youtube.com/channel/${id}`
        linkEmbed = null
        break
      case 'youtube#playlist':
        id = item.id.playlistId
        kind = 'playlist'
        link = `https://www.youtube.com/playlist?list=${id}`
        linkEmbed = `https://www.youtube.com/embed?listType=playlist&list=${id}`
        break
      default:
        id = item.id.videoId
        kind = 'video'
        link = `https://www.youtube.com/watch?v=${id}`
        linkEmbed = `https://www.youtube.com/embed/${id}`
        break
    }

    return {
      id:           id,
      kind:         kind,
      link:         link,
      linkEmbed:    linkEmbed,
      title:        item.snippet.title,
      description:  item.snippet.description,
      thumbnail:    item.snippet.thumbnails.medium.url,
      publishedAt:  item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle
    }
  })
}
