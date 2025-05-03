const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

// Merge default Metro config and add your custom settings
const config = mergeConfig(getDefaultConfig(__dirname), {});

// Apply NativeWind configuration with the CSS input file path
module.exports = withNativeWind(config, {
  input: './global.css',  // Make sure this path is correct
});
