import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { withStyleSheet as styleSheet } from '~theme';
import ActionSheet from '../ActionSheet';
import TouchableOpacity from '../TouchableOpacity';
import Report from '../Report';
import Icon from '../Icon';

@styleSheet('iola.ImageView', {
  meatballButton: {
    marginRight: 3,
    padding: 15,
  },

  meatballIcon: {
    fontSize: 18,
  },
})
export default class PhotoActions extends Component {
  static propTypes = {
    photoId: PropTypes.string.isRequired,
  };

  actionSheet = createRef();

  renderActionSheet({ showReport }) {
    const options = [
      'Cancel',
      'Report Photo',
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
    const { photoId, styleSheet: styles } = this.props;

    return (
      <>
        <TouchableOpacity onPress={this.showSheet} style={styles.meatballButton}>
          <Icon name="more" style={styles.meatballIcon} />
        </TouchableOpacity>

        <Report contentId={photoId} title="Report Photo">
          {showReport => this.renderActionSheet({ showReport })}
        </Report>
      </>
    );
  }
}