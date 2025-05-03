import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  PermissionsAndroid,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faPlus,
  faToggleOn,
  faXmark,
  faToggleOff,
  faChevronUp,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import {
  addDevice,
  removeDevice,
  updateDevice,
  updateCardName,
} from '../redux/slices/switchSlice';
import DeviceDetectorLoader from './DeviceDetectorLoader';
import Animated, {
  FadeIn,
  SlideInRight,
  ZoomIn,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import WifiManager from 'react-native-wifi-reborn';
import { BleManager } from 'react-native-ble-plx';

const bleManager = new BleManager();

export default function SwitchSection() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const activeDevices = useSelector(state => state.switches.activeDevices);
  const cardNames = useSelector(state => state.switches.cardNames);
  const scrollViewRefs = useRef({});

  const [isRotating, setIsRotating] = useState(false);
  const [manualSwitches] = useState([
    { id: 1, type: '3-channel', switches: [false, false, false], regulators: [0] },
    { id: 2, type: '5-channel', switches: [false, false, false, false, false], regulators: [0, 0] },
  ]);

  const handleAddChannel = () => {
    requestPermissions();
    scanWiFi();
    setIsRotating(true);
  };

  const handleAddManualSwitch = switchItem => dispatch(addDevice(switchItem));
  const handleRemoveDevice = deviceId => dispatch(removeDevice(deviceId));

  const handleToggleSwitch = (deviceId, switchIndex) => {
    const updatedDevices = activeDevices.map(device =>
      device.id === deviceId
        ? {
            ...device,
            switches: device.switches.map((sw, idx) =>
              idx === switchIndex ? !sw : sw
            ),
          }
        : device
    );
    dispatch(updateDevice({
      id: deviceId,
      switches: updatedDevices.find(d => d.id === deviceId).switches,
    }));
  };

  const handleUpdateCardName = (deviceId, name) => {
    dispatch(updateCardName({ id: deviceId, name }));
  };

  const scanWiFi = async () => {
    try {
      await WifiManager.loadWifiList();
    } catch (error) {
      console.error('Wi-Fi scan error:', error);
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        const allGranted = Object.values(granted).every(result => result === PermissionsAndroid.RESULTS.GRANTED);
        if (allGranted) {
          const state = await bleManager.state();
          if (state !== 'PoweredOn') {
            Alert.alert('Bluetooth is Off', 'Please enable Bluetooth to scan for devices.', [{ text: 'OK' }]);
          }
        }
      } catch (error) {
        console.error('Permission error:', error);
      }
    }
  };

  const scrollUp = deviceId => scrollViewRefs.current[deviceId]?.scrollTo({ y: 0, animated: true });
  const scrollDown = deviceId => scrollViewRefs.current[deviceId]?.scrollToEnd({ animated: true });

  return (
    <View>
      {/* Add Channel Button */}
      <Animated.View entering={FadeIn.duration(400)}>
        <TouchableOpacity
          className="bg-[#ff8625] p-4 rounded-2xl items-center shadow-xl flex-row justify-center gap-2"
          onPress={handleAddChannel}
          activeOpacity={0.85}>
          <FontAwesomeIcon icon={faPlus} size={20} color="white" />
          <Text className="text-white font-bold text-lg">Add Channel</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Scanning Loader */}
      {isRotating && (
        <Animated.View entering={FadeIn} className="mt-8 items-center">
          <Text className="text-lg font-bold text-[#1a365d] dark:text-white mb-4">
            Scanning for Devices...
          </Text>
          <DeviceDetectorLoader />
        </Animated.View>
      )}

      {/* Active Devices Section */}
      {activeDevices.length > 0 && (
        <View className="mt-8">
          <Text className="text-2xl font-bold text-[#1a365d] dark:text-white mb-6">
            Active Devices
          </Text>

          <View className="flex flex-wrap flex-row justify-between gap-3">
            {activeDevices.map(device => {
              const cardName = cardNames.find(card => card.id === device.id)?.name;

              return (
                <TouchableOpacity
                  key={device.id}
                  onPress={() => navigation.navigate('HexaDevices', { title: cardName, deviceId: device.id })}
                  activeOpacity={0.85}
                  className="w-[48%] mb-2">
                  <Animated.View entering={SlideInRight.delay(200)} className="bg-white dark:bg-gray-900 rounded-xl shadow-xl h-56">
                    
                    {/* Remove Button */}
                    <TouchableOpacity
                      className="absolute -top-2 -right-2 p-1 bg-[#ff8625] rounded-full z-10"
                      onPress={() => handleRemoveDevice(device.id)}>
                      <FontAwesomeIcon icon={faXmark} size={15} color="#fff" />
                    </TouchableOpacity>

                    {/* Editable Name */}
                    <TextInput
                      className="font-bold text-xl text-blue-900 dark:text-white mx-3 pt-3"
                      numberOfLines={1}
                      defaultValue={cardName}
                      onChangeText={text => handleUpdateCardName(device.id, text)}
                    />

                    {/* Toggle Switches */}
                    <ScrollView
                      ref={ref => (scrollViewRefs.current[device.id] = ref)}
                      className="mt-2 px-2">
                      {device.switches.map((sw, idx) => (
                        <TouchableOpacity
                          key={`${device.id}-switch-${idx}`}
                          className="flex-row items-center mt-2 pb-2"
                          onPress={() => handleToggleSwitch(device.id, idx)}>
                          <FontAwesomeIcon
                            icon={sw ? faToggleOn : faToggleOff}
                            size={24}
                            color={sw ? '#10B981' : '#ff8625'}
                          />
                          <Text className="ml-3 text-blue-900 dark:text-white text-lg">
                            Switch {idx + 1}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    {/* Scroll Controls */}
                    <View className="flex-row justify-around mt-2 bg-[#ff8625] rounded-t-md rounded-b-xl py-2">
                      <TouchableOpacity onPress={() => scrollUp(device.id)}>
                        <FontAwesomeIcon icon={faChevronUp} size={20} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => scrollDown(device.id)}>
                        <FontAwesomeIcon icon={faChevronDown} size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Manual Setup Section */}
      <View className="my-8">
        <Text className="text-2xl font-bold text-[#1a365d] dark:text-white mb-6">
          Manual Setup
        </Text>
        {manualSwitches.map(switchItem => (
          <View key={switchItem.id} className="mb-4">
            <TouchableOpacity onPress={() => handleAddManualSwitch(switchItem)} activeOpacity={0.85}>
              <Animated.View
                className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-xl flex-row justify-between items-center"
                entering={ZoomIn.delay(100)}>
                <View>
                  <Text className="text-[#ff8625] font-bold text-lg">
                    {switchItem.type}
                  </Text>
                  <Text className="text-[#1a365d] dark:text-white mt-1">
                    {switchItem.switches.length} switches • {switchItem.regulators?.length || 0} regulators
                  </Text>
                </View>
                <FontAwesomeIcon icon={faPlus} size={20} color="#84c3e0" />
              </Animated.View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}
