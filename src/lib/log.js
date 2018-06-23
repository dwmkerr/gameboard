import TestFairy from 'react-native-testfairy';

function logInternal(msg) {
  console.log(msg);
  TestFairy.log(msg);
}

module.exports = {
  trace: logInternal,
  info: logInternal,
  log: logInternal,
  warn: logInternal,
  error: logInternal,
};
