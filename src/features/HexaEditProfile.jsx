import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/slices/profileSlice';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faEdit,
  faSave,
  faCamera,
  faUser,
  faEnvelope,
  faPhone,
  faCalendar,
  faLock,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import DatePicker from 'react-native-date-picker';

export default function HexaEditProfile() {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const fadeInStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const handleChange = (field, value) => {
    if (field === 'phone') {
      if (!value.startsWith('+91')) {
        value = `+91${value.replace(/^\+91/, '')}`;
      }
    }
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  const handlePress = () => {
    scale.value = withSpring(0.9, { damping: 5, stiffness: 150 }, () => {
      scale.value = withSpring(1);
    });
    setIsEditing(prev => !prev);
  };

  const handleImageUpload = () => {
    if (!isEditing) return;

    Alert.alert('Upload Image', 'Choose an option', [
      {
        text: 'Camera',
        onPress: () =>
          launchCamera({}, response => {
            if (!response.didCancel && !response.error) {
              setFormData({ ...formData, avatar: response.assets[0].uri });
            }
          }),
      },
      {
        text: 'Gallery',
        onPress: () =>
          launchImageLibrary({}, response => {
            if (!response.didCancel && !response.error) {
              setFormData({ ...formData, avatar: response.assets[0].uri });
            }
          }),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <Animated.View className="p-4" style={fadeInStyle}>
      {/* Avatar */}
      <View className="items-center mb-6 relative">
        <TouchableOpacity onPress={handleImageUpload} disabled={!isEditing}>
          <Animated.Image
            source={{ uri: formData.avatar }}
            className="w-28 h-28 rounded-full border-4 border-blue-400 shadow-lg"
            style={animatedStyle}
            onLoad={() => {
              opacity.value = withTiming(1, { duration: 500 });
            }}
          />
          {isEditing && (
            <View className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
              <FontAwesomeIcon icon={faCamera} size={16} color="#4A90E2" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Editable Fields */}
      <View className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        {[
          { label: 'Name', key: 'name', icon: faUser },
          { label: 'Email', key: 'email', icon: faEnvelope },
          { label: 'Phone', key: 'phone', icon: faPhone },
        ].map(({ label, key, icon }) => (
          <View
            key={key}
            className="flex-row items-center gap-x-4 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
            <FontAwesomeIcon icon={icon} size={18} color="#4A90E2" />
            <View className="flex-1">
              <Text className="text-gray-500 dark:text-gray-300 font-semibold">{label}</Text>
              {isEditing ? (
                <TextInput
                  className="border border-gray-300 dark:border-gray-600 p-3 rounded-md mt-1 text-lg text-black dark:text-white bg-white dark:bg-gray-800"
                  value={formData[key]}
                  onChangeText={text => handleChange(key, text)}
                />
              ) : (
                <Text className="text-lg text-gray-900 dark:text-white font-medium">
                  {formData[key] || 'N/A'}
                </Text>
              )}
            </View>
          </View>
        ))}

        {/* DOB Picker */}
        <View className="flex-row items-center gap-x-4 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
          <FontAwesomeIcon icon={faCalendar} size={18} color="#4A90E2" />
          <View className="flex-1">
            <Text className="text-gray-500 dark:text-gray-300 font-semibold">Date of Birth</Text>
            {isEditing ? (
              <TouchableOpacity
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-md mt-1 text-lg bg-white dark:bg-gray-800"
                onPress={() => setDobPickerVisible(true)}>
                <Text className="text-lg text-black dark:text-white">
                  {formData.dob ? formData.dob : 'Select Date'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-lg text-gray-900 dark:text-white font-medium">
                {formData.dob || 'N/A'}
              </Text>
            )}
          </View>
        </View>

        {/* Password Fields */}
        {isEditing && (
          <>
            {/* New Password */}
            <View className="flex-row items-center gap-x-4 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
              <FontAwesomeIcon icon={faLock} size={18} color="#4A90E2" />
              <View className="flex-1">
                <Text className="text-gray-500 dark:text-gray-300 font-semibold">New Password</Text>
                <View className="relative mt-1">
                  <TextInput
                    className="border border-gray-300 dark:border-gray-600 p-3 pr-10 rounded-md text-lg text-black dark:text-white bg-white dark:bg-gray-800"
                    secureTextEntry={!showPassword}
                    value={formData.newPassword}
                    onChangeText={text => handleChange('newPassword', text)}
                  />
                  <TouchableOpacity
                    className="absolute right-3 top-3"
                    onPress={() => setShowPassword(!showPassword)}>
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      size={18}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Confirm Password */}
            <View className="flex-row items-center gap-x-4 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
              <FontAwesomeIcon icon={faLock} size={18} color="#4A90E2" />
              <View className="flex-1">
                <Text className="text-gray-500 dark:text-gray-300 font-semibold">Confirm Password</Text>
                <View className="relative mt-1">
                  <TextInput
                    className="border border-gray-300 dark:border-gray-600 p-3 pr-10 rounded-md text-lg text-black dark:text-white bg-white dark:bg-gray-800"
                    secureTextEntry={!showConfirmPassword}
                    value={formData.confirmPassword}
                    onChangeText={text => handleChange('confirmPassword', text)}
                  />
                  <TouchableOpacity
                    className="absolute right-3 top-3"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                      size={18}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}
      </View>

      {/* DOB Picker Modal */}
      <DatePicker
        modal
        open={dobPickerVisible}
        date={formData.dob ? new Date(formData.dob) : new Date()}
        mode="date"
        onConfirm={date => {
          setDobPickerVisible(false);
          handleChange('dob', date.toISOString().split('T')[0]);
        }}
        onCancel={() => setDobPickerVisible(false)}
      />

      {/* Edit/Save Button */}
      <TouchableOpacity
        className="mt-6 bg-blue-500 py-3 rounded-lg flex-row items-center justify-center shadow-md"
        onPress={isEditing ? handleSave : handlePress}>
        <Animated.View style={animatedStyle}>
          <FontAwesomeIcon
            icon={isEditing ? faSave : faEdit}
            size={20}
            color="white"
          />
        </Animated.View>
        <Text className="text-white font-bold text-lg ml-2">
          {isEditing ? 'Save' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
