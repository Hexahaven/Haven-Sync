import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

export function GreetingSection() {
  const navigation = useNavigation();
  const profile = useSelector(state => state.profile);

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

  const handleOpenSettings = () => {
    navigation.navigate('HexaSettings', { title: 'Settings' });
  };

  return (
    <>
      <View className="m-3 flex-row justify-between items-center">
        <Image
          source={require('../assets/images/hexa-haven-logo.png')}
          className="w-1/3 h-full"
        />

        <View className="flex-row space-x-3 items-center">
          <TouchableOpacity onPress={handleOpenSettings}>
            <FontAwesomeIcon icon={faCog} size={22} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleEditProfile}>
            <Image
              source={{ uri: profile.avatar }}
              className="w-12 h-12 rounded-full border-2 border-gray-300"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="m-4 mt-0 mb-8">
        <Text className="text-3xl font-extrabold text-gray-800 font-mono">
          {getGreeting()},
        </Text>
        <Text className="text-2xl text-[#ff8625]">
          {profile.name || 'Guest'}
        </Text>
      </View>
    </>
  );
}
