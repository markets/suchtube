const YouTubeSearch = require('./youtube-search')

exports.search = async (query, options = {}) => {
  const videos = await YouTubeSearch.run(query, options)

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

    if (video.kind == 'video') {
      video.linkEmbed = video.linkEmbed + '?start=' + options.time
    } else {
      video.linkEmbed = video.linkEmbed + '&start=' + options.time
    }
  }

  return video
}