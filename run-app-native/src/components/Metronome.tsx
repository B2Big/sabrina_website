import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { styled } from 'nativewind';
import { Play, Pause } from 'lucide-react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(TouchableOpacity);

export default function Metronome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const toggle = async () => {
    if (isPlaying) {
      if (sound) await sound.stopAsync();
      setIsPlaying(false);
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(
         { uri: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
         { shouldPlay: true, isLooping: true } 
      );
      setSound(newSound);
      setIsPlaying(true);
    }
  };

  return (
    <StyledView className="bg-surface p-4 rounded-2xl flex-row items-center justify-between border border-white/5 shadow-xl">
        <StyledView>
            <StyledText className="text-white font-bold text-lg">Metronome Pro</StyledText>
            <StyledText className="text-training text-xs font-bold">180 BPM • Cadence Idéale</StyledText>
        </StyledView>
        
        <StyledButton 
            onPress={toggle}
            className={`w-12 h-12 rounded-full items-center justify-center ${isPlaying ? 'bg-red-500/20' : 'bg-training/20'}`}
        >
            {isPlaying ? <Pause size={20} color="#EF4444" /> : <Play size={20} color="#3B82F6" />}
        </StyledButton>
    </StyledView>
  );
}