import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { supabase } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// This tells the web browser to close automatically after a successful login
WebBrowser.maybeCompleteAuthSession();

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Email Sign Up
  const signUpWithEmail = async () => {
    if (!email || !password) return Alert.alert('Hold on!', 'Please enter an email and password.');
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert('Sign Up Failed', error.message);
    setLoading(false);
  };

  // Email Log In
  const signInWithEmail = async () => {
    if (!email || !password) return Alert.alert('Hold on!', 'Please enter your email and password.');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Log In Failed', error.message);
    setLoading(false);
  };

  // Guest Log In
  const signInAsGuest = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInAnonymously();
    if (error) Alert.alert('Guest Login Failed', error.message);
    setLoading(false);
  };

  // 🆕 Google OAuth Log In (Updated with URL Parsing)
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const redirectUrl = Linking.createURL('');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        if (result.type === 'success' && result.url) {
          // 🔧 FIX: React Native struggles to read the tokens Google sends back automatically. 
          // We need to manually extract them from the URL and hand them to Supabase.
          
          // 1. Force the URL hash fragments to act like standard query parameters
          const fixedUrl = result.url.replace('#', '?'); 
          const parsed = Linking.parse(fixedUrl);
          
          // 2. Extract the tokens Google sent us
          const accessToken = parsed.queryParams?.access_token as string;
          const refreshToken = parsed.queryParams?.refresh_token as string;
          const code = parsed.queryParams?.code as string;

          // 3. Force Supabase to log the user in using these tokens!
          if (accessToken && refreshToken) {
            await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          } else if (code) {
            await supabase.auth.exchangeCodeForSession(code);
          }
        }
      }
    } catch (error: any) {
      Alert.alert('Google Sign-In Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Identity Lens 🔍</Text>
      
      <BlurView intensity={50} tint="dark" style={styles.glassCard}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#94A3B8"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          autoCapitalize="none"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={signInWithEmail}>
              <Text style={styles.primaryButtonText}>Log In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={signUpWithEmail}>
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* 🆕 The Google Button */}
            <TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle}>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.guestButton} onPress={signInAsGuest}>
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        )}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', width: '100%' },
  headerText: { fontSize: 36, fontWeight: '900', color: '#F8FAFC', textAlign: 'center', marginBottom: 40, letterSpacing: 1 },
  glassCard: { padding: 25, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  input: { backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#F8FAFC', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  buttonContainer: { marginTop: 10, gap: 12 },
  
  // Customizing buttons for the dark theme
  primaryButton: { backgroundColor: '#38BDF8', padding: 16, borderRadius: 12, alignItems: 'center' },
  primaryButtonText: { color: '#0F172A', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: 'transparent', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#38BDF8' },
  secondaryButtonText: { color: '#38BDF8', fontSize: 18, fontWeight: 'bold' },
  
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { color: '#94A3B8', paddingHorizontal: 10, fontSize: 14, fontWeight: 'bold' },
  
  // 🆕 Google Button Styles
  googleButton: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, alignItems: 'center' },
  googleButtonText: { color: '#0F172A', fontSize: 18, fontWeight: '800' },
  
  guestButton: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  guestButtonText: { color: '#94A3B8', fontSize: 18, fontWeight: '600' },
});