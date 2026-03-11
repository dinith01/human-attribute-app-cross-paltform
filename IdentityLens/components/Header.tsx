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
  
  // Cleaner, flatter title
  title: { fontSize: 26, fontWeight: '800', color: '#F8FAFC', letterSpacing: 0.5 },
  
  // Sleeker logout button
  logoutButton: { backgroundColor: 'rgba(255, 255, 255, 0.08)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' },
  logoutText: { color: '#94A3B8', fontWeight: '600', fontSize: 14 },
  
  // Premium Tab Design
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 4 }, // Sharper corners (12) look more professional than heavily rounded ones
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#38BDF8' }, // Professional Sky Blue Accent
  tabText: { color: '#64748B', fontWeight: '600', fontSize: 15 },
  activeTabText: { color: '#0F172A', fontWeight: 'bold' } // Dark text on light blue background for massive contrast
});