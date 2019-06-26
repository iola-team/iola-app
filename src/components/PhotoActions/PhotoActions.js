import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import ActionSheet from '../ActionSheet';
import TouchableOpacity from '../TouchableOpacity';
import Report from '../Report';
import Icon from '../Icon';

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
    const { photoId } = this.props;

    return (
      <>
        <TouchableOpacity onPress={this.showSheet}>
          <Icon name="emoji" />
        </TouchableOpacity>

        <Report contentId={photoId} title="Report Photo">
          {showReport => this.renderActionSheet({ showReport })}
        </Report>
      </>
    );
  }
}