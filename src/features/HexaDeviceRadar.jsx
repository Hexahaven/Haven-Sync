import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import BluetoothStateManager from 'react-native-bluetooth-status';
import { PermissionsAndroid } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  Animated,
  Platform,
  Vibration,
  Dimensions,
  Linking,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faPlus, 
  faQrcode, 
  faKeyboard, 
  faTimes, 
  faWifi, 
  faCog,
  faFlashlight,
  faPlug,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addDevice } from '../redux/slices/switchSlice';
// Updated imports - replace the old libraries
import { Camera, useCameraDevices, useCodeScanner } from 'react-native-vision-camera';
import { useFocusEffect } from '@react-navigation/native';

const AnimatedSuccessPopup = ({ visible, message, onDashboard, onAnother }) => {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.9);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.successPopupContainer, { transform: [{ scale }], opacity }]}>
          <FontAwesomeIcon icon={faCheckCircle} size={50} color="#10B981" style={{ marginBottom: 12 }} />
          <Text style={styles.successTitle}>Device Configured</Text>
          <Text style={styles.successMessage}>{message}</Text>
          <View style={styles.successButtonGroup}>
            <TouchableOpacity style={styles.successButtonPrimary} onPress={onDashboard}>
              <Text style={styles.successButtonText}>Go to Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.successButtonSecondary} onPress={onAnother}>
              <Text style={styles.successButtonText}>Add Another Device</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};


const { width, height } = Dimensions.get('window');

// Simplified device registry - using only 3-channel as default
const deviceRegistry = {
  '3-channel': {
    displayName: '3-Channel Switch',
    icon: faPlug, // Fixed: using the imported icon
    channels: { switches: 3, regulators: 0 },
    defaultProps: { switchLabels: ['Switch 1', 'Switch 2', 'Switch 3'] },
  },
};


export default function ManualDeviceSetup() {
  const [setupMethod, setSetupMethod] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('3-channel'); // Fixed to 3-channel
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const fadeAnim = new Animated.Value(1);
  
  // Vision Camera setup with error handling
  const devices = useCameraDevices();
  const device = devices?.back || devices?.find(d => d.position === 'back');
const goToDashboard = () => {
  setShowSuccessPopup(false);
  resetForm();
  navigation.navigate('HexaDashboard');
};
useEffect(() => {
  const checkConnectivity = async () => {
    const netInfo = await NetInfo.fetch();
    const bluetoothEnabled = await BluetoothStateManager.getState();

    if (!netInfo.isConnected || netInfo.type !== 'wifi') {
      Alert.alert(
        'WiFi Required',
        'Please turn on WiFi to continue device setup.',
        [{ text: 'OK' }]
      );
    }

    if (bluetoothEnabled !== 'on') {
      Alert.alert(
        'Bluetooth Required',
        'Please turn on Bluetooth to connect to your device.',
        [{ text: 'OK' }]
      );
    }
  };

  // Ask for necessary permissions on Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        ]);
      } catch (err) {
        console.warn('Permission error', err);
      }
    }
  };

  requestPermissions().then(checkConnectivity);
}, []);

