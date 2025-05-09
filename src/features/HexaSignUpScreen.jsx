import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Required'),
});

export default function SignUpScreen({ navigation }) {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = values => {
    dispatch(setUser({ fullName: values.fullName, email: values.email }));
    navigation.navigate('HexaDashboard');
  };

  return (
    <LinearGradient
      colors={['#1a455b', '#0f2c3f']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 justify-center p-6">
      <Formik
        initialValues={{ fullName: '', email: '', password: '' }}
        validationSchema={SignUpSchema}
        onSubmit={handleSignUp}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <Text className="text-3xl font-bold mb-8 text-center text-white">
              Sign Up
            </Text>

            {/* Full Name */}
            <View className="mb-6">
              <View className="flex-row items-center border-b border-white pb-2">
                <FontAwesomeIcon
                  icon={faUser}
                  size={20}
                  className="mr-2 text-white"
                />
                <TextInput
                  placeholder="Full Name"
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  value={values.fullName}
                  className="flex-1 text-lg text-white"
                  placeholderTextColor="#CCCCCC"
                />
              </View>
              {touched.fullName && errors.fullName && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.fullName}
                </Text>
              )}
            </View>

            {/* Email */}
            <View className="mb-6">
              <View className="flex-row items-center border-b border-white pb-2">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  size={20}
                  className="mr-2 text-white"
                />
                <TextInput
                  placeholder="Email Address"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  className="flex-1 text-lg text-white"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {touched.email && errors.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password */}
            <View className="mb-8">
              <View className="flex-row items-center border-b border-white pb-2">
                <FontAwesomeIcon
                  icon={faLock}
                  size={20}
                  className="mr-2 text-white"
                />
                <TextInput
                  placeholder="Password"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={!showPassword}
                  className="flex-1 text-lg text-white"
                  placeholderTextColor="#CCCCCC"
                />
                <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    size={18}
                    color="#ffffff"
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-white py-3 rounded-lg shadow-md">
              <Text className="text-blue-800 text-center text-lg font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>

            {/* Navigate to Login */}
            <Text className="mt-6 text-center text-white">
              Already have an account?{' '}
              <Text
                className="text-white font-semibold underline"
                onPress={() => navigation.navigate('HexaLoginScreen')}>
                Log In
              </Text>
            </Text>
          </View>
        )}
      </Formik>
    </LinearGradient>
  );
}
