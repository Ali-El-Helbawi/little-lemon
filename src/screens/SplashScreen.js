import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, TextStyles} from '../constants';

const SplashScreen = () => {
  return (
    <View style={Styles.container}>
      <Text
        style={[
          TextStyles.subTitle,
          {textAlign: 'center', marginBottom: 15, marginTop: 15},
        ]}>
        Profile Page
      </Text>
    </View>
  );
};
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
export default SplashScreen;
