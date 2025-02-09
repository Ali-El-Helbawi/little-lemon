import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Colors, TextStyles} from '../constants';
import {TextInput} from 'react-native-paper';
import {useUserStore} from '../../zustand/user';
const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};
const OnBoarding = props => {
  const {width, height} = useWindowDimensions();
  const [firstName, setFirstName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [valid, setValid] = React.useState(false);
  const logIn = useUserStore(state => state.logIn);

  const checkValidation = props => {
    const _firstName = props?.firstName ?? firstName;
    const _email = props?.email ?? email;
    let _valid = true;
    if (_firstName.length < 2) {
      _valid = false;
    }
    if (!validateEmail(_email)) {
      _valid = false;
    }
    setValid(_valid);
    return _valid;
  };
  const handlePress = () => {
    if (!valid) {
      return;
    }
    logIn({firstName, email});
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={Styles.container}>
      <View
        style={{
          backgroundColor: Colors.secondary3,
          paddingVertical: 30,
          flex: 0.1,
        }}>
        <Image
          source={require('../../assets/images/Logo.png')}
          style={{width: width}}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          backgroundColor: Colors.primary1,
          flex: 0.8,
          justifyContent: 'space-between',
          paddingVertical: 30,
          paddingHorizontal: 20,
        }}>
        <View>
          <Text
            style={[TextStyles.subTitle, {textAlign: 'center', marginTop: 20}]}>
            Let us get to know you
          </Text>
        </View>
        <View>
          <Text
            style={[
              TextStyles.subTitle,
              {textAlign: 'center', marginBottom: 15},
            ]}>
            First Name
          </Text>
          <TextInput
            theme={{roundness: 10}}
            keyboardType="default"
            mode="outlined"
            outlineStyle={{
              borderRadius: 10,
            }}
            value={firstName}
            onChangeText={text => {
              setFirstName(text);
              checkValidation({firstName: text});
            }}
          />
          <Text
            style={[
              TextStyles.subTitle,
              {textAlign: 'center', marginBottom: 15, marginTop: 15},
            ]}>
            Email
          </Text>
          <TextInput
            theme={{roundness: 10}}
            mode="outlined"
            outlineStyle={{
              borderRadius: 10,
            }}
            keyboardType="email-address"
            value={email}
            onChangeText={text => {
              setEmail(text);
              checkValidation({email: text});
            }}
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: Colors.secondary3,
          flex: 0.1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <Pressable
          onPress={() => {
            handlePress();
          }}
          disabled={!valid}
          style={{
            backgroundColor: valid ? Colors.primary1 : Colors.primary1,
            borderRadius: 10,
            alignSelf: 'center',
            opacity: valid ? 1 : 0.5,
          }}>
          <Text
            style={[
              TextStyles.cardTitle,
              {paddingHorizontal: 50, paddingVertical: 15, color: '#fff'},
            ]}>
            Next
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
export default OnBoarding;
