const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'
const YOUTUBE_VIDEOS_API_URL = 'https://www.googleapis.com/youtube/v3/videos'

// Helper function to parse ISO 8601 duration (PT1M30S) to seconds
export const parseDuration = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  
  const hours = parseInt(match[1]) || 0
  const minutes = parseInt(match[2]) || 0
  const seconds = parseInt(match[3]) || 0
  
  return hours * 3600 + minutes * 60 + seconds
}

// Helper function to check if a video is a YouTube Short (≤60 seconds)
export const isYouTubeShort = (duration) => {
  return parseDuration(duration) <= 60
}

// Function to get video details including duration
const getVideoDetails = async (videoIds) => {
  if (!videoIds.length) return []
  
  const params = {
    id: videoIds.join(','),
    key: process.env.SUCHTUBE_YOUTUBE_DATA_API_V3,
    part: 'contentDetails'
  }

  const url = new URL(YOUTUBE_VIDEOS_API_URL)
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

  const response = await fetch(url)
  const data = await response.json()

  return data.items || []
}

const youtubeAPI = async (query, options) => {
  // Increase max results when filtering shorts to account for filtered items
  const baseMaxResults = options.random ? 50 : 1
  const maxResults = options.noShorts ? Math.min(baseMaxResults * 2, 50) : baseMaxResults
  
  const params = {
    q: query,
    key: process.env.SUCHTUBE_YOUTUBE_DATA_API_V3,
    maxResults: maxResults,
    part: 'snippet'
  }

  if (!params.key || params.key == "") {
    console.error('Whoops! You should setup your YouTube Data API key')
  }

  // Build URL with query parameters
  const url = new URL(YOUTUBE_API_URL)
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

  const response = await fetch(url)
  const data = await response.json()

  let items = data.items.map(item => {
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

  // Filter out YouTube Shorts if the option is enabled
  if (options.noShorts) {
    // Get video IDs for duration checking (only for videos, not channels/playlists)
    const videoIds = items.filter(item => item.kind === 'video').map(item => item.id)
    
    if (videoIds.length > 0) {
      // Get video details including duration
      const videoDetails = await getVideoDetails(videoIds)
      
      // Create a map of video ID to duration
      const durationMap = {}
      videoDetails.forEach(video => {
        durationMap[video.id] = video.contentDetails.duration
      })
      
      // Filter out shorts (videos ≤60 seconds) but keep channels and playlists
      items = items.filter(item => {
        if (item.kind !== 'video') return true // Keep channels and playlists
        const duration = durationMap[item.id]
        return duration && !isYouTubeShort(duration)
      })
    }
  }

  // Return the original requested amount if possible
  const finalMaxResults = options.random ? 50 : 1
  return items.slice(0, finalMaxResults)
}

// Create an API object that can be stubbed in tests
export const api = {
  youtubeAPI,
  getVideoDetails
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