const addAnotherDevice = () => {
  setShowSuccessPopup(false);
  resetForm();
};

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'code-128', 'code-39', 'ean-13'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && isActive) {
        handleQRCodeScan(codes[0]);
      }
    }
  });

  // Handle camera activation when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (showQRScanner && hasPermission) {
        setIsActive(true);
      }
      return () => setIsActive(false);
    }, [showQRScanner, hasPermission])
  );

  // Check permission on component mount
  useEffect(() => {
    checkCameraPermission();
  }, []);

  // Activate camera when permission is granted and scanner is open
  useEffect(() => {
    if (showQRScanner && hasPermission && !isActive) {
      setTimeout(() => {
        setIsActive(true);
      }, 500);
    }
  }, [showQRScanner, hasPermission]);

  const checkCameraPermission = async () => {
    try {
      const status = await Camera.getCameraPermissionStatus();
      console.log('Camera permission status:', status);
      const hasPermissionResult = status === 'authorized' || status === 'granted';
      setHasPermission(hasPermissionResult);
      setPermissionChecked(true);
      return hasPermissionResult;
    } catch (error) {
      console.warn('Permission check error:', error);
      setHasPermission(false);
      setPermissionChecked(true);
      return false;
    }
  };

  const requestCameraPermission = async () => {
    try {
      console.log('Requesting camera permission...');
      const status = await Camera.requestCameraPermission();
      console.log('Permission request result:', status);
      
      const hasPermissionResult = status === 'authorized' || status === 'granted';
      setHasPermission(hasPermissionResult);
      
      if (!hasPermissionResult) {
        Alert.alert(
          'Camera Permission Required',
          'Camera access is needed to scan QR codes. Please enable camera permission in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              }
            }
          ]
        );
      }
      
      return hasPermissionResult;
    } catch (err) {
      console.warn('Permission request error:', err);
      setHasPermission(false);
      Alert.alert(
        'Permission Error',
        'Unable to request camera permission. Please enable camera access manually in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Open Settings', 
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            }
          }
        ]
      );
      return false;
    }
  };

  const handleSetupMethodSelect = async (method) => {
    setSetupMethod(method);
    if (method === 'qr') {
      try {
        // First check if we already have permission
        let currentPermission = hasPermission;
        
        if (!permissionChecked) {
          currentPermission = await checkCameraPermission();
        }
        
        if (currentPermission) {
          console.log('Permission already granted, opening scanner');
          setShowQRScanner(true);
        } else {
          console.log('Requesting permission');
          const granted = await requestCameraPermission();
          if (granted) {
            console.log('Permission granted, opening scanner');
            setTimeout(() => {
              setShowQRScanner(true);
            }, 300);
          } else {
            console.log('Permission denied');
            // Reset to allow user to try again
            setSetupMethod(null);
          }
        }
      } catch (error) {
        console.error('QR setup error:', error);
        Alert.alert('Camera Error', 'Unable to access camera. Please try manual setup instead.');
        setSetupMethod(null);
      }
    }
  };

  const handleQRCodeScan = (code) => {
    if (!isActive) return; // Prevent multiple scans
    
    try {
      console.log('QR Code scanned:', code.value);
      Vibration.vibrate(100);
      const scannedData = code.value;
      
      // Temporarily disable scanning to prevent multiple scans
      setIsActive(false);
      setShowQRScanner(false);
      
      try {
        const deviceInfo = JSON.parse(scannedData);
        setDeviceId(deviceInfo.deviceId || '');
        setDeviceName(deviceInfo.deviceName || 'Smart Device');
        setWifiSSID(deviceInfo.wifiSSID || '');
        // Device type is fixed to 3-channel, no need to set from QR
      } catch (parseError) {
        // If not JSON, treat as device ID
        setDeviceId(scannedData.trim());
        setDeviceName('Smart Device');
      }
      
      setSetupMethod('manual');
      Alert.alert('QR Code Scanned!', 'Device information loaded successfully.');
    } catch (error) {
      console.error('QR scan error:', error);
      Alert.alert('Scan Error', 'Unable to process QR code. Please try again.');
      setIsActive(true); // Re-enable scanning on error
    }
  };

  const toggleFlash = () => {
  if (device?.hasTorch === false) {
    Alert.alert('Flash Unavailable', 'This device does not have a flash unit.');
    return;
  }
  setFlashEnabled(prev => !prev);
};


  const validateInputs = () => {
    if (!deviceId.trim()) {
      Alert.alert('Error', 'Please enter a valid Device ID');
      return false;
    }
    if (!deviceName.trim()) {
      Alert.alert('Error', 'Please enter a device name');
      return false;
    }
    if (!wifiSSID.trim()) {
      Alert.alert('Error', 'Please enter WiFi network name');
      return false;
    }
    return true;
  };

  const handleDeviceSetup = async () => {
    if (!validateInputs()) return;

    setConnecting(true);
    
    // Animate pulse effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const deviceTemplate = deviceRegistry[deviceType];
      if (!deviceTemplate) {
        throw new Error(`Unknown device type: ${deviceType}`);
      }

      const newDevice = {
        id: deviceId.trim(),
        name: deviceName.trim(),
        deviceId: deviceId.trim(),
        type: deviceType,
        icon: deviceTemplate.icon, // This should now be the actual icon, not undefined
        isOn: false,
        isConnected: true,
        switches: Array(deviceTemplate.channels.switches).fill(false),
        regulators: Array(deviceTemplate.channels.regulators).fill(50),
        wifiSSID: wifiSSID.trim(),
        configuredAt: new Date().toISOString(),
        status: 'online',
        signalStrength: -45,
        ...deviceTemplate.defaultProps,
      };

      dispatch(addDevice(newDevice));
      setConnecting(false);
      
      setShowSuccessPopup(true);


    } catch (error) {
      console.error('Device setup error:', error);
      setConnecting(false);
      Alert.alert('Setup Failed', 'Unable to configure device. Please try again.');
    }
  };

  const resetForm = () => {
    setSetupMethod(null);
    setDeviceId('');
    setDeviceName('');
    setDeviceType('3-channel');
    setWifiSSID('');
    setWifiPassword('');
    setConnecting(false);
    setShowQRScanner(false);
    setIsActive(false);
    setFlashEnabled(false);
  };

  const closeQRScanner = () => {
    setIsActive(false);
    setShowQRScanner(false);
    setFlashEnabled(false);
    setSetupMethod(null);
  };

  const retryPermission = async () => {
    const granted = await requestCameraPermission();
    if (granted) {
      // Small delay to ensure permission is fully processed
      setTimeout(() => {
        setIsActive(true);
      }, 500);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Device Setup</Text>
        <Text style={styles.subtitle}>Add and configure your smart devices</Text>
      </View>

      <View style={styles.setupOptions}>
        <TouchableOpacity style={styles.setupCard} onPress={() => handleSetupMethodSelect('qr')}>
          <View style={styles.cardIcon}>
            <FontAwesomeIcon icon={faQrcode} size={30} color="#72BCD9" />
          </View>
          <Text style={styles.cardTitle}>Scan QR Code</Text>
          <Text style={styles.cardDescription}>Scan the QR code on your device for quick setup</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.setupCard, { marginTop: 20 }]} onPress={() => handleSetupMethodSelect('manual')}>
          <View style={styles.cardIcon}>
            <FontAwesomeIcon icon={faKeyboard} size={30} color="#72BCD9" />
          </View>
          <Text style={styles.cardTitle}>Manual Entry</Text>
          <Text style={styles.cardDescription}>Enter device ID and WiFi details manually</Text>
        </TouchableOpacity>
      </View>

      {/* QR Scanner Modal */}
      <Modal visible={showQRScanner} transparent={false} animationType="slide" onRequestClose={closeQRScanner}>
        <View style={styles.qrContainer}>
          <View style={styles.qrHeader}>
            <Text style={styles.qrTitle}>Scan QR Code</Text>
            <View style={styles.qrButtons}>
              {hasPermission && device && (
                <TouchableOpacity onPress={toggleFlash} style={styles.qrButton}>
                  <Icon
  name={flashEnabled ? 'flashlight' : 'flashlight-outline'}
  size={20}
  color={flashEnabled ? '#72BCD9' : '#fff'}
/>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={closeQRScanner} style={styles.qrButton}>
                <FontAwesomeIcon icon={faTimes} size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.qrInstructions}>Position the QR code within the frame</Text>

          <View style={styles.qrScannerArea}>
            {device && hasPermission ? (
              <>
                <Camera
                  style={styles.qrCamera}
                  device={device}
                  isActive={isActive && showQRScanner}
                  codeScanner={codeScanner}
                  torch={flashEnabled && device.hasTorch ? 'on' : 'off'}
                  enableZoomGesture={true}
                />
                
                {/* QR Code Frame Overlay */}
                <View style={styles.qrOverlay}>
                  <View style={styles.qrFrame} />
                  <Text style={styles.scanningText}>
                    {isActive ? 'Scanning...' : 'Starting camera...'}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.notAuthorized}>
                {!hasPermission ? (
                  <>
                    <FontAwesomeIcon icon={faQrcode} size={60} color="#666" style={{ marginBottom: 20 }} />
                    <Text style={styles.notAuthorizedText}>Camera permission is required to scan QR codes</Text>
                    <TouchableOpacity style={styles.permissionBtn} onPress={retryPermission}>
                      <Text style={styles.permissionBtnText}>Grant Camera Permission</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faQrcode} size={60} color="#666" style={{ marginBottom: 20 }} />
                    <Text style={styles.notAuthorizedText}>No camera available on this device</Text>
                  </>
                )}
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.manualButton} onPress={() => { closeQRScanner(); setSetupMethod('manual'); }}>
            <Text style={styles.manualButtonText}>Enter manually instead</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Manual Setup Modal */}
      <Modal visible={setupMethod === 'manual'} transparent={true} animationType="slide" onRequestClose={resetForm}>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Device Configuration</Text>
                <TouchableOpacity onPress={resetForm}>
                  <FontAwesomeIcon icon={faTimes} size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              {connecting && (
                <Animated.View style={[styles.connectingIndicator, { opacity: fadeAnim }]}>
                  <FontAwesomeIcon icon={faCog} size={30} color="#72BCD9" />
                  <Text style={styles.connectingText}>Configuring device...</Text>
                </Animated.View>
              )}

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Device Information</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Device ID *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={deviceId}
                    onChangeText={setDeviceId}
                    placeholder="e.g., HEXA-ABC123XYZ"
                    placeholderTextColor="#aaa"
                    editable={!connecting}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Device Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={deviceName}
                    onChangeText={setDeviceName}
                    placeholder="e.g., Living Room Switch"
                    placeholderTextColor="#aaa"
                    editable={!connecting}
                  />
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>WiFi Configuration</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>WiFi Network Name (SSID) *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={wifiSSID}
                    onChangeText={setWifiSSID}
                    placeholder="Your WiFi network name"
                    placeholderTextColor="#aaa"
                    editable={!connecting}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>WiFi Password</Text>
                  <TextInput
                    style={styles.textInput}
                    value={wifiPassword}
                    onChangeText={setWifiPassword}
                    placeholder="WiFi password (optional)"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    editable={!connecting}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.setupButton, connecting && styles.setupButtonDisabled]}
                onPress={handleDeviceSetup}
                disabled={connecting}
              >
                <FontAwesomeIcon icon={connecting ? faCog : faWifi} size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.setupButtonText}>
                  {connecting ? 'Configuring Device...' : 'Configure Device'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
      <Modal visible={showSuccessPopup} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.successModal}>
      <Text style={styles.successTitle}>Success!</Text>
      <Text style={styles.successMessage}>
        {deviceName} has been successfully configured.
      </Text>
      <View style={styles.successActions}>
        <TouchableOpacity onPress={goToDashboard}>
          <Text style={styles.successActionText}>GO TO DASHBOARD</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addAnotherDevice}>
          <Text style={styles.successActionText}>ADD ANOTHER DEVICE</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
