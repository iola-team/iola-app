const main = {
  error: 'red',
  accent: '#5F96F2',
  background: 'white',
  text: '#5F96F2',
  link: '#BDC0CB',
  checkMark: '#BDC0CB',
};
const invert = {
  accent: 'white',
  background: '#5F96F2',
  text: 'white',
  link: '#A3C5FF',
  checkMark: '#A3C5FF'
};

export default {
  ...main,
  $main: main,
  $invert: invert,
};
