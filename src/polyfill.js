import RNFetchBlob from 'rn-fetch-blob';

const { Blob, File, FileReader, XMLHttpRequest, Fetch } = RNFetchBlob.polyfill;

const fetch = new Fetch({
  auto: true,
  binaryContentTypes : [
    'image/',
    'video/',
    'audio/',
  ],
}).build();


/**
 * Polyfill all networking related types from `rn-fetch-blob`,
 * except `XMLHttpRequest` - it does not support streams, which are required for SSE.
 *
 * @type {Blob}
 */
global.Blob = Blob;
global.File = File;
global.FileReader = FileReader;
global.fetch = fetch;

export {
  Blob,
  File,
  FileReader,
  XMLHttpRequest,
  fetch,
}
