import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/slices/authSlice';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const dispatch = useDispatch();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    dispatch(clearUser());
    navigation.navigate('HexaLoginScreen');
  };

  return (
    <LinearGradient
      // Colors sampled from the image you uploaded (approx)
      colors={['#1a455b', '#0f2c3f']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
      {/* App Logo */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          alignItems: 'center',
          marginBottom: 40,
        }}>
        <Image
          source={require('../assets/images/hexa-haven-logo.png')}
          style={{
            width: 130,
            height: 130,
            resizeMode: 'contain',
          }}
        />
      </Animated.View>

      {/* Live Text Video Placeholder */}
      <View
        style={{
          width: width * 0.85,
          height: height * 0.35,
          backgroundColor: '#ffffff22',
          borderRadius: 16,
          marginBottom: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* Replace this view with actual <Video /> component when you get the file */}
        <Image
          source={require('../assets/images/video-placeholder.gif')} // or replace with actual video
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 16,
            resizeMode: 'cover',
          }}
        />
      </View>

      {/* Continue Button - Bottom Sticky */}
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          width: width * 0.85,
        }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContinue}
          style={{
            backgroundColor: '#ffffff',
            paddingVertical: 14,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 5,
          }}>
          <Animated.Text
            style={{
              color: '#0f2c3f',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}>
            Continue
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
