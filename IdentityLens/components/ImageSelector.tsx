import React from 'react';
import { View, Image, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import { useAppStore } from '../store/useAppStore';

export const ImageSelector = () => {
  const { imageUri, loading, setImageUri, analyzeImage } = useAppStore();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setImageUri(selectedImage.uri);
      analyzeImage(selectedImage);
    }
  };

  return (
    <>
      {/* 🔮 The Glassmorphism Container */}
      <BlurView intensity={60} tint="light" style={styles.glassCard}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>Tap below to select a photo</Text>
        )}
      </BlurView>

      {/* 🍏 Apple-style sleek white button */}
      <TouchableOpacity style={styles.appleButton} onPress={pickImage} disabled={loading}>
        {loading ? <ActivityIndicator color="#1E3C72" /> : <Text style={styles.buttonText}>Pick Photo</Text>}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  glassCard: { 
    width: '100%', 
    height: 320, 
    borderRadius: 24, // Apple loves large border radii
    overflow: 'hidden', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.3)', // The "glass edge" highlight
  },
  image: { width: '100%', height: '100%' },
  placeholderText: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 16, fontWeight: '600' },
  appleButton: { 
    width: '100%', 
    backgroundColor: '#FFFFFF', 
    padding: 18, 
    borderRadius: 16, 
    marginTop: 25, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: { color: '#1E3C72', fontSize: 18, fontWeight: '700' },
});