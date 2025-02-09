import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useUserStore} from '../../zustand/user';
import PhoneInput, {
  isValidPhoneNumber,
} from 'react-native-international-phone-number';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AnimatedIcon from '../components/AnimatedIcon';
import {primary1, primary2, secondary1, TextStyles} from '../constants';

const Profile = props => {
  const {width, height} = useWindowDimensions();
  const updateUser = useUserStore(state => state.updateUser);
  const user = useUserStore(state => state.user);
  const logOut = useUserStore(state => state.logOut);
  const [isLoading, setIsLoading] = useState(true);

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [imageUri, setImageUri] = useState(user?.avatar ?? null);
  const [selectedCountry, setSelectedCountry] = useState(
    user?.selectedCountry ?? null,
  );

  const [isValidPhone, setIsValidPhone] = useState(user?.isValidPhone || false);
  function handleInputValue(phoneNumber) {
    console.log(phoneNumber);

    setPhone(phoneNumber);
    const isValid = isValidPhoneNumber(phoneNumber, selectedCountry);
    setIsValidPhone(isValid);
  }

  function handleSelectedCountry(country) {
    setSelectedCountry(country);
  }
  const [notifications, setNotifications] = useState(
    user?.notifications ?? {
      orderStatus: false,
      passwordChanges: false,
      specialOffers: false,
      newsletter: false,
    },
  );
  // Animated Success Message State
  const [showSuccess, setShowSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity: 0
  const slideAnim = useRef(new Animated.Value(-30)).current; // Start above the screen
  const discard = () => {
    if (user) {
      setFirstName(user?.firstName ?? '');
      setLastName(user?.lastName ?? '');
      setEmail(user?.email ?? '');
      setPhone(user?.phone ?? '');
      setImageUri(user?.avatar ?? null);
      setSelectedCountry(user?.selectedCountry ?? null);
      setIsValidPhone(user?.isValidPhone || false);
      setNotifications(
        user?.notifications ?? {
          orderStatus: false,
          passwordChanges: false,
          specialOffers: false,
          newsletter: false,
        },
      );
    }
  };
  useEffect(() => {
    if (user) {
      setFirstName(user?.firstName ?? '');
      setLastName(user?.lastName ?? '');
      setEmail(user?.email ?? '');
      setPhone(user?.phone ?? '');
      setImageUri(user?.avatar ?? null);
      setSelectedCountry(user?.selectedCountry ?? null);
      setIsValidPhone(user?.isValidPhone || false);
      setNotifications(
        user?.notifications ?? {
          orderStatus: false,
          passwordChanges: false,
          specialOffers: false,
          newsletter: false,
        },
      );
      setIsLoading(false); // Mark state as ready
    }
  }, [user]); // Run when `user` updates
  const saveUser = () => {
    const newUser = {
      firstName,
      lastName,
      email,
      phone: phone,
      selectedCountry,
      isValidPhone,
      avatar: imageUri,
      notifications,
    };
    console.log(newUser);

    updateUser(newUser);
    // Show success message
    setShowSuccess(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Hide after 3 seconds
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => setShowSuccess(false));
    }, 3000);
  };

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const toggleNotification = (key, isChecked) => {
    setNotifications(prev => ({...prev, [key]: isChecked}));
  };
  const DescriptionText = ({text = ''}) => {
    return <Text style={styles.descriptionText}>{text}</Text>;
  };
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 20}}>
      {/* Success Message Animation */}
      {showSuccess && (
        <Animated.View
          style={[
            styles.successMessage,
            {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
          ]}>
          <Text style={styles.successText}>
            Profile updated successfully! ✅
          </Text>
        </Animated.View>
      )}
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            props.navigation.goBack();
          }}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Image
          source={require('../../assets/images/Logo.png')}
          style={[styles.logo, {width: width / 1.8, height: 60}]}
          resizeMode="contain"
        />
        <View>
          {imageUri && <Image source={{uri: imageUri}} style={styles.avatar} />}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.profileSection}>
        <View style={styles.imageWrapper}>
          {imageUri ? (
            <Image
              source={{uri: imageUri}}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#fff'}}>{`${
              firstName.length > 0 ? firstName[0] : ''
            }${lastName.length > 0 ? lastName[0] : ''}`}</Text>
          )}
        </View>
        <Pressable style={styles.changeButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Change</Text>
        </Pressable>
        <Pressable style={styles.removeButton} onPress={removeImage}>
          <Text style={styles.buttonText}>Remove</Text>
        </Pressable>
      </View>
      <DescriptionText text="First Name" />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <DescriptionText text="Last Name" />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <DescriptionText text="Email" />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <DescriptionText text="Phone Number" />

      <View style={{height: 50, marginVertical: 10, marginBottom: 25}}>
        <PhoneInput
          placeholder="Enter Phone Number"
          value={phone}
          onChangePhoneNumber={number => {
            console.log(typeof number);

            handleInputValue(number);
          }}
          selectedCountry={selectedCountry}
          onChangeSelectedCountry={handleSelectedCountry}
          defaultCountry="LB"
          phoneInputStyles={{
            container: {height: 50},
            flagContainer: {
              borderTopLeftRadius: 7,
              borderBottomLeftRadius: 7,
              // backgroundColor: '#808080',
              justifyContent: 'center',
              //  display:'none'
            },
            flag: {display: 'none'},
          }}
          modalStyles={{
            flag: {
              color: '#FFFFFF',
              fontSize: 20,
              // display: 'none',
            },
          }}
          // customCaret={<AnimatedIcon isCorrect={isValidPhone} />}
        />
        <View style={{position: 'absolute', right: 5, top: 10}}>
          <AnimatedIcon isCorrect={isValidPhone} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Email Notifications</Text>
      {Object.keys(notifications).map(key => (
        <View key={key} style={styles.notificationRow}>
          <BouncyCheckbox
            isChecked={notifications[key]}
            size={20}
            fillColor={primary1}
            unFillColor="#FFFFFF"
            text={key.replace(/([A-Z])/g, ' $1').trim()}
            iconStyle={{
              borderWidth: 0,
              padding: 0,
              borderRadius: 0,
            }}
            innerIconStyle={{borderWidth: 1, borderRadius: 0}}
            textStyle={{
              fontFamily: 'Karla-Bold',
              textDecorationLine: !notifications[key] ? 'line-through' : 'none',
            }}
            onPress={isChecked => {
              console.log(isChecked);
              toggleNotification(key, isChecked);
            }}
          />
        </View>
      ))}

      <Pressable
        style={styles.logoutButton}
        onPress={() => {
          logOut();
        }}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>

      <View style={styles.actionButtons}>
        <Pressable style={styles.discardButton} onPress={() => discard()}>
          <Text style={styles.buttonText}>Discard changes</Text>
        </Pressable>
        <Pressable style={styles.saveButton} onPress={() => saveUser()}>
          <Text style={styles.buttonText}>Save changes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
  },
  avatar: {
    borderRadius: 50,
    height: 50,
    width: 50,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: secondary1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
  },
  changeButton: {
    backgroundColor: 'green',
    padding: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    marginLeft: 20,
  },
  removeButton: {
    backgroundColor: 'gray',
    padding: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    height: 50,
    marginBottom: 25,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  logoutButton: {
    backgroundColor: primary2,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  logoutText: {
    textAlign: 'center',
    fontFamily: 'Karla-Bold',
    fontSize: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
  },
  discardButton: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  checkboxText: {
    fontSize: 16,
  },
  backButton: {
    borderRadius: 40,
    height: 40,
    width: 40,
    backgroundColor: 'gray',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  successMessage: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    right: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    zIndex: 1,
    opacity: 0.7,
  },
  successText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Profile;
