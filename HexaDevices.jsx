import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Appearance,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faFan,
  faCheckSquare,
  faSquare,
  faToggleOn,
  faToggleOff,
  faClock,
  faLightbulb,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import TimePickerModal from '../components/TimePickerModal';
import DelayTimerModal from '../components/DelayTimerModal';
import {
  updateDevice,
  setTimer,
  decrementTimer,
  resetTimer,
  setMainToggleTimer,
  decrementMainToggleTimer,
  resetMainToggleTimer,
} from '../redux/slices/switchSlice';

export default function HexaDevices() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const colorScheme = Appearance.getColorScheme(); // dark or light

  const selectedDevice = useSelector(state =>
    state.switches.activeDevices.find(
      device => device.id === Number(route.params.deviceId),
    ),
  );

  const timers = useSelector(
    state => state.switches.timers[selectedDevice?.id] || {},
  );

  const mainToggleTimer = useSelector(state => state.switches.mainToggleTimer);

  const [mainToggle, setMainToggle] = useState(false);
  const [deviceName, setDeviceName] = useState(selectedDevice?.name || '');
  const [editingName, setEditingName] = useState(false);

  const [switchStates, setSwitchStates] = useState(selectedDevice?.switches || []);
  const [checkedStates, setCheckedStates] = useState(
    selectedDevice?.switches.map(() => false) || [],
  );
  const [fanSpeeds, setFanSpeeds] = useState(selectedDevice?.regulators.map(() => 0) || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSwitchIndex, setSelectedSwitchIndex] = useState(null);
  const [delayModalVisible, setDelayModalVisible] = useState(false);

  const fanRotations = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  const animatedFanStyles = fanRotations.map(rotation =>
    useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation.value}deg` }],
    })),
  );

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ---- UI Start Here ---- //
  return (
    <ScrollView className={`flex-1 px-4 py-2 ${colorScheme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
      {/* Device Header */}
      <View className="flex-row justify-between items-center mb-4">
        {editingName ? (
          <TextInput
            value={deviceName}
            onChangeText={setDeviceName}
            onBlur={() => setEditingName(false)}
            className="text-2xl font-bold text-gray-800 dark:text-white border-b border-gray-300 w-4/5"
          />
        ) : (
          <Text className="text-2xl font-bold text-gray-800 dark:text-white">
            {deviceName}
          </Text>
        )}
        <TouchableOpacity onPress={() => setEditingName(!editingName)}>
          <FontAwesomeIcon icon={faPen} size={18} color="#777" />
        </TouchableOpacity>
      </View>

      {/* Main Control Section */}
      <View className="flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-4">
        <Text className="text-lg font-semibold text-gray-800 dark:text-white">
          Main Control
        </Text>
        <TouchableOpacity
          onPress={() => setDelayModalVisible(true)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
          <FontAwesomeIcon
            icon={mainToggle ? faToggleOn : faToggleOff}
            size={30}
            color={mainToggle ? '#4CAF50' : '#FF7043'}
          />
        </TouchableOpacity>
      </View>

      <DelayTimerModal
        visible={delayModalVisible}
        onClose={() => setDelayModalVisible(false)}
        onSelectDelay={(delay) => {
          if (delay) {
            dispatch(setMainToggleTimer(delay));
            setMainToggle(true);
          }
        }}
      />
      {/* Device Switches Grid */}
      <View className="flex-row flex-wrap justify-between">
        {selectedDevice?.switches.map((sw, idx) => (
          <View
            key={idx}
            className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md mb-4">
            
            {/* Header + Inline Name */}
            <View className="flex-row justify-between items-center mb-2">
              <TextInput
                value={
                  selectedDevice?.regulators.length > idx
                    ? `Fan ${idx + 1}`
                    : `Switch ${idx + 1}`
                }
                editable={true}
                className="text-lg font-semibold text-gray-800 dark:text-white w-3/4"
              />
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => handleOpenModal(idx)}
                  disabled={!switchStates[idx]}
                  className="mr-3">
                  <FontAwesomeIcon
                    icon={faClock}
                    size={20}
                    color={switchStates[idx] ? '#4A5568' : '#ccc'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleToggleCheckbox(idx)}
                  disabled={!mainToggle}>
                  <FontAwesomeIcon
                    icon={checkedStates[idx] ? faCheckSquare : faSquare}
                    size={20}
                    color={checkedStates[idx] ? '#84c3e0' : '#ccc'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Toggle */}
            <TouchableOpacity
              onPress={() => handleToggleSwitch(idx)}
              className="mb-4">
              <FontAwesomeIcon
                icon={switchStates[idx] ? faToggleOn : faToggleOff}
                size={34}
                color={switchStates[idx] ? '#4CAF50' : '#FF7043'}
              />
            </TouchableOpacity>

            {/* Fan or Light Control */}
            {selectedDevice?.regulators.length > idx ? (
              <View className="items-center">
                <Animated.View
                  style={[animatedFanStyles[idx]]}
                  className="justify-center items-center mb-2">
                  <FontAwesomeIcon
                    icon={faFan}
                    size={50}
                    color={switchStates[idx] ? '#84c3e0' : '#ccc'}
                  />
                </Animated.View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={6}
                  step={1}
                  value={fanSpeeds[idx]}
                  onValueChange={(value) => handleFanSpeedChange(idx, value)}
                  disabled={!switchStates[idx]}
                  minimumTrackTintColor="#84c3e0"
                  maximumTrackTintColor="#ccc"
                />
              </View>
            ) : (
              <View className="items-center mt-2">
                <Animated.View className="justify-center items-center mb-3">
                  <FontAwesomeIcon
                    icon={faLightbulb}
                    size={40}
                    color={switchStates[idx] ? '#FFD700' : '#ccc'}
                  />
                </Animated.View>
              </View>
            )}

            {/* Countdown Timer */}
            {timers[idx] > 0 && (
              <View className="mt-4 items-center">
                <Text className="text-gray-700 dark:text-white mb-1">Time Left:</Text>
                <Text className="text-xl font-bold text-gray-800 dark:text-white">
                  {formatTime(timers[idx])}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSchedule={(timeLeft) =>
          handleScheduleTimer(selectedSwitchIndex, timeLeft)
        }
      />
    </ScrollView>
  );
}
