/**
 * Test to check if the component renders correctly
 */
import { Alert } from 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import { Text } from '@ui';

test('Text renders correctly', () => {
  const tree = renderer.create(
    <Text>Hey Now...</Text>,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Text P renders correctly', () => {
  const tree = renderer.create(
    <Text p>Hey Now...</Text>,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Text H1 renders correctly', () => {
  const tree = renderer.create(
    <Text h1>Hey Now...</Text>,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Text H2 renders correctly', () => {
  const tree = renderer.create(
    <Text h2>Hey Now...</Text>,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Text H3 renders correctly', () => {
  const tree = renderer.create(
    <Text h3>Hey Now...</Text>,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Text H4 renders correctly', () => {
  const tree = renderer.create(
    <Text h4>Hey Now...</Text>,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Text H5 renders correctly', () => {
  const tree = renderer.create(
    <Text h5>Hey Now...</Text>,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Text H1 with Link renders correctly', () => {
  const tree = renderer.create(
    <Text h1 onPress={() => Alert.alert('Testing')}>Hey Now...</Text>,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
