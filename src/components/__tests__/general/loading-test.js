/**
 * Test to check if the component renders correctly
 */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Loading from '@components/general/Loading';

test('Loading renders correctly', () => {
  const tree = renderer.create(
    <Loading />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Loading w/ text renders correctly', () => {
  const tree = renderer.create(
    <Loading text="Checking for Updates" />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
