import test from 'ava'
import sinon from 'sinon'
import { search } from '../src/search.js'

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

// Create a mock youtubeAPI function using sinon
let mockYouTubeAPI

test.before(() => {
  // Create a sinon stub for the youtubeAPI function
  mockYouTubeAPI = sinon.stub()
  mockYouTubeAPI.withArgs('random video', sinon.match.any).resolves(responseVideo)
  mockYouTubeAPI.withArgs('random playlist', sinon.match.any).resolves(responsePlaylist)
  mockYouTubeAPI.withArgs('random channel', sinon.match.any).resolves(responseChannel)
  mockYouTubeAPI.withArgs('non-existent-video', sinon.match.any).resolves([])
})

test.after(() => {
  // Reset the stub after all tests
  if (mockYouTubeAPI) {
    mockYouTubeAPI.reset()
  }
})

test('search query', async t => {
  let video = await search('random video', {}, mockYouTubeAPI)
  t.is(video.link, responseVideo[0].link)
})

test('search query with time - video', async t => {
  let video = await search('random video', { time: 5 }, mockYouTubeAPI)
  t.is(video.link, responseVideo[0].link + '&t=5')
  t.is(video.linkEmbed, responseVideo[0].linkEmbed + '?start=5')
})

test('search query with time - playlist', async t => {
  let video = await search('random playlist', { time: 5 }, mockYouTubeAPI)
  t.is(video.link, responsePlaylist[0].link + '&t=5')
  t.is(video.linkEmbed, responsePlaylist[0].linkEmbed + '&start=5')
})

test('search query with time - channel', async t => {
  let video = await search('random channel', { time: 5 }, mockYouTubeAPI)
  t.is(video.link, responseChannel[0].link)
  t.is(video.linkEmbed, null)
})

test('search non-existent video', async t => {
  let video = await search('non-existent-video', {}, mockYouTubeAPI)
  t.falsy(video)
})
