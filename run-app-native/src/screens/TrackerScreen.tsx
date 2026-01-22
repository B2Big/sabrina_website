import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import * as Location from 'expo-location';
import Svg, { Polyline, Circle } from 'react-native-svg';
import { Play, Pause } from 'lucide-react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(TouchableOpacity);

const { width } = Dimensions.get('window');

export default function TrackerScreen() {
  const [isActive, setIsActive] = useState(false);
  const [coords, setCoords] = useState<{latitude: number, longitude: number}[]>([]);
  const [stats, setStats] = useState({ distance: 0, speed: 0, time: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  useEffect(() => {
    let sub: any;
    if (isActive) {
        // Start Timer
        timerRef.current = setInterval(() => {
            setStats(s => ({ ...s, time: s.time + 1 }));
        }, 1000);

        // Start GPS
        (async () => {
            sub = await Location.watchPositionAsync(
                { 
                    accuracy: Location.Accuracy.BestForNavigation, 
                    distanceInterval: 5,
                    timeInterval: 1000 
                },
                (loc) => {
                    const { latitude, longitude, speed } = loc.coords;
                    setCoords(prev => [...prev, { latitude, longitude }]);
                    setStats(prev => ({
                        ...prev,
                        speed: Math.max(0, (speed || 0) * 3.6), // m/s to km/h
                        distance: prev.distance + 5 // rough approx
                    }));
                }
            );
        })();
    } else {
        if (timerRef.current) clearInterval(timerRef.current);
        if (sub) sub.remove();
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (sub) sub.remove();
    };
  }, [isActive]);

  const toggle = () => setIsActive(!isActive);

  // --- ABSTRACT PATH VISUALIZATION ---
  const points = useMemo(() => {
    if (coords.length < 2) return "";
    const scale = 80000;
    const last = coords[coords.length - 1];
    return coords.map(c => {
        const x = (c.longitude - last.longitude) * scale + (width / 2);
        const y = (last.latitude - c.latitude) * scale + 200;
        return `${x},${y}`;
    }).join(' ');
  }, [coords]);

  const formatTime = (s: number) => {
      const min = Math.floor(s / 60);
      const sec = s % 60;
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <StyledView className="flex-1 bg-midnight relative">
        {/* ABSTRACT MAP BACKGROUND */}
        <StyledView className="absolute inset-0 opacity-50">
            <Svg height="100%" width="100%">
                <Polyline
                    points={points}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    strokeDasharray="10, 10"
                />
                <Circle cx={width/2} cy="200" r="8" fill="#3B82F6" />
                <Circle cx={width/2} cy="200" r="40" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
            </Svg>
        </StyledView>

        {/* LIVE DASHBOARD */}
        <StyledView className="absolute bottom-0 w-full bg-surface/90 rounded-t-[3rem] p-8 pb-12 border-t border-white/10 backdrop-blur-xl">
            <StyledView className="flex-row justify-between mb-8">
                <StyledView>
                    <StyledText className="text-gray-400 font-bold text-xs uppercase mb-1">Distance</StyledText>
                    <StyledText className="text-white text-5xl font-black tracking-tighter">
                        {(stats.distance / 1000).toFixed(2)} <StyledText className="text-lg text-training">km</StyledText>
                    </StyledText>
                </StyledView>
                <StyledView className="items-end">
                    <StyledText className="text-gray-400 font-bold text-xs uppercase mb-1">Chrono</StyledText>
                    <StyledText className="text-white text-5xl font-mono font-bold tracking-tighter">
                        {formatTime(stats.time)}
                    </StyledText>
                </StyledView>
            </StyledView>

            <StyledView className="flex-row items-center justify-between">
                <StyledView className="bg-white/5 px-6 py-4 rounded-2xl">
                    <StyledText className="text-gray-400 font-bold text-xs uppercase">Vitesse</StyledText>
                    <StyledText className="text-training text-2xl font-black">{stats.speed.toFixed(1)} km/h</StyledText>
                </StyledView>

                <StyledButton 
                    onPress={toggle}
                    className={`w-20 h-20 rounded-full items-center justify-center shadow-lg ${isActive ? 'bg-surface border-2 border-red-500' : 'bg-training'}`}
                >
                    {isActive ? <Pause fill="#EF4444" size={32} /> : <Play fill="white" size={32} />}
                </StyledButton>
            </StyledView>
        </StyledView>
    </StyledView>
  );
}