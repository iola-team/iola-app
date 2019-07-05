import createIconSet from 'react-native-vector-icons/lib/create-icon-set';
import { pure } from 'recompose';

import { connectStyle } from '~theme';
import glyphMap from './glyphMap.json';

const Icon = createIconSet(glyphMap, 'iola', 'iola.ttf');

export default pure(connectStyle('NativeBase.Icon', Icon));
