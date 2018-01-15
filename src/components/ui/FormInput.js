import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Icon, Item, Label, Input, Text } from 'native-base';

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

  const renderError = () => (
    <View>
      <Text>{error}</Text>
      <Icon name="close-circle" />
    </View>
  );

  return (
    <View>
      {label ? <Label>{label}</Label> : null}
      <Item error={showError} regular>
        <Input {...input} {...other} />
        {showError && renderError()}
      </Item>
    </View>
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
