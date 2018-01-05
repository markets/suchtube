# SuchTube

[![](https://img.shields.io/npm/v/suchtube.svg?style=flat-square)](https://www.npmjs.com/package/suchtube) [![](https://img.shields.io/travis/markets/suchtube.svg?style=flat-square)](https://travis-ci.org/markets/suchtube)
[![Help Contribute to Open Source](https://www.codetriage.com/markets/suchtube/badges/users.svg)](https://www.codetriage.com/markets/suchtube)

> Youtube Search as a service

SuchTube is a Server and a CLI app to search videos on YouTube.

The Server responds to multiple formats, even comes with [Slack integration](#slack-integration):

- `html` at `GET /search.html?q=cats`
- `json` at `GET /search.json?q=cats`
- `text` at `GET /search.text?q=cats`
- `slack` at `POST /search.slack` + Slack payload

The CLI allows you to search videos without leaving the terminal:

    > suchtube funny cats
    > suchtube football top goals --random --open

Or start the Server:

    > suchtube --server

You can also use the search part [as a library](#usage-as-a-library).

## Installation and usage

### Requirements

- Node.js

Currently this package officially supports (is tested against) Node v7+. If you need to manage different Node environments, a version manager (like [creationix/nvm](https://github.com/creationix/nvm) or [tj/n](https://github.com/tj/n)) is recommended.

- YouTube Data API key

Should be loaded in current shell as an environment variable named `SUCHTUBE_YOUTUBE_DATA_API_V3`.

### Install

Via npm:

    > npm install -g suchtube
    > suchtube --help

Via GitHub:

- Clone this repo and `cd` into it.
- Run `npm install`
- Run `npm start` to start the Server
- Run `bin/suchtube -h` to use the CLI

The Server listens by default on port 3333, if you want to change this, you can do it via the `SUCHTUBE_SERVER_PORT` environment variable.

## Options

Options while using the CLI are available in the following formats: `--time=10` or `--time 10`. For the Server, you should pass the options along with the query, inside the `q` paramater, ie: `?q=funny cats --time=10`.

- `--time=10`

Starts the video at the given time in seconds.

- `--random`

Returns a random video taking into account the given topic.

- `--open` (CLI only)

Opens the video in your browser.

## Usage as a library

You can use the SuchTube search as a library:

```js
const suchtube = require('suchtube')

suchtube.search('funny cats', { random: true }).then(video => {
  console.log(video.title)
  console.log(video.link)
  console.log(video.publishedAt)
})
```

## Slack integration

`/suchtube funny cats --random`

To integrate SuchTube in your Slack workspace, read the following guides: https://api.slack.com/slash-commands.

Basically, you should run the Server, make it publicly available (via URL or IP) and create a custom Slash Command pointing to your instance URL.

## Contributing

Any kind of idea, suggestion or bug report are really welcome! Just fork the repo, make your hack and send a pull request.

Thanks to all contributors, you rock :metal:

## Development

Start the server in development mode (`nodemon` + debugging):

    > npm run dev

Run tests:

    > npm test

## License

Copyright (c) Marc Anguera Insa. SuchTube is released under the [MIT](LICENSE) License.
