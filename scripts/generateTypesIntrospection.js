import fetch from 'node-fetch';
import fs from 'fs';
import { DEV_GRAPHQL_URL } from 'react-native-dotenv';

const fragmentsFile = process.argv[2];

if (!fragmentsFile) {
  console.error('Fragments output file was not provided!');

  process.exit();
}

fetch(DEV_GRAPHQL_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
})
.then(result => result.json())
.then(result => {
  const filteredData = result.data.__schema.types.filter(
    type => type.possibleTypes !== null,
  );

  result.data.__schema.types = filteredData;

  fs.writeFile(fragmentsFile, JSON.stringify(result.data), err => {
    if (err) console.error('Error writing fragmentTypes file', err);

    console.log('Fragment types successfully extracted!');
  });
});
