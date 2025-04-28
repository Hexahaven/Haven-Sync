import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import GreetingSection from '../components/GreetingSection';
import WeatherSection from '../components/WeatherSection';
import SwitchSection from '../components/SwitchSection';
import LinearGradient from 'react-native-linear-gradient';

export default function HexaDashboard() {
  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={['#bedcea', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1">
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Header / Greeting */}
            <View className="p-6 pb-2">
              <GreetingSection />
            </View>

            {/* Weather + Status */}
            <View className="px-6">
              <WeatherSection />
            </View>

            {/* Switches (Smart Controls) */}
            <View className="mt-4 px-6">
              <Text className="text-xl font-semibold text-gray-700 mb-4">
                Smart Controls
              </Text>
              <SwitchSection />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
