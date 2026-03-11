import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppStore } from '../store/useAppStore';

export const ResultCard = () => {
  const { results } = useAppStore();

  if (!results) return null;

  return (
    // 🔮 The Glassmorphism Result Container
    <BlurView intensity={70} tint="light" style={styles.glassCard}>
      <Text style={styles.resultTitle}>AI Insights</Text>
      
      <View style={styles.divider} />

      {Object.entries(results).map(([key, value]) => (
        <View key={key} style={styles.resultRow}>
          <Text style={styles.keyText}>{key}</Text>
          <Text style={styles.valueText}>{String(value)}</Text>
        </View>
      ))}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  glassCard: { 
    width: '100%', 
    padding: 25, 
    borderRadius: 24, 
    marginTop: 30, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  resultTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 10 },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginBottom: 15 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  keyText: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' },
  valueText: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
});