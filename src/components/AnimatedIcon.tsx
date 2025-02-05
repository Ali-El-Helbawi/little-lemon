import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Animated, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
interface AnimatedIconProps {
  isCorrect: boolean;
}
const AnimatedIcon: React.FC<AnimatedIconProps> = ({isCorrect}) => {
  // const [isCorrect, setIsCorrect] = useState(true);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isCorrect]);

  return (
    <View style={{alignItems: 'center', marginTop: 0}}>
      <Animated.View style={{transform: [{scale: scaleAnim}]}}>
        <Ionicons
          name={isCorrect ? 'checkmark-circle' : 'close-circle'}
          size={30}
          color={isCorrect ? 'green' : 'red'}
        />
      </Animated.View>
    </View>
  );
};

export default AnimatedIcon;
