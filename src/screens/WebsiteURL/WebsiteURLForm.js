/* global __DEV__ */
/* global fetch */
import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Button, Form, Text, View } from 'native-base';
import * as yup from 'yup';
import { withFormik } from 'formik';

import { withStyleSheet as styleSheet } from '~theme';
import { FormTextInput, Spinner } from '~components';
import { DEV_PLATFORM_URL, INTEGRATION_PATH } from 'react-native-dotenv';

/**
 * TODO: Remove after `Beta 1`
 */
const lockedUrl = 'demo.iola.app/oxwall';

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
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#ECECEC',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: '#ECECEC',
  },

  text: {
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

  error: {
    marginTop: 20,
    fontSize: 14,
    lineHeight: 17,
    color: '#FFFFFF',
    textAlign: 'center',
  },
})
class WebsiteURLForm extends Component {
  static propTypes = {
    onSubmit: propTypes.func.isRequired,
  };

  state = {
    isValidURL: true,
  };

  onChangeText = () => {
    this.setState({ isValidURL: true });
  };

  sanitizeURL = url => url.replace(/\/$/, '').replace(/(https?):\/\//, '');

  onSubmit = async () => {
    const { handleSubmit, onSubmit, setSubmitting, values: { url } } = this.props;
    const platformURL = `https://${this.sanitizeURL(url)}`;
    const healthURL = `${__DEV__ ? DEV_PLATFORM_URL : platformURL}/${INTEGRATION_PATH}/health`;

    if (url.length === 0) {
      handleSubmit();

      return;
    }

    setSubmitting(true);

    try {
      const { success } = await fetch(healthURL).then((response) => response.json());

      this.setState({ isValidURL: success === 'All good in the hood' });
    } catch (error) {
      this.setState({ isValidURL: false });
    }

    if (this.state.isValidURL) {
      await onSubmit({ url: platformURL });
    }

    setSubmitting(false);
  }

  render() {
    const { styleSheet: styles, isSubmitting } = this.props;
    const { isValidURL } = this.state;

    return (
      <Form>
        <View style={styles.row}>
          <View style={[styles.left, !isValidURL && { borderColor: '#FF8787' }]}>
            <Text style={styles.text}>
              https://
            </Text>
          </View>
          <FormTextInput
            disabled={!!lockedUrl}
            name="url"
            placeholder="Enter website URL address"
            textContentType="URL"
            autoCapitalize="none"
            keyboardType="url"
            autoCorrect={false}
            error={!isValidURL}
            onChangeText={this.onChangeText}
            customStyle={styles.url}
            {...this.props}

            enablesReturnKeyAutomatically
            returnKeyType="go"
            onSubmitEditing={this.onSubmit}
          />
        </View>

        <Button style={styles.submit} onPress={this.onSubmit} block bordered light>
          <Text>Continue</Text>
          {isSubmitting && <Spinner />}
        </Button>

        {lockedUrl && (
          <Text style={[styles.error, { marginHorizontal: 10 }]}>
            Changing website URL is disabled for
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' }}> Beta 1 </Text>
            testing period.
          </Text>
        )}

        {!isValidURL && (
          <Text style={styles.error}>
            Please make sure the website URL address you have entered supports iola.
            {'\n\n'}
            Please contact the website administrator.
          </Text>
        )}
      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  url: yup.string().required(' '), // ' ' - don't remove (without space .required will disable)
});

export default withFormik({
  mapPropsToValues: () => ({ url: __DEV__ ? 'DEV_PLATFORM_URL' : lockedUrl }),
  handleSubmit: (values, { props }) => props.onSubmit(values),
  validationSchema,
})(WebsiteURLForm);
