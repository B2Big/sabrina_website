import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { styled } from 'nativewind';
import { Activity, Clock, Trophy, Zap } from 'lucide-react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledButton = styled(TouchableOpacity);

export default function CalculatorScreen() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);

  // Smart Parsing: "4500" -> "45m 00s"
  const formattedTime = useMemo(() => {
    const raw = input.replace(/\D/g, '');
    if (raw.length === 0) return '';
    
    // Strict Logic:
    // 5-6 chars: HHMMSS
    // 3-4 chars: MMSS
    // 1-2 chars: MM
    
    let h = 0, m = 0, s = 0;
    
    if (raw.length > 4) {
       h = parseInt(raw.slice(0, raw.length - 4));
       m = parseInt(raw.slice(raw.length - 4, raw.length - 2));
       s = parseInt(raw.slice(raw.length - 2));
    } else if (raw.length > 2) {
       m = parseInt(raw.slice(0, raw.length - 2));
       s = parseInt(raw.slice(raw.length - 2));
    } else {
       m = parseInt(raw);
    }
    
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  }, [input]);

  const calculate = () => {
    Keyboard.dismiss();
    const raw = input.replace(/\D/g, '');
    let totalSeconds = 0;
    
    if (raw.length > 4) {
       const h = parseInt(raw.slice(0, raw.length - 4));
       const m = parseInt(raw.slice(raw.length - 4, raw.length - 2));
       const s = parseInt(raw.slice(raw.length - 2));
       totalSeconds = h * 3600 + m * 60 + s;
    } else if (raw.length > 2) {
       const m = parseInt(raw.slice(0, raw.length - 2));
       const s = parseInt(raw.slice(raw.length - 2));
       totalSeconds = m * 60 + s;
    } else {
       const m = parseInt(raw);
       totalSeconds = m * 60;
    }

    if (totalSeconds === 0) return;

    // VMA Logic: Speed for 10km / 0.9
    const speed = (10 / totalSeconds) * 3600;
    const vma = speed / 0.9;

    // Paces
    const formatPace = (pct: number) => {
        const s = vma * pct;
        const paceSec = 3600 / s;
        const min = Math.floor(paceSec / 60);
        const sec = Math.round(paceSec % 60);
        return `${min}'${sec < 10 ? '0' : ''}${sec}"`;
    };

    setResult({
        vma: vma.toFixed(1),
        ef: formatPace(0.70), // 70%
        marathon: formatPace(0.80), // 80%
        threshold: formatPace(0.88) // 88%
    });
  };

  return (
    <StyledView className="flex-1 bg-midnight p-6 pt-12">
      <StyledView className="mb-8">
        <StyledText className="text-training text-lg font-bold tracking-widest uppercase mb-2">
            Smart Calc
        </StyledText>
        <StyledText className="text-white text-4xl font-black">
            Définis ton <StyledText className="text-training">Allure</StyledText>
        </StyledText>
      </StyledView>

      <StyledView className="bg-surface p-6 rounded-3xl mb-6 border border-white/5">
        <StyledText className="text-gray-400 font-bold mb-2 uppercase text-xs">
            Temps sur 10km (Tapez '4500' pour 45m00s)
        </StyledText>
        <StyledInput
            className="text-white text-5xl font-black p-0 mb-2"
            keyboardType="numeric"
            placeholder="4500"
            placeholderTextColor="#333"
            value={input}
            onChangeText={setInput}
        />
        <StyledText className="text-training font-mono text-xl">
            {formattedTime || '00m 00s'}
        </StyledText>
      </StyledView>

      <StyledButton 
        onPress={calculate}
        className="bg-training py-5 rounded-2xl items-center shadow-lg shadow-blue-500/20 active:bg-blue-600 mb-8"
      >
        <StyledText className="text-white font-black text-xl uppercase tracking-wide">
            Calculer
        </StyledText>
      </StyledButton>

      {result && (
        <ScrollView className="flex-1">
            <StyledView className="flex-row items-center justify-between bg-white/5 p-6 rounded-3xl mb-4 border border-training/20">
                <StyledView>
                    <StyledText className="text-gray-400 font-bold text-xs uppercase mb-1">VMA Estimée</StyledText>
                    <StyledText className="text-white text-4xl font-black">{result.vma}</StyledText>
                </StyledView>
                <Activity size={40} color="#3B82F6" />
            </StyledView>

            <StyledView className="flex-row gap-4">
                <ResultCard icon={Clock} label="Endurance" value={result.ef} sub="70% VMA" />
                <ResultCard icon={Zap} label="Seuil" value={result.threshold} sub="88% VMA" />
            </StyledView>
        </ScrollView>
      )}
    </StyledView>
  );
}

function ResultCard({ icon: Icon, label, value, sub }: any) {
    return (
        <StyledView className="flex-1 bg-surface p-5 rounded-3xl border border-white/5">
            <Icon size={24} color="#3B82F6" className="mb-3" />
            <StyledText className="text-gray-400 font-bold text-xs uppercase mb-1">{label}</StyledText>
            <StyledText className="text-white text-2xl font-black mb-1">{value}</StyledText>
            <StyledText className="text-training text-xs font-bold">{sub}</StyledText>
        </StyledView>
    );
}