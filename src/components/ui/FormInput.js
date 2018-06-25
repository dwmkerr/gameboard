import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Item, Label, Input } from 'native-base';

const FormInput = (props) => {
  const {
    input,
    label,
    meta: {
      touched,
      error,
    },
    ...other
  } = props;
  const showError = touched && !!error;

  return (
    <Item error={showError} inlineLabel>
      <Label>{label}</Label>
      <Input {...input} {...other} />
      {showError && <Icon name="close-circle" /> }
    </Item>
  );
};

FormInput.propTypes = {
  input: PropTypes.shape({ }),
  autoFocus: PropTypes.bool,
  placeHolder: PropTypes.string,
  label: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

FormInput.defaultProps = {
  input: {},
  autoFocus: false,
  placeHolder: null,
  label: null,
  meta: {},
};

export default FormInput;
