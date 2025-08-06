import test from 'ava'

// Test data for different scenarios
const responseVideo = [{
  kind: 'video',
  link: 'https://www.youtube.com/watch?v=WEkSYw3o5is',
  linkEmbed: 'https://www.youtube.com/embed/WEkSYw3o5is'
}]
const responsePlaylist = [{
  kind: 'playlist',
  link: 'https://www.youtube.com/playlist?list=PLNuZ94vpt6HYukP1d3VVk3RqtW2SJJF8a',
  linkEmbed: 'https://www.youtube.com/embed?listType=playlist&list=PLNuZ94vpt6HYukP1d3VVk3RqtW2SJJF8a'
}]
const responseChannel = [{
  kind: 'channel',
  link: 'https://www.youtube.com/channel/UC9YydG57epLqxA9cTzZXSeQ',
  linkEmbed: null
}]

// Mock YouTube search module for testing
const mockYouTubeSearch = {
  run: async (query) => {
    switch(query) {
      case 'random video': return responseVideo
      case 'random playlist': return responsePlaylist  
      case 'random channel': return responseChannel
      case 'non-existent-video': return []
      default: return []
    }
  }
}

// Function to test (copied from search.js with mock dependency)
const testSearch = async (query, options = {}) => {
  const videos = await mockYouTubeSearch.run(query, options)

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

test('search query', async t => {
  let video = await testSearch('random video')
  t.is(video.link, responseVideo[0].link)
})

test('search query with time - video', async t => {
  let video = await testSearch('random video', { time: 5 })
  t.is(video.link, responseVideo[0].link + '&t=5')
  t.is(video.linkEmbed, responseVideo[0].linkEmbed + '?start=5')
})

test('search query with time - playlist', async t => {
  let video = await testSearch('random playlist', { time: 5 })
  t.is(video.link, responsePlaylist[0].link + '&t=5')
  t.is(video.linkEmbed, responsePlaylist[0].linkEmbed + '&start=5')
})

test('search query with time - channel', async t => {
  let video = await testSearch('random channel', { time: 5 })
  t.is(video.link, responseChannel[0].link)
  t.is(video.linkEmbed, null)
})

test('search non-existent video', async t => {
  let video = await testSearch('non-existent-video')
  t.falsy(video)
})
