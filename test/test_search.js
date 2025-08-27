import test from 'ava'
import sinon from 'sinon'
import * as SearchModule from '../src/search.js'

const responseVideo = [{
  kind: 'video',
  link: 'https://www.youtube.com/watch?v=WEkSYw3o5is',
  linkEmbed: 'https://www.youtube.com/embed/WEkSYw3o5is'
}]
const responseMultipleVideos = [
  {
    kind: 'video',
    link: 'https://www.youtube.com/watch?v=WEkSYw3o5is',
    linkEmbed: 'https://www.youtube.com/embed/WEkSYw3o5is'
  },
  {
    kind: 'video', 
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    linkEmbed: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    kind: 'video',
    link: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
    linkEmbed: 'https://www.youtube.com/embed/oHg5SJYRHA0'
  }
]
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

// Create a stub that will be set up once
let stub

test.before(() => {
  // Stub API calls once before all tests
  stub = sinon.stub(SearchModule.api, 'youtubeAPI')
  stub.withArgs('random video', sinon.match.any).resolves(responseVideo)
  stub.withArgs('multiple videos', sinon.match.any).resolves(responseMultipleVideos)
  stub.withArgs('random playlist', sinon.match.any).resolves(responsePlaylist)
  stub.withArgs('random channel', sinon.match.any).resolves(responseChannel)
  stub.withArgs('non-existent-video', sinon.match.any).resolves([])
})

test.after(() => {
  // Restore after all tests
  stub.restore()
})

test('search query', async t => {
  let video = await SearchModule.search('random video')
  t.is(video.link, responseVideo[0].link)
})

test('search query with time - video', async t => {
  let video = await SearchModule.search('random video', { time: 5 })
  t.is(video.link, responseVideo[0].link + '&t=5')
  t.is(video.linkEmbed, responseVideo[0].linkEmbed + '?start=5')
})

test('search query with time - playlist', async t => {
  let video = await SearchModule.search('random playlist', { time: 5 })
  t.is(video.link, responsePlaylist[0].link + '&t=5')
  t.is(video.linkEmbed, responsePlaylist[0].linkEmbed + '&start=5')
})

test('search query with time - channel', async t => {
  let video = await SearchModule.search('random channel', { time: 5 })
  t.is(video.link, responseChannel[0].link)
  t.is(video.linkEmbed, null)
})

test('search non-existent video', async t => {
  let video = await SearchModule.search('non-existent-video')
  t.falsy(video)
})

test('search with --all option', async t => {
  let videos = await SearchModule.search('multiple videos', { all: true })
  t.is(Array.isArray(videos), true)
  t.is(videos.length, 3)
  t.is(videos[0].link, responseMultipleVideos[0].link)
  t.is(videos[1].link, responseMultipleVideos[1].link)
  t.is(videos[2].link, responseMultipleVideos[2].link)
})

test('search with --all and time option', async t => {
  let videos = await SearchModule.search('multiple videos', { all: true, time: 10 })
  t.is(Array.isArray(videos), true)
  t.is(videos.length, 3)
  t.is(videos[0].link, responseMultipleVideos[0].link + '&t=10')
  t.is(videos[1].link, responseMultipleVideos[1].link + '&t=10')
  t.is(videos[2].link, responseMultipleVideos[2].link + '&t=10')
})
