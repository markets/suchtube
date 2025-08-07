import axios from 'axios'

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'

const youtubeAPI = async (query, options) => {
  const params = {
    q: query,
    key: process.env.SUCHTUBE_YOUTUBE_DATA_API_V3,
    maxResults: options.random ? 50 : 1,
    part: 'snippet'
  }

  if (!params.key || params.key == "") {
    console.error('Whoops! You should setup your YouTube Data API key')
  }

  const response = await axios.get(YOUTUBE_API_URL, { params })

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

// Create an API object that can be stubbed in tests
export const api = {
  youtubeAPI
}

export const search = async (query, options = {}) => {
  const videos = await api.youtubeAPI(query, options)

  if (videos.length == 0) return

  let video

  if (options.random) {
    let index = Math.floor(Math.random() * videos.length)
    video = {...videos[index]}
  } else {
    video = {...videos[0]}
  }

  if (options.time && video.kind != 'channel') {
    video.link = video.link + '&t=' + options.time

    if (video.kind == 'video') {
      video.linkEmbed = video.linkEmbed + '?start=' + options.time
    } else {
      video.linkEmbed = video.linkEmbed + '&start=' + options.time
    }
  }

  return video
}
