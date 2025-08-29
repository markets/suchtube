const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'

const youtubeAPI = async (query, options) => {
  const params = {
    q: query,
    key: process.env.SUCHTUBE_YOUTUBE_DATA_API_V3,
    maxResults: (options.all || options.random) ? 50 : 1,
    part: 'snippet'
  }

  if (!params.key || params.key == "") {
    throw new Error('Whoops! You must set your YouTube Data API key')
  }

  if (options.duration && options.duration !== 'any') {
    params.videoDuration = options.duration
    params.type = 'video'
  }

  // Build URL with query parameters
  const url = new URL(YOUTUBE_API_URL)
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

  const response = await fetch(url)
  const data = await response.json()

  return data.items.map(item => {
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

// Helper function to apply time parameter to video links
const applyTimeToVideo = (video, time) => {
  if (!time || video.kind === 'channel') {
    return video
  }

  const processedVideo = {...video}
  processedVideo.link = video.link + '&t=' + time

  if (video.kind === 'video') {
    processedVideo.linkEmbed = video.linkEmbed + '?start=' + time
  } else {
    processedVideo.linkEmbed = video.linkEmbed + '&start=' + time
  }

  return processedVideo
}

// Create an API object that can be stubbed in tests
export const api = {
  youtubeAPI
}

export const search = async (query, options = {}) => {
  const videos = await api.youtubeAPI(query, options)

  if (videos.length == 0) return

  // If --all option is used, return all videos
  if (options.all) {
    return videos.map(video => applyTimeToVideo(video, options.time))
  }

  let video

  if (options.random) {
    let index = Math.floor(Math.random() * videos.length)
    video = {...videos[index]}
  } else {
    video = {...videos[0]}
  }

  return applyTimeToVideo(video, options.time)
}
