import { Formik as BaseFormik } from 'formik';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

export default class Formik extends BaseFormik {
  static propTypes = {
    ...BaseFormik.propTypes,
    onSubmitError: PropTypes.func,
  };

  static defaultProps = {
    ...BaseFormik.defaultProps,
    onSubmitError: noop,
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { onSubmitError } = this.props;
    const { errors, isSubmitting } = this.state;

    if (!isSubmitting && prevState.isSubmitting && Object.keys(errors).length) {
      onSubmitError(errors);
    }

    return super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState, snapshot);
  }
}
