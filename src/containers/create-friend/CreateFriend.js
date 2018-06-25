import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Container,
  Content,
  Icon,
  Form,
  Text,
} from 'native-base';
import { reduxForm, Field } from 'redux-form';
import uuidv4 from 'uuid/v4';

import { FormInput } from '@components/ui/';

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  return errors;
};

class CreateFriend extends Component {
  static propTypes = {
    //  auto-wired by redux form...
    handleSubmit: PropTypes.func.isRequired,
    onCreateFriend: PropTypes.func.isRequired,
  }

  submit = async (values) => {
    //  Friends need a uid, even if they are not yet gameboard users.
    //  As this is a newly created friend, we'll just use a GUID. This is easy
    //  to identity in the DB and we can swap it out for a real UID if the
    //  user links this friend to a GameBoard user later.
    const friend = {
      ...values,
      uid: uuidv4(),
    };

    //  We've created the friend, fire the action.
    this.props.onCreateFriend(friend);
  }

  render = () => (
    <Container>
      <Content style={{ padding: 20 }}>
        <Text>
          Enter your friend&apos;s details below.
          You can always link them to a GameBoard user later.
        </Text>
        <Form>
          <Field
            name="name"
            label="Name"
            component={FormInput}
            autoFocus
          />
          <Field
            name="email"
            label="E-Mail"
            keyboardType="email-address"
            autoCapitalize="none"
            component={FormInput}
          />
        </Form>
        <Button onPress={this.props.handleSubmit(this.submit)} block primary>
          <Icon name="add" />
          <Text>Create</Text>
        </Button>
      </Content>
    </Container>
  )
}

export default reduxForm({
  form: 'createFriend',
  validate,
})(CreateFriend);
