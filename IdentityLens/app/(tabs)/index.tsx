import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useAppStore } from '../../store/useAppStore';

// Components
import { Auth } from '../../components/Auth';
import { Header } from '../../components/Header';
import { ImageSelector } from '../../components/ImageSelector';
import { ResultCard } from '../../components/ResultCard';
import { History } from '../../components/History';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { currentTab } = useAppStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });

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
      colors={['#0F172A', '#1E293B', '#0F172A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* 🔧 FIX: Changed from ScrollView to a standard View */}
      <View style={styles.mainContent}>
        {!session ? (
          <Auth />
        ) : (
          <>
            <Header />
            
            {/* 🔧 FIX: Conditionally handle scrolling */}
            {currentTab === 'scanner' ? (
              // The Scanner gets a ScrollView so small screens can scroll past the image
              <ScrollView contentContainerStyle={styles.scannerScroll} showsVerticalScrollIndicator={false}>
                <ImageSelector />
                <ResultCard />
              </ScrollView>
            ) : (
              // The History tab uses its own FlatList, NO ScrollView wrapper!
              <History />
            )}
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: { flex: 1, paddingHorizontal: 25 }, // Moved padding here
  scannerScroll: { paddingBottom: 40 }, // Gives space at the bottom of the scanner
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }
});