import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'native-base';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  top: {
    flex: 1,
  },

  bottom: {
    flex: 0,
    flexDirection: 'row',
  },

  buttonContainer: {
    flex: 1,
    padding: 8,
  },
});

const WizardPage = (props) => {
  const {
    children,
    nextLabel,
    previousLabel,
    onNext,
    onPrevious,
  } = props;
  return (
    <View style={styles.container}>
      <ScrollView style={styles.top}>
        {children}
      </ScrollView>
      <View style={styles.bottom}>
        { onPrevious &&
          <View style={styles.buttonContainer}>
            <Button block light onPress={onPrevious}>
              <Text style={{ color: 'black' }}>{previousLabel}</Text>
            </Button>
          </View>
        }
        { onNext &&
          <View style={styles.buttonContainer}>
            <Button block primary onPress={onNext}>
              <Text>{nextLabel}</Text>
            </Button>
          </View>
        }
      </View>
    </View>
  );
};

WizardPage.propTypes = {
  children: PropTypes.node,
  nextLabel: PropTypes.string,
  previousLabel: PropTypes.string,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
};

WizardPage.defaultProps = {
  children: null,
  nextLabel: 'Next',
  previousLabel: 'Back',
  onNext: null,
  onPrevious: null,
};

export default WizardPage;
