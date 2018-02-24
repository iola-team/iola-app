import { join } from 'path'
import watch from 'glob-watcher';
import { exec } from 'child-process-promise';

const schemasGlob = join(__dirname, '..', '.tmp', 'schemas', '*.(graphqls|graphql)');
const resolversGlob = join(__dirname, '..', 'src', 'graph', 'resolvers', '*.js');

const options = {
  ignoreInitial: false,
};

if (require.main === module) {
  console.log('Start watching schemas');

  watch([schemasGlob, resolversGlob], options, async (done) => {
    console.log('Generating schemas...');

    try {
      await exec(`npm run schema:generate`);
    } catch(e) {
      console.error(e);
    }

    console.log('Result schema was generated!');

    done();
  });
}
