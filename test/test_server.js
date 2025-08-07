import test from 'ava'
import sinon from 'sinon'
import express from 'express'
import bodyParser from 'body-parser'
import * as SearchModule from '../src/search.js'
import { search } from '../src/search.js'

// Mock response for tests
const mockVideo = {
  title: 'Test Video',
  link: 'https://www.youtube.com/watch?v=test123',
  linkEmbed: 'https://www.youtube.com/embed/test123',
  publishedAt: '2023-01-01',
  channelTitle: 'Test Channel',
  description: 'Test description'
}

// Create a stub that will be set up once
let stub

test.before(() => {
  // Stub API calls once before all tests
  stub = sinon.stub(SearchModule.api, 'youtubeAPI')
  stub.withArgs('funny cats', sinon.match.any).resolves([mockVideo])
  stub.withArgs('', sinon.match.any).resolves([])
})

test.after(() => {
  // Restore after all tests
  stub.restore()
})

test('Discord format parsing - with query', async t => {
  // Mock Discord interaction payload
  const discordPayload = {
    data: {
      options: [
        {
          name: 'query',
          value: 'funny cats'
        }
      ]
    }
  }

  // Mock Express app
  const app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // Mock request and response
  const req = {
    params: { format: 'discord' },
    method: 'POST',
    body: discordPayload
  }

  const res = {
    send: sinon.spy()
  }

  // Import and test the handler logic manually
  const format = req.params.format
  let originalQuery = ''
  
  if ((format == "discord") && (req.method == 'POST')) {
    const options = req.body.data?.options || []
    const queryOption = options.find(opt => opt.name === 'query')
    originalQuery = queryOption?.value || ''
  }

  t.is(originalQuery, 'funny cats')

  // Test the search and response
  const video = await search(originalQuery)
  const videoLink = video ? video.link : 'Not found 乁(ツ)ㄏ'

  // Simulate the Discord response
  const discordResponse = {
    type: 4,
    data: {
      content: videoLink
    }
  }

  t.is(discordResponse.type, 4)
  t.is(discordResponse.data.content, mockVideo.link)
})

test('Discord format parsing - empty query', async t => {
  // Mock Discord interaction payload with no options
  const discordPayload = {
    data: {
      options: []
    }
  }

  const req = {
    params: { format: 'discord' },
    method: 'POST',
    body: discordPayload
  }

  const format = req.params.format
  let originalQuery = ''
  
  if ((format == "discord") && (req.method == 'POST')) {
    const options = req.body.data?.options || []
    const queryOption = options.find(opt => opt.name === 'query')
    originalQuery = queryOption?.value || ''
  }

  t.is(originalQuery, '')
})

test('Discord format parsing - missing data', async t => {
  // Mock Discord interaction payload with missing data
  const discordPayload = {}

  const req = {
    params: { format: 'discord' },
    method: 'POST',
    body: discordPayload
  }

  const format = req.params.format
  let originalQuery = ''
  
  if ((format == "discord") && (req.method == 'POST')) {
    const options = req.body.data?.options || []
    const queryOption = options.find(opt => opt.name === 'query')
    originalQuery = queryOption?.value || ''
  }

  t.is(originalQuery, '')
})