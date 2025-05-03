import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMicrophone, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

export default function HexaVoiceAssist() {
  const navigation = useNavigation();
  const [alexaLinked, setAlexaLinked] = useState(false);
  const [googleLinked, setGoogleLinked] = useState(false);

  const handleLink = (type) => {
    Alert.alert(`${type} Linking`, `${type} linking simulated (OAuth flow not implemented).`);
  };

  return (
    <ScrollView className="flex-1 p-6 bg-white dark:bg-gray-900">
      <View className="items-center mb-6">
        <FontAwesomeIcon icon={faMicrophone} size={40} color="#84c3e0" />
        <Text className="text-2xl font-bold mt-3 text-gray-800 dark:text-white">
          Voice Assistant Linking
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-300 mt-2 text-center">
          Link your smart home to Alexa or Google Assistant and control your devices hands-free!
        </Text>
      </View>

      {/* Alexa Row */}
      <View className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-5 flex-row justify-between items-center">
        <View className="flex-row items-center space-x-3">
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Amazon_Alexa_logo.svg/512px-Amazon_Alexa_logo.svg.png',
            }}
            style={{ width: 30, height: 30 }}
          />
          <Text className="text-lg font-semibold text-gray-800 dark:text-white">
            Alexa
          </Text>
        </View>
        <Switch
          value={alexaLinked}
          onValueChange={(val) => {
            setAlexaLinked(val);
            if (val) handleLink('Alexa');
          }}
        />
      </View>

      {/* Google Row */}
      <View className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-5 flex-row justify-between items-center">
        <View className="flex-row items-center space-x-3">
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Assistant_logo.png',
            }}
            style={{ width: 30, height: 30 }}
          />
          <Text className="text-lg font-semibold text-gray-800 dark:text-white">
            Google Assistant
          </Text>
        </View>
        <Switch
          value={googleLinked}
          onValueChange={(val) => {
            setGoogleLinked(val);
            if (val) handleLink('Google Assistant');
          }}
        />
      </View>

      {/* Sync Button */}
      <TouchableOpacity
        onPress={() => Alert.alert('Device Sync', 'Device list will sync when linked.')}
        className="flex-row items-center justify-center mt-6 bg-[#ff8625] p-4 rounded-xl">
        <FontAwesomeIcon icon={faSyncAlt} color="#fff" size={18} />
        <Text className="text-white font-semibold ml-2">Sync Devices</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
