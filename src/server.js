import express from 'express'
import bodyParser from 'body-parser'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { search } from './search.js'
import pkg from '../package.json' with { type: 'json' }

const { version } = pkg

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

export const start = async () => {
  const port = process.env.PORT || 3333

  const server = app.listen(port, () => {
    console.log(
      `\nSuchTube server v${version} listening
      on port ${server.address().port}
      in ${app.settings.env} mode\n`)
  })
}

app.get('/', async (req, res) => {
  res.redirect('/search')
})

app.all('/search.:format?', async (req, res) => {
  const format = req.params.format || 'html'
  let originalQuery = ''
  
  if ((format == "slack") && (req.method == 'POST')) {
    originalQuery = req.body.text || ''
  } else if ((format == "discord") && (req.method == 'POST')) {
    // Discord sends interaction data with options array
    const options = req.body.data?.options || []
    const queryOption = options.find(opt => opt.name === 'query')
    originalQuery = queryOption?.value || ''
  } else {
    originalQuery = req.query.q || ''
  }
  
  const args = yargs(hideBin(originalQuery.split(' '))).parse(originalQuery)
  const query = args._.join(" ")

  console.log(`[LOG] format: ${format} | query: ${originalQuery}\n`)

  const video = await search(query, args)

  let videoLink, videoTitle

  if (video) {
    videoLink = video.link
    videoTitle = video.title
  } else {
    videoLink = 'Not found 乁(ツ)ㄏ'
    videoTitle = videoLink
  }

  if (format == 'slack') {
    res.send({
      response_type: 'in_channel',
      text: videoLink
    })
  } else if (format == 'discord') {
    res.send({
      type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
      data: {
        content: videoLink
      }
    })
  } else if (format == 'text') {
    res.send(videoLink)
  } else if (format == 'json') {
    res.send(video)
  } else if (format == 'html') {
    let html =
      `<html><body style="background-color: #ccc; padding: 2em; font-family: sans-serif;">
      <h1>SuchTube v${version}</h1>
      <form action="/search"><input name="q" value="${originalQuery}" style="width: 400px; height: 40px;"></form>`

    if (query != "")
      html += `<h2>${videoTitle}</h2>`

    if (video) {
      html +=
        `<small>${video.publishedAt} -- ${video.channelTitle}</small>
        <p>${video.description}</p>
        <p><a href="${videoLink}" target="_blank">${videoLink}</a></p>`

      if (video.linkEmbed){
        html += `<iframe src="${video.linkEmbed}" width="640" height="360" frameborder="0"></iframe>`
      }
    }

    html += '</body></html>'

    res.send(html)
  }
})
