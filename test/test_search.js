import test from 'ava'
import sinon from 'sinon'
import { search } from '../src/search.js'
import * as YouTubeSearch from '../src/youtube-search.js'

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

// Create stubs that will be set up once
let stub

test.before(() => {
  // Stub API calls once before all tests
  stub = sinon.stub(YouTubeSearch, 'run')
  stub.withArgs('random video').resolves(responseVideo)
  stub.withArgs('random playlist').resolves(responsePlaylist)
  stub.withArgs('random channel').resolves(responseChannel)
  stub.withArgs('non-existent-video').resolves([])
})

test.after(() => {
  // Restore after all tests
  stub.restore()
})

test('search query', async t => {
  let video = await search('random video')
  t.is(video.link, responseVideo[0].link)
})

test('search query with time - video', async t => {
  let video = await search('random video', { time: 5 })
  t.is(video.link, responseVideo[0].link + '&t=5')
  t.is(video.linkEmbed, responseVideo[0].linkEmbed + '?start=5')
})

test('search query with time - playlist', async t => {
  let video = await search('random playlist', { time: 5 })
  t.is(video.link, responsePlaylist[0].link + '&t=5')
  t.is(video.linkEmbed, responsePlaylist[0].linkEmbed + '&start=5')
})

test('search query with time - channel', async t => {
  let video = await search('random channel', { time: 5 })
  t.is(video.link, responseChannel[0].link)
  t.is(video.linkEmbed, null)
})

test('search non-existent video', async t => {
  let video = await search('non-existent-video')
  t.falsy(video)
})
