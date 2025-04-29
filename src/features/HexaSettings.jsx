import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { toggleTheme } from '../redux/slices/profileSlice';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faUserEdit,
  faPalette,
  faInfoCircle,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

export default function HexaSettings() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isDarkMode = useSelector(state => state.profile.isDarkMode);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          dispatch(clearUser());
          navigation.navigate('HexaLoginScreen');
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900 p-5">
      <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Settings
      </Text>

      {/* Theme Toggle */}
      <View className="flex-row justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-4">
        <View className="flex-row items-center space-x-3">
          <FontAwesomeIcon icon={faPalette} size={20} color="#84c3e0" />
          <Text className="text-lg text-gray-800 dark:text-white font-medium">
            Dark Mode
          </Text>
        </View>
        <Switch value={isDarkMode} onValueChange={handleToggleTheme} />
      </View>

      {/* Edit Profile */}
      <TouchableOpacity
        className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-4"
        onPress={() => navigation.navigate('HexaEditProfile')}>
        <View className="flex-row items-center space-x-3">
          <FontAwesomeIcon icon={faUserEdit} size={20} color="#84c3e0" />
          <Text className="text-lg text-gray-800 dark:text-white font-medium">
            Edit Profile
          </Text>
        </View>
      </TouchableOpacity>

      {/* App Info */}
      <View className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-4">
        <View className="flex-row items-center space-x-3">
          <FontAwesomeIcon icon={faInfoCircle} size={20} color="#84c3e0" />
          <Text className="text-lg text-gray-800 dark:text-white font-medium">
            App Version
          </Text>
        </View>
        <Text className="text-gray-600 dark:text-gray-300">v1.0.0</Text>
      </View>

      {/* Logout */}
      <TouchableOpacity
        className="flex-row items-center justify-between bg-red-100 dark:bg-red-800 p-4 rounded-xl"
        onPress={handleLogout}>
        <View className="flex-row items-center space-x-3">
          <FontAwesomeIcon icon={faSignOutAlt} size={20} color="#f87171" />
          <Text className="text-lg text-red-600 dark:text-white font-medium">
            Logout
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
