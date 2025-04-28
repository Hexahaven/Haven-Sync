import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useSelector } from 'react-redux';

export function GreetingSection() {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user); // fetch from Redux

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Noon';
    if (hour >= 17 && hour < 20) return 'Good Evening';
    return 'Good Night';
  };

  const handleEditProfile = () => {
    navigation.navigate('HexaEditProfile', { title: 'Edit Profile' });
  };

  return (
    <>
      {/* Header Row */}
      <View className="m-3 flex-row justify-between items-center">
        <Image
          source={require('../assets/images/hexa-haven-logo.png')}
          className="w-1/3 h-12 resize-contain"
        />
        <TouchableOpacity onPress={handleEditProfile}>
          <Image
            source={require('../assets/images/dummy-login.png')}
            className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600"
          />
        </TouchableOpacity>
      </View>

      {/* Greeting Text */}
      <View className="m-4 mt-0 mb-8">
        <Text className="text-3xl font-extrabold text-gray-800 dark:text-white font-mono">
          {getGreeting()},
        </Text>
        <Text className="text-2xl text-[#ff8625] font-semibold">
          {user?.fullName || 'Guest'}
        </Text>
      </View>
    </>
  );
}
