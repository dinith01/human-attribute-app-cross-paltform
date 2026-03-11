import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';

// Components
import { Auth } from '../../components/Auth';
import { Header } from '../../components/Header';
import { ImageSelector } from '../../components/ImageSelector';
import { ResultCard } from '../../components/ResultCard';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check if user is already logged in when app opens
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });

    // Listen for login/logout events
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3C72" />
      </View>
    );
  }

  return (
    <LinearGradient 
      colors={['#1E3C72', '#2A5298', '#FF7EB3']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* IF NOT LOGGED IN -> Show Auth Screen */}
        {/* IF LOGGED IN -> Show Main App */}
        {!session ? (
          <Auth />
        ) : (
          <>
            <Header />
            <ImageSelector />
            <ResultCard />
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 25, alignItems: 'center', justifyContent: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }
});