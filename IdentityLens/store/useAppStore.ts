import { create } from 'zustand';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';

interface AppState {
  imageUri: string | null;
  results: Record<string, string> | null;
  loading: boolean;
  setImageUri: (uri: string | null) => void;
  analyzeImage: (asset: any) => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  imageUri: null,
  results: null,
  loading: false,
  setImageUri: (uri) => set({ imageUri: uri }),
  
  analyzeImage: async (asset) => {
    set({ loading: true, results: null });

    // 1. Get the current logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Error', 'You must be logged in to scan images.');
      set({ loading: false });
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: asset.uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);

    try {
      // 2. Fetch AI Results from Hugging Face
      const hfResponse = await fetch('https://dinith01-blip-api.hf.space/analyze', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const aiData = await hfResponse.json();
      
      if (aiData.error || aiData.status === "Failed") {
        Alert.alert("AI Error", aiData.message || "Failed to analyze image.");
        set({ loading: false });
        return;
      }

      set({ results: aiData });

      // ==========================================
      // 3. SUPABASE UPLOAD & SAVE LOGIC
      // ==========================================
      
      // 🔧 NEW BASE64 UPLOAD LOGIC
      if (!asset.base64) {
        throw new Error("Base64 data is missing from the image asset.");
      }

      const fileName = `${user.id}/${Date.now()}.jpg`;

      // Upload using the base64 decoder
      const { error: uploadError } = await supabase.storage
        .from('scan_images')
        .upload(fileName, decode(asset.base64), { 
          contentType: 'image/jpeg' 
        });

      if (uploadError) {
        console.error("Storage Error:", uploadError);
        // 🚨 Show the exact error message from Supabase
        Alert.alert("Storage Upload Blocked", uploadError.message || "Unknown storage error");
        set({ loading: false });
        return;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('scan_images')
        .getPublicUrl(fileName);

      // Insert row into PostgreSQL Database
      const { error: dbError } = await supabase
        .from('scan_history')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          ai_results: aiData,
        });

      if (dbError) {
        console.error("Database Error:", dbError);
        // 🚨 Show the exact error message from Supabase
        Alert.alert("Database Insert Blocked", dbError.message || "Unknown database error");
      }

    } catch (error) {
      console.error("Full Error:", error);
      Alert.alert('Error', 'An unexpected error occurred during analysis.');
    } finally {
      set({ loading: false });
    }
  },
}));