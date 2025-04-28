import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faThermometerHalf, faTint } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export function WeatherSection() {
  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location for weather updates.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionGranted(true);
        getCurrentLocation();
      } else {
        setPermissionGranted(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        fetchWeatherData(latitude, longitude);
      },
      error => console.error(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const API_KEY = '60d3edac42903c48e11867d5b0e797f8';
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`,
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      requestLocationPermission();
    }, 1000);
  }, []);

  return (
    <View
      className={`flex-row items-center justify-between bg-white dark:bg-gray-900 rounded-2xl p-5 mb-8`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
      }}>
      {!permissionGranted ? (
        <Button title="Allow Permission" onPress={requestLocationPermission} />
      ) : loading ? (
        <View className="flex-1 flex-row justify-between px-2">
          <ActivityIndicator size="large" color="#84c3e0" />
          <Text className="text-gray-500 dark:text-white ml-3">
            Loading Weather...
          </Text>
        </View>
      ) : weatherData ? (
        <>
          {/* Temperature */}
          <View className="flex-row items-center space-x-3">
            <FontAwesomeIcon
              icon={faThermometerHalf}
              size={24}
              color="#ff8625"
            />
            <View>
              <Text className="text-xs text-gray-600 dark:text-gray-300">
                Temperature
              </Text>
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                {weatherData.main.temp}°C
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View className="h-12 w-[1px] bg-gray-300 dark:bg-gray-600 mx-3" />

          {/* Humidity */}
          <View className="flex-row items-center space-x-3">
            <FontAwesomeIcon icon={faTint} size={24} color="#84c3e0" />
            <View>
              <Text className="text-xs text-gray-600 dark:text-gray-300">
                Humidity
              </Text>
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                {weatherData.main.humidity}%
              </Text>
            </View>
          </View>
        </>
      ) : (
        <Text className="text-gray-800 dark:text-white text-sm">
          Unable to fetch weather data.
        </Text>
      )}
    </View>
  );
}