<AnimatedSuccessPopup
  visible={showSuccessPopup}
  message={`${deviceName} has been successfully configured.`}
  onDashboard={goToDashboard}
  onAnother={addAnotherDevice}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1f1f1f', paddingTop: 60 },
  header: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#aaa', textAlign: 'center' },
  setupOptions: { paddingHorizontal: 20 },
  setupCard: { backgroundColor: '#2c3e50', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 5 },
  cardIcon: { backgroundColor: 'rgba(114, 188, 217, 0.2)', borderRadius: 30, padding: 20, marginBottom: 16 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  cardDescription: { fontSize: 14, color: '#aaa', textAlign: 'center', lineHeight: 20 },
  
  // QR Scanner
  qrContainer: { flex: 1, backgroundColor: '#1f1f1f' },
  qrHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 50 : 30, paddingBottom: 20, backgroundColor: '#2c3e50' },
  qrTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  qrButtons: { flexDirection: 'row' },
  qrButton: { padding: 12, borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginLeft: 10 },
  qrInstructions: { color: '#aaa', fontSize: 16, textAlign: 'center', marginVertical: 20, paddingHorizontal: 20 },
  qrScannerArea: { flex: 1, position: 'relative' },
  qrCamera: { flex: 1, width: '100%' },
  qrOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  qrFrame: { width: 250, height: 250, borderWidth: 3, borderColor: '#72BCD9', borderRadius: 20, backgroundColor: 'transparent' },
  scanningText: { color: '#72BCD9', fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  notAuthorized: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1f1f1f', paddingHorizontal: 20 },
  notAuthorizedText: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 20, lineHeight: 24 },
  permissionBtn: { backgroundColor: '#72BCD9', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 12 },
  permissionBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  manualButton: { alignSelf: 'center', padding: 20, marginBottom: Platform.OS === 'ios' ? 40 : 20 },
  manualButtonText: { color: '#72BCD9', fontSize: 16, textDecorationLine: 'underline', fontWeight: '600' },
  
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  modalContent: { backgroundColor: '#2c3e50', borderRadius: 20, margin: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  connectingIndicator: { backgroundColor: '#34495e', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 20 },
  connectingText: { color: '#72BCD9', fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  formSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 6 },
  textInput: { backgroundColor: '#34495e', borderRadius: 8, padding: 12, fontSize: 16, color: '#fff', borderWidth: 1, borderColor: '#4a5a6a' },

  setupButton: { backgroundColor: '#72BCD9', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  setupButtonDisabled: { backgroundColor: '#5a8fa8' },
  setupButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  successModal: {
  backgroundColor: '#fff',
  borderRadius: 16,
  paddingVertical: 24,
  paddingHorizontal: 20,
  width: '90%',
  maxWidth: 320,
  alignSelf: 'center',
  alignItems: 'center',
  elevation: 8
},
successPopupContainer: {
  backgroundColor: '#fff',
  paddingVertical: 28,
  paddingHorizontal: 24,
  borderRadius: 20,
  alignItems: 'center',
  width: '85%',
  maxWidth: 320,
  alignSelf: 'center',
  elevation: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
},
successButtonGroup: {
  flexDirection: 'column',
  width: '100%',
  marginTop: 20,
  gap: 12,
},
successButtonPrimary: {
  backgroundColor: '#10B981',
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
},
successButtonSecondary: {
  backgroundColor: '#E5E7EB',
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
},
successButtonText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#111827',
},
});