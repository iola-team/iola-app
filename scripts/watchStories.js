import { join } from 'path';
import watch from 'glob-watcher';
import { exec } from 'child-process-promise';

const globs = [
  join(__dirname, '..', 'src', '**/*.(stories.js)'),
];

const options = {
  ignoreInitial: false,
  events: [ 'add', 'unlink' ],
};

if (require.main === module) {
  console.log('Start watching stories');

  watch(globs, options, async (done) => {
    console.log('Generating stories...');

    try {
      await exec(`yarn storybook:generate`);
    } catch(e) {
      console.error(e);
    }

    console.log('Storybook was generated!');

    done();
  });
}
