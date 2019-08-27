import PropTypes from 'prop-types';

import { connectStyle } from '~theme';
import Image from '../Image';

const Thumbnail = connectStyle('iola.Thumbnail', Image);

Thumbnail.propTypes = {
  small: PropTypes.bool,
  large: PropTypes.bool,
};

Thumbnail.defaultProps = {
  small: false,
  large: false,
};

export default Thumbnail;