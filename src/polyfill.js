import RNFetchBlob from 'react-native-fetch-blob';

const { Blob, File, FileReader, XMLHttpRequest, Fetch } = RNFetchBlob.polyfill;

const fetch = new Fetch({
  auto: true,
  binaryContentTypes : [
    'image/',
    'video/',
    'audio/',
  ],
}).build();

global.Blob = Blob;
global.File = File;
global.FileReader = FileReader;
global.XMLHttpRequest = XMLHttpRequest;
global.fetch = fetch;

export {
  Blob,
  File,
  FileReader,
  XMLHttpRequest,
  fetch,
}
