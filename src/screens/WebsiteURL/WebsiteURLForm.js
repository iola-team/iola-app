/* global __DEV__ */
/* global fetch */
import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Button, Form, Text, View } from 'native-base';
import * as yup from 'yup';
import { withFormik } from 'formik';

import { withStyleSheet as styleSheet } from 'theme';
import { FormTextInput } from 'components';
import { DEV_PLATFORM_URL, INTEGRATION_ADDRESS } from "react-native-dotenv";

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

  async onSubmit() {
    const { handleSubmit, onSubmit, values: { url } } = this.props;
    const platformURL = `https://${this.sanitizeURL(url)}`;
    const healthURL = `${__DEV__ ? DEV_PLATFORM_URL : platformURL}/${INTEGRATION_ADDRESS}/health`;

    if (url.length === 0) {
      handleSubmit();

      return;
    }

    try {
      const { success } = await fetch(healthURL).then((response) => response.json());

      this.setState({ isValidURL: success === 'All good in the hood' });
    } catch (error) {
      this.setState({ isValidURL: false });
    }

    if (this.state.isValidURL) onSubmit({ url: platformURL });
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
  mapPropsToValues: () => ({ url: __DEV__ ? 'DEV_PLATFORM_URL will be used' : '' }),
  handleSubmit: (values, { props }) => props.onSubmit(values),
  validationSchema,
})(WebsiteURLForm);
