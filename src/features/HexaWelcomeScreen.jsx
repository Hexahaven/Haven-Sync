import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video';
import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

export default function HexaWelcomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showButton, setShowButton] = useState(false);
  const timeoutRef = useRef(null);

  const handleContinue = () => {
    dispatch(clearUser());
    navigation.navigate('HexaLoginScreen');
  };

  const handleVideoProgress = ({ currentTime }) => {
    if (currentTime >= 5 && !showButton) {
      setShowButton(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Background Video */}
      <Video
        source={require('../assets/videos/hexa-final-welcome.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        muted={false}
        repeat={false}
        controls={false}
        onProgress={handleVideoProgress}
      />

      {/* Overlay Gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
        style={StyleSheet.absoluteFill}
      />

      {/* Logo */}
      <View
        style={{
          position: 'absolute',
          top: height * 0.12,
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Animated.Image
          source={require('../assets/images/hexa-haven-logo.png')}
          style={{ width: 120, height: 120 }}
          entering={FadeInUp.delay(500)}
        />
      </View>

      {/* Continue Button (after 5s) */}
      {showButton && (
        <Animated.View
          entering={FadeInUp}
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
              shadowOffset: { width: 0, height: 3 },
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
      )}
    </View>
  );
}
