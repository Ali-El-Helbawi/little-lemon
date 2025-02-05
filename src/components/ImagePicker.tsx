import React, {useState} from 'react';
import {View, Image, Alert, Pressable, Text, StyleSheet} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const ImagePickerExample = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response.didCancel) {
        Alert.alert('Cancelled', 'You cancelled image selection.');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (
        response.assets &&
        response.assets.length > 0 &&
        response.assets[0].uri
      ) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const removeImage = () => {
    setImageUri(null);
  };

  return (
    <View style={styles.container}>
      {/* Rounded Image */}
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{uri: imageUri}} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>No Image</Text>
        )}
      </View>

      {/* Pressable to Change Image */}
      <Pressable style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Change Image</Text>
      </Pressable>

      {/* Pressable to Remove Image */}
      <Pressable style={styles.button} onPress={removeImage}>
        <Text style={styles.buttonText}>Remove Image</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  placeholderText: {
    color: '#555',
  },
  button: {
    marginLeft: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ImagePickerExample;
