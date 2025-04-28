import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/slices/authSlice';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

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

  const handleLogout = () => {
    dispatch(clearUser());
    navigation.navigate('HexaLoginScreen');
  };

  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      className="flex-1 justify-center items-center p-6">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          alignItems: 'center',
          width: width * 0.9,
        }}>
        <Image
          source={require('../assets/images/hexa-haven-logo.png')}
          style={{
            marginBottom: 30,
            width: 120,
            height: 120,
            resizeMode: 'contain',
          }}
        />
        <Text className="text-3xl font-bold mb-2 text-white text-center">
          Welcome, {user?.fullName || 'Guest'}!
        </Text>
        <Text className="text-lg text-white mb-8 text-center">
          We're glad to have you here. Start exploring and make the most out of
          our services.
        </Text>

        {/* Button with touch feedback */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleLogout}
          className="bg-white py-3 px-6 rounded-xl shadow-md w-11/12">
          <Text className="text-blue-600 text-lg font-semibold text-center">
            Continue
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}
