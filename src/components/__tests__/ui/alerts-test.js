/**
 * Test to check if the component renders correctly
 */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Alerts from '@ui/Alerts';

test('Alerts (empty) renders correctly', () => {
  const tree = renderer.create(
    <Alerts />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Alerts (Sucess) renders correctly', () => {
  const tree = renderer.create(
    <Alerts success="Hello Success" />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Alerts (Error) renders correctly', () => {
  const tree = renderer.create(
    <Alerts error="Error hey" />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Alerts (Status) renders correctly', () => {
  const tree = renderer.create(
    <Alerts status="Something\'s happening..." />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
