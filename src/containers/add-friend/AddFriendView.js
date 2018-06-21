import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import PropTypes from 'prop-types';
import { H1 } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { reduxForm, Field } from 'redux-form';

import { FormInput, Spacer, WizardPage } from '@components/ui/';

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  return errors;
};

class AddFriend extends Component {
  static componentName = 'AddFriend';

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  }

  submit = async (values) => {
    //  Before we add a friend, we need to give them an id. If we have an email,
    //  perfect. If not, their name becomes their id.
    const friend = values;
    Object.assign(friend, { id: (friend.email || friend.name) });

    //  Add the friend, and pop the view.
    const { uid } = firebase.auth().currentUser;
    await firebase.firestore()
      .collection(`users/${uid}/friends`)
      .add(friend);
    Actions.pop();
  }

  render = () => (
    <WizardPage
      nextLabel="Add"
      onNext={this.props.handleSubmit(this.submit)}
      previousLabel="Cancel"
      onPrevious={Actions.pop}
    >
      <H1>Add Friend</H1>
      <Spacer size={20} />
      <Field
        name="name"
        placeholder="Name"
        label="Name"
        component={FormInput}
        autoFocus
      />
      <Field
        name="email"
        placeholder="E-Mail"
        label="E-Mail"
        keyboardType="email-address"
        autoCapitalize="none"
        component={FormInput}
      />
    </WizardPage>
  )
}

export default reduxForm({
  form: 'addFriend',
  validate,
})(AddFriend);
