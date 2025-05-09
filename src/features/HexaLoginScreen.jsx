import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = values => {
    dispatch(setUser({ email: values.email }));
    navigation.navigate('HexaDashboard');
  };

  return (
    <LinearGradient
      colors={['#1a455b', '#0f2c3f']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 justify-center p-6">
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}>
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
              Log In
            </Text>

            {/* Email Field */}
            <View className="mb-6">
              <View className="flex-row items-center border-b border-white pb-2">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  size={20}
                  className="mr-4 text-white"
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

            {/* Password Field */}
            <View className="mb-8">
              <View className="flex-row items-center border-b border-white pb-2">
                <FontAwesomeIcon
                  icon={faLock}
                  size={20}
                  className="mr-4 text-white"
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

            {/* Log In Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-white py-3 rounded-lg shadow-md">
              <Text className="text-blue-800 text-center text-lg font-semibold">
                Log In
              </Text>
            </TouchableOpacity>

            {/* Navigate to Sign Up */}
            <Text className="mt-6 text-center text-white">
              Don't have an account?{' '}
              <Text
                className="text-white font-semibold underline"
                onPress={() => navigation.navigate('HexaSignUpScreen')}>
                Sign Up
              </Text>
            </Text>
          </View>
        )}
      </Formik>
    </LinearGradient>
  );
}
