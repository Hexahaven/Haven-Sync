import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';

export default function DeviceDetectorLoader() {
  const rotate = useSharedValue(0);
  const pulse = useSharedValue(0.7);

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, { duration: 2500, easing: Easing.linear }),
      -1,
      false
    );

    pulse.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const rotatingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const pulsingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View className="flex items-center justify-center h-44 w-44 relative">
      {/* Radar Base */}
      <Svg width="150" height="150" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="circleGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#ff8625" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#84c3e0" stopOpacity="0.2" />
          </LinearGradient>
        </Defs>
        {[20, 30, 40].map(r => (
          <Circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            stroke="url(#circleGradient)"
            strokeWidth="2"
            fill="transparent"
          />
        ))}
      </Svg>

      {/* Rotating Sweep */}
      <Animated.View
        style={[
          rotatingStyle,
          {
            position: 'absolute',
            top: 0,
            left: 0,
          },
        ]}>
        <Svg width="150" height="150" viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="sweep" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#84c3e0" stopOpacity="0.7" />
              <Stop offset="100%" stopColor="#84c3e0" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <G origin="50,50">
            <Circle
              cx="50"
              cy="50"
              r="40"
              fill="url(#sweep)"
              rotation="45"
              opacity={0.5}
            />
          </G>
        </Svg>
      </Animated.View>

      {/* Pulsing Dot */}
      <Animated.View
        style={[
          pulsingStyle,
          {
            position: 'absolute',
            width: 14,
            height: 14,
            backgroundColor: '#ff8625',
            borderRadius: 7,
          },
        ]}
      />
    </View>
  );
}
