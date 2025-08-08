import test from 'ava'
import sinon from 'sinon'
import * as SearchModule from '../src/search.js'

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

// Create a stub that will be set up once
let stub

test.before(() => {
  // Stub API calls once before all tests
  stub = sinon.stub(SearchModule.api, 'youtubeAPI')
  stub.withArgs('random video', sinon.match.any).resolves(responseVideo)
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

test('search with duration option - calls youtubeAPI with videoDuration parameter', async t => {
  // Test that the duration option is passed correctly to YouTube API
  const result = await SearchModule.search('random video', { duration: 'short' })
  t.truthy(result)
  t.is(result.link, responseVideo[0].link)
  
  // Verify the youtubeAPI was called with duration option
  t.true(stub.calledWith('random video', sinon.match({ duration: 'short' })))
})

test('search with duration "any" - does not add videoDuration parameter', async t => {
  // Test that "any" duration doesn't add the parameter
  const result = await SearchModule.search('random video', { duration: 'any' })
  t.truthy(result)
  t.is(result.link, responseVideo[0].link)
  
  // Verify the youtubeAPI was called with duration option
  t.true(stub.calledWith('random video', sinon.match({ duration: 'any' })))
})
