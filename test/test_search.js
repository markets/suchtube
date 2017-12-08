import test from 'ava';
import sinon from 'sinon';

const search = require('../src/search');
const YouTubeSearch = require('../src/youtube-search');

// Stub API calls
const response = [{ link: "https://www.youtube.com/watch?v=WEkSYw3o5is" }];
const stub = sinon.stub(YouTubeSearch, 'run')
stub.withArgs('non-existent video').returns([]);
stub.returns(response);

test('search query', async t => {
  let video = await search('funny cats');
  t.is(video.link, response[0].link);
});

test('search query with time', async t => {
  let video = await search('funny cats', { time: 5 });
  t.is(video.link, response[0].link + `&t=5`);
});

test('search non-existent video', async t => {
  let video = await search('non-existent video');
  t.falsy(video);
});
