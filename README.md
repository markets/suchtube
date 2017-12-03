# SuchTube

**WIP** :construction: :construction:

> Youtube Search as a service

SuchTube is a server and a CLI app to search videos on YouTube.

The server responds to multiple formats, even comes with Slack integration:

- `html` at `GET /search.html?q=cats`
- `json` at `GET /search.json?q=cats`
- `text` at `GET /search.text?q=cats`
- `slack` at `POST /search.slack` + Slack payload

The CLI allows you to search videos without leaving the terminal:

    > suchtube "Funny cats"
    https://www.youtube.com/watch?v=WEkSYw3o5is

Or start the server:

    > suchtube server

## Installation

**Requirements**

- Node.js
- YouTube Data API key (should be loaded in current shell as an environment variable named `YOUTUBE_DATA_API_V3`)

Via npm:

    > npm install -g suchtube
    > suchtube -h

Via GitHub:

- Clone this repo
- Run `npm install`
- Run `npm start`

## Options

- `--t=10`

Starts the video at the given time in seconds

- `--random` [not available yet]

Returns a random video taking into account the given topic

## Contributing

Any kind of idea, suggestion or bug report are really welcome! Just fork the repo, make your hack and send a pull request.

Thanks to all contributors, you rock :metal:

## Development

Start the server in development mode:

    > npm run dev

## License

Copyright (c) Marc Anguera Insa. SuchTube is released under the [MIT](LICENSE) License.
