import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'native-base';

import { withStyleSheet } from 'theme';

@withStyleSheet('Sparkle.SearchBlank', {
  root: {
    flex: 1,
  },

  sectionHeader: {
    marginLeft: 16,
    marginBottom: 10,
    marginTop: 10,
  },

  headerList: {
    paddingLeft: 16,
  },

  sectionDelim: {
    height: 1,
    marginVertical: 10,
    backgroundColor: '#EEEFF2',
  },
})
export default class SearchBlank extends PureComponent {
  static propTypes = {
    headerTitle: PropTypes.string.isRequired,
    headerList: PropTypes.element.isRequired,
    contentTitle: PropTypes.string.isRequired,
    ListComponent: PropTypes.func.isRequired,
    isEmpty: PropTypes.bool.isRequired,
  };

  render() {
    const {
      headerTitle,
      contentTitle,
      headerList,
      ListComponent,
      isEmpty,
      style,
      styleSheet: styles,
      ...props
    } = this.props;

    return (
      <ListComponent
        {...props}

        style={[styles.root, style]}
        ListEmptyComponent={null}
        ListHeaderComponent={(
          <>
            <Text style={styles.sectionHeader}>{headerTitle}</Text>
            <View style={styles.headerList}>
              {headerList}
            </View>

            {!isEmpty && (
              <>
                <View style={styles.sectionDelim} />
                <Text style={styles.sectionHeader}>{contentTitle}</Text>
              </>
            )}
          </>
        )}
      />
    );
  }
}