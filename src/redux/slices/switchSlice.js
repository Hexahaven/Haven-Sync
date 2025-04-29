import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeDevices: [],
  cardNames: [],
  timers: {},
  mainToggleTimer: 0,
  sensorConfig: {
    enabled: false,
    switches: [],
    timer: 60,
  },
  scenes: [],
};

const switchSlice = createSlice({
  name: 'switches',
  initialState,
  reducers: {
    addDevice: (state, action) => {
      const newDevice = action.payload;
      state.activeDevices.push(newDevice);
      state.cardNames.push({ id: newDevice.id, name: `Device ${newDevice.id}` });
    },
    removeDevice: (state, action) => {
      const id = action.payload;
      state.activeDevices = state.activeDevices.filter(d => d.id !== id);
      state.cardNames = state.cardNames.filter(c => c.id !== id);
    },
    updateDevice: (state, action) => {
      const { id, switches, regulators } = action.payload;
      const deviceIndex = state.activeDevices.findIndex(d => d.id === id);
      if (deviceIndex !== -1) {
        if (switches) state.activeDevices[deviceIndex].switches = switches;
        if (regulators) state.activeDevices[deviceIndex].regulators = regulators;
      }
    },
    updateCardName: (state, action) => {
      const { id, name } = action.payload;
      const card = state.cardNames.find(c => c.id === id);
      if (card) card.name = name;
    },
    setTimer: (state, action) => {
      const { deviceId, switchIndex, timeLeft } = action.payload;
      if (!state.timers[deviceId]) {
        state.timers[deviceId] = {};
      }
      state.timers[deviceId][switchIndex] = timeLeft;
    },
    decrementTimer: (state, action) => {
      const { deviceId, switchIndex } = action.payload;
      if (
        state.timers[deviceId] &&
        state.timers[deviceId][switchIndex] > 0
      ) {
        state.timers[deviceId][switchIndex]--;
      }
    },
    resetTimer: (state, action) => {
      const { deviceId, switchIndex } = action.payload;
      if (state.timers[deviceId]) {
        state.timers[deviceId][switchIndex] = 0;
      }
    },
    setMainToggleTimer: (state, action) => {
      state.mainToggleTimer = action.payload;
    },
    decrementMainToggleTimer: state => {
      if (state.mainToggleTimer > 0) {
        state.mainToggleTimer--;
      }
    },
    resetMainToggleTimer: state => {
      state.mainToggleTimer = 0;
    },
    saveSensorConfig: (state, action) => {
      state.sensorConfig = action.payload;
    },

    // ✅ Scenes & Groups
    saveScene: (state, action) => {
      const { name, switches } = action.payload;
      const existing = state.scenes.find(scene => scene.name === name);
      if (existing) {
        existing.switches = switches;
      } else {
        state.scenes.push({ name, switches });
      }
    },
    deleteScene: (state, action) => {
      const name = action.payload;
      state.scenes = state.scenes.filter(scene => scene.name !== name);
    },
    runScene: (state, action) => {
      const scene = action.payload;
      scene.switches.forEach(s => {
        const device = state.activeDevices.find(d => d.id === s.deviceId);
        if (device) {
          device.switches[s.switchIndex] = s.state;
        }
      });
    },
  },
});

export const {
  addDevice,
  removeDevice,
  updateDevice,
  updateCardName,
  setTimer,
  decrementTimer,
  resetTimer,
  setMainToggleTimer,
  decrementMainToggleTimer,
  resetMainToggleTimer,
  saveSensorConfig,
  saveScene,
  deleteScene,
  runScene,
} = switchSlice.actions;

export default switchSlice.reducer;
