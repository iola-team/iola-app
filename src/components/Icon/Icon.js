import createIconSet from 'react-native-vector-icons/lib/create-icon-set';

import { connectStyle } from 'theme';
import glyphMap from './glyphMap.json';

const Icon = createIconSet(glyphMap, 'iola-icons', 'iola-icons.ttf');

export default connectStyle('NativeBase.Icon', Icon);
