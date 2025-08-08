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
let stub, videoDetailsStub

test.before(() => {
  // Stub API calls once before all tests
  stub = sinon.stub(SearchModule.api, 'youtubeAPI')
  videoDetailsStub = sinon.stub(SearchModule.api, 'getVideoDetails')
  
  stub.withArgs('random video', sinon.match.any).resolves(responseVideo)
  stub.withArgs('random playlist', sinon.match.any).resolves(responsePlaylist)
  stub.withArgs('random channel', sinon.match.any).resolves(responseChannel)
  stub.withArgs('non-existent-video', sinon.match.any).resolves([])
  
  // Mock video details responses
  videoDetailsStub.withArgs(['WEkSYw3o5is']).resolves([{
    id: 'WEkSYw3o5is',
    contentDetails: { duration: 'PT2M30S' } // 2 minutes 30 seconds - not a short
  }])
})

test.after(() => {
  // Restore after all tests
  stub.restore()
  videoDetailsStub.restore()
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

test('search with no-shorts option - calls youtubeAPI with correct options', async t => {
  // Test that the noShorts option is passed correctly
  const result = await SearchModule.search('random video', { noShorts: true })
  t.truthy(result)
  t.is(result.link, responseVideo[0].link)
  
  // Verify the youtubeAPI was called with noShorts option
  t.true(stub.calledWith('random video', sinon.match({ noShorts: true })))
})

test('parseDuration helper function', async t => {
  t.is(SearchModule.parseDuration('PT30S'), 30) // 30 seconds
  t.is(SearchModule.parseDuration('PT1M'), 60) // 1 minute
  t.is(SearchModule.parseDuration('PT1M30S'), 90) // 1 minute 30 seconds
  t.is(SearchModule.parseDuration('PT1H2M3S'), 3723) // 1 hour 2 minutes 3 seconds
  t.is(SearchModule.parseDuration('PT0S'), 0) // 0 seconds
  t.is(SearchModule.parseDuration(''), 0) // Invalid duration
})

test('isYouTubeShort helper function', async t => {
  t.true(SearchModule.isYouTubeShort('PT30S')) // 30 seconds - is short
  t.true(SearchModule.isYouTubeShort('PT60S')) // 60 seconds - is short (boundary)
  t.true(SearchModule.isYouTubeShort('PT1M')) // 1 minute - is short (boundary)
  t.false(SearchModule.isYouTubeShort('PT61S')) // 61 seconds - not short
  t.false(SearchModule.isYouTubeShort('PT1M1S')) // 1 minute 1 second - not short
  t.false(SearchModule.isYouTubeShort('PT2M30S')) // 2 minutes 30 seconds - not short
})
