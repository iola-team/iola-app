/* global __DEV__ */
import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Button, Form, Text, View } from 'native-base';
import * as yup from 'yup';
import { withFormik } from 'formik';

import { withStyleSheet as styleSheet } from '~theme';
import { FormTextInput } from '~components';

@styleSheet('Sparkle.WebsiteURLForm', {
  row: {
    flexDirection: 'row',
  },

  left: {
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    height: 40,
    paddingLeft: 5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: '#ECECEC',
  },

  text: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    color: '#AFB2BF',
  },

  url: {
    flex: 1,
    height: 40,
    margin: 0,
    paddingLeft: 3,
    paddingRight: 5,
    paddingVertical: 0,
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 40,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

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
    const { handleSubmit, onSubmit, values: { url } } = this.props;
    const platformURL = `https://${this.sanitizeURL(url)}`;

    if (url.length === 0) {
      handleSubmit();

      return;
    }

    if (!this.state.isValidURL) return;

    onSubmit({ url: platformURL });
  }

  render() {
    const { styleSheet: styles } = this.props;
    const { isValidURL } = this.state;

    return (
      <Form>
        <View style={styles.row}>
          <View style={styles.left}>
            <Text style={styles.text}>https://</Text>
          </View>
          <FormTextInput
            name="url"
            placeholder="Enter Website URL address"
            error={!isValidURL}
            onChangeText={::this.onChangeText}
            customStyle={styles.url}
            {...this.props}
          />
        </View>

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
