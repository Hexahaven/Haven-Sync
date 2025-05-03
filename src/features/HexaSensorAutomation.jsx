import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCheckSquare,
  faSquare,
  faClock,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import TimePickerModal from '../components/TimePickerModal';
import { saveSensorConfig } from '../redux/slices/switchSlice';

export default function HexaSensorAutomation() {
  const dispatch = useDispatch();
  const activeDevices = useSelector(state => state.switches.activeDevices);
  const sensorConfig = useSelector(state => state.switches.sensorConfig || {});

  const [enabled, setEnabled] = useState(sensorConfig.enabled || false);
  const [selectedSwitches, setSelectedSwitches] = useState(
    sensorConfig.switches || [],
  );
  const [timer, setTimer] = useState(sensorConfig.timer || 60);
  const [modalVisible, setModalVisible] = useState(false);

  const handleToggleAutomation = () => {
    setEnabled(prev => !prev);
  };

  const handleToggleSwitch = (deviceId, switchIndex) => {
    const id = `${deviceId}_${switchIndex}`;
    const newSelection = selectedSwitches.includes(id)
      ? selectedSwitches.filter(i => i !== id)
      : [...selectedSwitches, id];

    setSelectedSwitches(newSelection);
  };

  const handleSave = () => {
    dispatch(saveSensorConfig({ enabled, switches: selectedSwitches, timer }));
    Alert.alert('Saved', 'Sensor automation config has been saved!');
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        PIR Sensor Automation
      </Text>

      <View className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-6">
        <Text className="text-lg font-semibold text-gray-700 dark:text-white">
          Enable Automation
        </Text>
        <Switch value={enabled} onValueChange={handleToggleAutomation} />
      </View>

      <Text className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
        Select Switches
      </Text>

      <View className="space-y-4 mb-6">
        {activeDevices.map(device =>
          device.switches.map((_, idx) => {
            const id = `${device.id}_${idx}`;
            const isSelected = selectedSwitches.includes(id);
            return (
              <TouchableOpacity
                key={id}
                className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-xl"
                onPress={() => handleToggleSwitch(device.id, idx)}>
                <Text className="text-gray-800 dark:text-white">
                  {device.name || `Device ${device.id}`} - Switch {idx + 1}
                </Text>
                <FontAwesomeIcon
                  icon={isSelected ? faCheckSquare : faSquare}
                  color={isSelected ? '#84c3e0' : '#aaa'}
                />
              </TouchableOpacity>
            );
          }),
        )}
      </View>

      <TouchableOpacity
        className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-6"
        onPress={() => setModalVisible(true)}>
        <Text className="text-gray-800 dark:text-white font-semibold">
          Auto Turn-Off Delay
        </Text>
        <View className="flex-row items-center space-x-2">
          <FontAwesomeIcon icon={faClock} size={16} color="#84c3e0" />
          <Text className="text-[#84c3e0] font-semibold">{timer} sec</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSave}
        className="bg-[#84c3e0] py-3 rounded-xl flex-row justify-center items-center shadow-md">
        <FontAwesomeIcon icon={faSave} size={18} color="white" />
        <Text className="text-white text-lg font-bold ml-3">Save Settings</Text>
      </TouchableOpacity>

      <TimePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSchedule={timeLeft => {
          setTimer(timeLeft);
          setModalVisible(false);
        }}
      />
    </ScrollView>
  );
}
