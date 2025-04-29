import React from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../redux/slices/profileSlice';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faMoon,
  faSun,
  faUserEdit,
  faSignOutAlt,
  faCogs,
} from '@fortawesome/free-solid-svg-icons';
import { clearUser } from '../redux/slices/authSlice';
import { useNavigation } from '@react-navigation/native';

export default function HexaSettings() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const darkMode = useSelector(state => state.profile.darkMode);

  const handleThemeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleLogout = () => {
    dispatch(clearUser());
    navigation.replace('HexaLoginScreen');
  };

  return (
    <ScrollView className="flex-1 p-6 bg-white dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Settings
      </Text>

      {/* Theme toggle */}
      <View className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-5">
        <Text className="text-lg font-semibold text-gray-700 dark:text-white">
          Dark Mode
        </Text>
        <View className="flex-row items-center space-x-2">
          <FontAwesomeIcon icon={darkMode ? faMoon : faSun} size={18} color="#84c3e0" />
          <Switch value={darkMode} onValueChange={handleThemeToggle} />
        </View>
      </View>

      {/* Edit profile */}
      <TouchableOpacity
        onPress={() => navigation.navigate('HexaEditProfile', { title: 'Edit Profile' })}
        className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-5">
        <Text className="text-lg font-semibold text-gray-700 dark:text-white">
          Edit Profile
        </Text>
        <FontAwesomeIcon icon={faUserEdit} size={18} color="#84c3e0" />
      </TouchableOpacity>

      {/* NEW: Sensor Automation Navigation */}
      <TouchableOpacity
        onPress={() => navigation.navigate('HexaSensorAutomation', { title: 'Sensor Automation' })}
        className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-5">
        <Text className="text-lg font-semibold text-gray-700 dark:text-white">
          PIR Sensor Automation
        </Text>
        <FontAwesomeIcon icon={faCogs} size={18} color="#84c3e0" />
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        className="flex-row items-center justify-between bg-red-100 p-4 rounded-xl mt-10">
        <Text className="text-lg font-semibold text-red-700">Logout</Text>
        <FontAwesomeIcon icon={faSignOutAlt} size={18} color="#dc2626" />
      </TouchableOpacity>
    </ScrollView>
  );
}
