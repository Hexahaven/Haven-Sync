import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faPlus,
  faLightbulb,
  faSave,
  faTrash,
  faToggleOn,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons';
import { saveScene, deleteScene, runScene } from '../redux/slices/switchSlice';

export default function HexaScenes() {
  const dispatch = useDispatch();
  const activeDevices = useSelector(state => state.switches.activeDevices);
  const scenes = useSelector(state => state.switches.scenes || []);

  const [creating, setCreating] = useState(false);
  const [sceneName, setSceneName] = useState('');
  const [selectedSwitches, setSelectedSwitches] = useState([]);

  const toggleSwitch = (deviceId, switchIndex) => {
    const key = `${deviceId}_${switchIndex}`;
    const exists = selectedSwitches.find(item => item.key === key);
    if (exists) {
      const updated = selectedSwitches.map(item =>
        item.key === key ? { ...item, state: !item.state } : item,
      );
      setSelectedSwitches(updated);
    } else {
      setSelectedSwitches([
        ...selectedSwitches,
        { key, deviceId, switchIndex, state: true },
      ]);
    }
  };

  const isChecked = (deviceId, switchIndex) =>
    selectedSwitches.find(
      item => item.key === `${deviceId}_${switchIndex}` && item.state,
    );

  const handleSaveScene = () => {
    if (!sceneName.trim()) {
      Alert.alert('Missing Name', 'Please enter a scene name.');
      return;
    }

    if (selectedSwitches.length === 0) {
      Alert.alert('No Switches', 'Please select at least one switch.');
      return;
    }

    dispatch(saveScene({ name: sceneName, switches: selectedSwitches }));
    setSceneName('');
    setSelectedSwitches([]);
    setCreating(false);
  };

  const handleRunScene = scene => {
    dispatch(runScene(scene));
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Smart Scenes
      </Text>

      {!creating ? (
        <TouchableOpacity
          className="bg-[#84c3e0] p-3 rounded-xl flex-row items-center justify-center mb-6"
          onPress={() => setCreating(true)}>
          <FontAwesomeIcon icon={faPlus} color="#fff" />
          <Text className="text-white font-bold text-lg ml-3">Add New Scene</Text>
        </TouchableOpacity>
      ) : (
        <View className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
          <TextInput
            value={sceneName}
            onChangeText={setSceneName}
            placeholder="Enter Scene Name"
            className="border p-3 rounded-md mb-4 text-gray-900 dark:text-white"
            placeholderTextColor="#AAA"
          />

          <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Choose Switches & States
          </Text>

          {activeDevices.map(device =>
            device.switches.map((_, idx) => {
              const key = `${device.id}_${idx}`;
              const state = isChecked(device.id, idx);

              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => toggleSwitch(device.id, idx)}
                  className="flex-row justify-between items-center bg-white dark:bg-gray-700 p-3 rounded-lg mb-2">
                  <Text className="text-gray-800 dark:text-white">
                    {device.name || `Device ${device.id}`} - Switch {idx + 1}
                  </Text>
                  <FontAwesomeIcon
                    icon={state ? faToggleOn : faToggleOff}
                    color={state ? '#10B981' : '#aaa'}
                    size={24}
                  />
                </TouchableOpacity>
              );
            }),
          )}

          <View className="flex-row mt-4 space-x-2">
            <TouchableOpacity
              onPress={() => {
                setCreating(false);
                setSceneName('');
                setSelectedSwitches([]);
              }}
              className="flex-1 bg-gray-300 py-3 rounded-xl items-center">
              <Text className="text-gray-800 font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSaveScene}
              className="flex-1 bg-[#84c3e0] py-3 rounded-xl items-center">
              <Text className="text-white font-bold">Save Scene</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Existing Scenes */}
      <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Your Scenes
      </Text>

      {scenes.map((scene, index) => (
        <View
          key={index}
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-gray-800 dark:text-white">
              {scene.name}
            </Text>
            <TouchableOpacity onPress={() => dispatch(deleteScene(scene.name))}>
              <FontAwesomeIcon icon={faTrash} size={18} color="#dc2626" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => handleRunScene(scene)}
            className="bg-[#ff8625] p-2 rounded-lg items-center">
            <Text className="text-white font-semibold">Run Scene</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
