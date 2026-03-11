import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { supabase } from '../lib/supabase';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Sign Up Logic
  const signUpWithEmail = async () => {
    if (!email || !password) {
      Alert.alert('Hold on!', 'Please enter both an email and a password.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert('Sign Up Failed', error.message);
    else Alert.alert('Success', 'Account created! You can now log in.');
    setLoading(false);
  };

  // Log In Logic
  const signInWithEmail = async () => {
    if (!email || !password) {
      Alert.alert('Hold on!', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Log In Failed', error.message);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome to Identity Lens</Text>
      
      <BlurView intensity={70} tint="light" style={styles.glassCard}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="rgba(255,255,255,0.7)"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="rgba(255,255,255,0.7)"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          autoCapitalize="none"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={signInWithEmail}>
              <Text style={styles.primaryButtonText}>Log In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={signUpWithEmail}>
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        )}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', width: '100%', padding: 25 },
  headerText: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', marginBottom: 40, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  glassCard: { padding: 25, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  input: { backgroundColor: 'rgba(0,0,0,0.2)', color: '#FFFFFF', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  buttonContainer: { marginTop: 10, gap: 15 },
  primaryButton: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, alignItems: 'center' },
  primaryButtonText: { color: '#1E3C72', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: 'transparent', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#FFFFFF' },
  secondaryButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});