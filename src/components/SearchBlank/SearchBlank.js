import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'native-base';

import { withStyleSheet } from '~theme';

@withStyleSheet('Sparkle.SearchBlank', {
  root: {
    flex: 1,
  },

  sectionHeader: {
    marginLeft: 16,
    marginTop: 16,
    fontWeight: '600',
  },

  headerList: {},

  sectionDelim: {
    height: 1,
    marginVertical: 10,
    backgroundColor: '#EEEFF2',
  },
})
export default class SearchBlank extends PureComponent {
  static propTypes = {
    ListComponent: PropTypes.func.isRequired,
    headerTitle: PropTypes.string,
    contentTitle: PropTypes.string,
    hasContent: PropTypes.bool,
    headerList: PropTypes.element,
  };

  static defaultProps = {
    headerTitle: null,
    contentTitle: null,
    hasContent: false,
    headerList: null,
  };

  render() {
    const {
      headerTitle,
      contentTitle,
      headerList,
      ListComponent,
      hasContent,
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
            {headerList && (
              <>
                {headerTitle && <Text style={styles.sectionHeader}>{headerTitle}</Text>}
                <View style={styles.headerList}>
                  {headerList}
                </View>
              </>
            )}

            {hasContent && (
              <>
                {headerList && <View style={styles.sectionDelim} />}
                {contentTitle && <Text style={styles.sectionHeader}>{contentTitle}</Text>}
              </>
            )}
          </>
        )}
      />
    );
  }
}