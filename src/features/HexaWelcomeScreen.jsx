import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {clearUser} from '../redux/slices/authSlice';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {FadeInUp} from 'react-native-reanimated';

const {height} = Dimensions.get('window');

export default function HexaWelcomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleContinue = () => {
    dispatch(clearUser());
    navigation.navigate('HexaLoginScreen');
  };

  return (
    <View style={{flex: 1}}>
      {/* Background Image */}
      <ImageBackground
        source={require('../assets/images/hexahavenimg2.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        {/* Overlay Gradient */}
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
          style={StyleSheet.absoluteFill}
        />

        {/* Continue Button */}
        <Animated.View
          entering={FadeInUp.delay(1000)}
          style={{
            position: 'absolute',
            bottom: 60,
            width: '90%',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={0.85}
            style={{
              backgroundColor: 'white',
              paddingVertical: 14,
              borderRadius: 14,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 3},
              shadowOpacity: 0.2,
              shadowRadius: 6,
            }}>
            <Text
              style={{
                color: '#2575fc',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 18,
              }}>
              Continue
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}
