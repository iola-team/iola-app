import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Text, Toast } from 'native-base';

import ListPicker from '../ListPicker';
import TouchableOpacity from '../TouchableOpacity';

@graphql(gql`
  query {
    me {
      id
    }
  }`, {
  options: {
    fetchPolicy: 'cache-first',
  },
})
@graphql(gql`
  mutation addReportMutation($input: ReportInput!) {
    addReport(input: $input)
  }
`, {
  name: 'addReport',
})
export default class Report extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    contentId: PropTypes.string.isRequired,
  };

  donePressed = false;

  onDone = ([ reason ]) => {
    const { contentId, addReport, data: { me } } = this.props;

    addReport({
      variables: {
        input: { reason, contentId, userId: me.id },
      },
    });

    this.donePressed = true;
  };

  onDismiss = () => {
    if (!this.donePressed) {
      return;
    }

    this.donePressed = false;

    /**
     * Show optimistic success message - no need to wait for the mutation completion
     */
    setTimeout(() => Toast.show({
      text: 'Your report was accepted',
      duration: 5000,
      buttonText: 'Ok',
      type: 'success',
    }), 200);
  };

  renderSendButton = ({ onPress, value }) => {
    return (
      <TouchableOpacity disabled={!value.length} onPress={onPress}>
        <Text>Send</Text>
      </TouchableOpacity>
    );
  };
  
  render() {
    const { title, ...props } = this.props;
    const options = [
      { label: 'Spam', value: 'SPAM' },
      { label: 'Offence', value: 'OFFENCE' },
      { label: 'Illegal', value: 'ILLEGAL' },
    ];

    return (
      <ListPicker
        {...props}
        label={title}
        options={options}
        onDone={this.onDone}
        onDismiss={this.onDismiss}

        renderHeaderRight={this.renderSendButton}
      />
    );
  }
}
