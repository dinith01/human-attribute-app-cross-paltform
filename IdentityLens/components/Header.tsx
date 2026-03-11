import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';

export const Header = () => {
  const { currentTab, setTab } = useAppStore();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Identity Lens 🔍</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* 🆕 Navigation Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, currentTab === 'scanner' && styles.activeTab]} 
          onPress={() => setTab('scanner')}
        >
          <Text style={[styles.tabText, currentTab === 'scanner' && styles.activeTabText]}>Scanner</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, currentTab === 'history' && styles.activeTab]} 
          onPress={() => setTab('history')}
        >
          <Text style={[styles.tabText, currentTab === 'history' && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', marginTop: 50, marginBottom: 20 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  logoutButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.4)' },
  logoutText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  
  // Tab Styles
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 25, padding: 5 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
  activeTab: { backgroundColor: 'rgba(255,255,255,0.3)' },
  tabText: { color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: 16 },
  activeTabText: { color: '#FFFFFF', fontWeight: 'bold' }
});