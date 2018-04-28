import { writeFileSync as write } from 'fs';
import { join } from 'path';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import {exec} from 'child-process-promise'

const tmpDir = join(__dirname, '..', '.tmp');
const outputFile = join(tmpDir, 'schema.graphqls');

const defaultTypeDefs = [`
  directive @client on FIELD | FIELD_DEFINITION
`];

const generate = async () => {
  const { typeDefs: clientSchemas } = require('../src/graph/resolvers').default;
  let fileSchemas = fileLoader(join(tmpDir, 'schemas'));

  if (!fileSchemas.length) {
    try {
      await exec(`npm run schema:load`);
    } catch (e) {
      console.error(e);
    }
  }

  write(outputFile, mergeTypes([
    ...fileSchemas,
    ...defaultTypeDefs,
    ...clientSchemas,
  ]));
};

export default generate;

if (require.main === module) {
  generate();
}
