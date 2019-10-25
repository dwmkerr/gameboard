import loadingMessage from './loading-message';

test('should be able to return a loading message', () => {
  const message = loadingMessage();
  expect(message).not.toEqual(null);
});
