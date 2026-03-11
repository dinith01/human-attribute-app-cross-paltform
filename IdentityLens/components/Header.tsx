import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';

export const Header = () => {
  
  // The magic function to log out
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Identity Lens 🔍</Text>
      
      <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Pushes title and button to opposite sides
    alignItems: 'center',
    width: '100%',
    marginTop: 50, 
    marginBottom: 30,
  },
  title: { 
    fontSize: 28, // Slightly smaller to make room for the button
    fontWeight: '900', 
    color: '#FFFFFF', 
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)', 
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Glassy semi-transparent background
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  }
});