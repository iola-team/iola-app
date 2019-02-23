/* global __DEV__ */
import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Button, Form, Text } from 'native-base';
import * as yup from 'yup';
import { withFormik } from 'formik';
import { DEV_URL_PROTOCOL } from 'react-native-dotenv';

import { withStyleSheet as styleSheet } from 'theme';
import { TextInput } from 'components';

@styleSheet('Sparkle.WebsiteURLForm', {
  submit: {
    marginTop: 17,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
})
class WebsiteURLForm extends Component {
  static propTypes = {
    onSubmit: propTypes.func.isRequired,
  };

  state = {
    isValidURL: true,
  };

  sanitizeURL = url => url.replace(/\/$/, '').replace(/(https?):\/\//, '');

  onChangeText() {
    if (__DEV__) {
      this.setState({ isValidURL: true });

      return;
    }

    const { values: { url } } = this.props;
    const domainRegexp = (
      new RegExp(/^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$/i)
    );
    const platformURL = this.sanitizeURL(url);

    this.setState({ isValidURL: domainRegexp.test(platformURL) });
  }

  onSubmit() {
    const { setFieldValue, handleSubmit, onSubmit, values: { url } } = this.props;

    if (url.length === 0) {
      handleSubmit();

      return;
    }

    if (!this.state.isValidURL) return;

    const platformURL = (__DEV__) ? DEV_URL_PROTOCOL : `https://${this.sanitizeURL(url)}`;

    setFieldValue('url', platformURL);
    onSubmit({ url: platformURL });
  }

  render() {
    const { styleSheet: styles } = this.props;
    const { isValidURL } = this.state;

    return (
      <Form>
        <TextInput
          name="url"
          placeholder="Enter Website URL address"
          customStyle={{ marginBottom: 0 }}
          error={!isValidURL}
          onChangeText={::this.onChangeText}
          {...this.props}
        />

        {!isValidURL && <Text>Please enter a valid URL address</Text>}

        <Button style={styles.submit} onPress={::this.onSubmit} block bordered light>
          <Text uppercase={false}>Continue</Text>
        </Button>
      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  url: yup.string().required('Is required'),
});

export default withFormik({
  mapPropsToValues: () => ({ url: __DEV__ ? 'DEV_GRAPHQL_URL will be used' : '' }),
  handleSubmit: (values, { props }) => props.onSubmit(values),
  validationSchema,
})(WebsiteURLForm);
