import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { withStyleSheet as styleSheet } from '~theme';
import ActionSheet from '../ActionSheet';
import TouchableOpacity from '../TouchableOpacity';
import Report from '../Report';
import Icon from '../Icon';

@styleSheet('Sparkle.ImageView', {
  meatballButton: {
    marginRight: 3,
    padding: 15,
  },

  meatballIcon: {
    fontSize: 18,
  },
})
export default class UserActions extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  actionSheet = createRef();

  renderActionSheet({ showReport }) {
    const options = [
      'Cancel',
      'Report User',
    ];

    const actions = [
      noop,
      showReport,
    ];

    return (
      <ActionSheet
        ref={this.actionSheet}
        cancelButtonIndex={0}
        options={options}
        onPress={index => actions?.[index]()}
      />
    );
  }

  showSheet = () => this.actionSheet.current.show();

  render() {
    const { userId, styleSheet: styles } = this.props;

    return (
      <>
        <TouchableOpacity onPress={this.showSheet} style={styles.meatballButton}>
          <Icon name="more" style={styles.meatballIcon} />
        </TouchableOpacity>

        <Report contentId={userId} title="Report User">
          {showReport => this.renderActionSheet({ showReport })}
        </Report>
      </>
    );
  }
}