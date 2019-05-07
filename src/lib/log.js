import TestFairy from 'react-native-testfairy';

function logInternal(...args) {
  console.log(args);
  TestFairy.log(args);
}

module.exports = {
  trace: logInternal,
  info: logInternal,
  log: logInternal,
  warn: logInternal,
  error: logInternal,
};
