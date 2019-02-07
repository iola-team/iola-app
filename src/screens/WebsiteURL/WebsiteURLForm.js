import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Button, Form, Text } from 'native-base';
import * as yup from 'yup';
import { withFormik } from 'formik';

import { withStyleSheet as styleSheet } from 'theme';
import { TextInput } from 'components';

@styleSheet('Sparkle.WebsiteURLForm', {
  submit: {
    marginTop: 17,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
})
class WebsiteURLForm extends Component {
  static propTypes = {
    onSubmit: propTypes.func.isRequired,
  };

  render() {
    const {
      styleSheet: styles,
      handleSubmit,
    } = this.props;

    return (
      <Form>
        <TextInput
          name="url"
          placeholder="Enter Website URL"
          customStyle={{ marginBottom: 0 }}
          {...this.props}
        />

        <Button style={styles.submit} onPress={handleSubmit} block>
          <Text>Continue</Text>
        </Button>
      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  url: yup.string().required('Is required').url('Must be a valid URL address'),
});

export default withFormik({
  mapPropsToValues: () => ({ url: 'https://iola.app' }),
  handleSubmit: (values, { props }) => props.onSubmit(values),
  validationSchema,
})(WebsiteURLForm);
