import { run as defaultRun } from './youtube-search.js'

export const search = async (query, options = {}, youtubeSearchFn = defaultRun) => {
  const videos = await youtubeSearchFn(query, options)

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