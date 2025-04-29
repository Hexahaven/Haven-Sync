import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';
import * as Components from '../imports/imports';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();

const CustomBackButton = React.memo(() => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }}
      className="py-1">
      <FontAwesomeIcon icon={faChevronLeft} size={22} color="#fff" />
    </TouchableOpacity>
  );
});

const CustomHeader = ({ title, showBackButton }) => {
  const mainToggleTimer = useSelector(state => state.switches.mainToggleTimer);

  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <StatusBar backgroundColor="#84c3e0" barStyle="light-content" />
      <LinearGradient
        colors={['#84c3e0', '#bedcea']}
        style={{ borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}
        className="h-[70px] flex-row items-start px-5 pb-10 pt-4">
        {showBackButton && <CustomBackButton />}
        <Animated.View entering={SlideInUp.delay(150)} className="flex-1">
          <Text className="text-white text-xl font-bold text-center">
            {title}
          </Text>
          {mainToggleTimer > 0 && (
            <Animated.View entering={SlideInUp.delay(150)} className="ml-2">
              <Text className="text-white text-lg font-semibold text-center">
                {formatTime(mainToggleTimer)}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </LinearGradient>
    </>
  );
};

export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          height: 70,
        },
        headerTitleAlign: 'center',
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}>
      <Stack.Screen
        name="HexaWelcomeScreen"
        component={Components.HexaWelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HexaLoginScreen"
        component={Components.HexaLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HexaSignUpScreen"
        component={Components.HexaSignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HexaDashboard"
        component={Components.HexaDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HexaDevices"
        component={Components.HexaDevices}
        options={({ route }) => ({
          header: () => (
            <CustomHeader
              title={route.params?.title || route.name}
              showBackButton={true}
            />
          ),
        })}
        initialParams={{ deviceId: null }}
      />
      <Stack.Screen
        name="HexaEditProfile"
        component={Components.HexaEditProfile}
        options={({ route }) => ({
          header: () => (
            <CustomHeader
              title={route.params?.title || route.name}
              showBackButton={true}
            />
          ),
        })}
      />
      <Stack.Screen
        name="HexaSettings"
        component={Components.HexaSettings}
        options={({ route }) => ({
          header: () => (
            <CustomHeader
              title={route.params?.title || 'Settings'}
              showBackButton={true}
            />
          ),
        })}
      />
      <Stack.Screen
        name="HexaSensorAutomation"
        component={Components.HexaSensorAutomation}
        options={{
          header: () => <CustomHeader title="Sensor Automation" showBackButton={true} />,
        }}
      />
    </Stack.Navigator>
  );
}
