import TestFairy from 'react-native-testfairy';

function trace(msg) {
  console.log(msg);
  TestFairy.log('Your log message here');
}

function info(msg) {
  console.log(msg);
  TestFairy.log('Your log message here');
}

function log(msg) {
  console.log(msg);
  TestFairy.log('Your log message here');
}

function warn(msg) {
  console.log(msg);
  TestFairy.log('Your log message here');
}

function error(msg) {
  console.log(msg);
  TestFairy.log('Your log message here');
}

module.exports = {
  trace,
  info,
  log,
  warn,
  error,
};
