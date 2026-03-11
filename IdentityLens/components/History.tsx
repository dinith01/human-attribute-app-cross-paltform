import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppStore } from '../store/useAppStore';

export const History = () => {
  const { history, fetchHistory, loading } = useAppStore();

  // Fetch the data when this component loads
  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading && history.length === 0) {
    return <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 50 }} />;
  }

  if (history.length === 0) {
    return <Text style={styles.emptyText}>No previous scans found.</Text>;
  }

  // Define how each item in the list should look
  const renderItem = ({ item }: { item: any }) => {
    // Format the date
    const date = new Date(item.created_at).toLocaleDateString();

    return (
      <BlurView intensity={70} tint="light" style={styles.historyCard}>
        <Image source={{ uri: item.image_url }} style={styles.historyImage} />
        
        <View style={styles.resultsContainer}>
          <Text style={styles.dateText}>Scanned on: {date}</Text>
          <View style={styles.divider} />
          
          {Object.entries(item.ai_results).map(([key, value]) => (
            <Text key={key} style={styles.resultText}>
              <Text style={styles.bold}>{key}:</Text> {String(value)}
            </Text>
          ))}
        </View>
      </BlurView>
    );
  };

  return (
    <FlatList
      data={history}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: { paddingBottom: 40, width: '100%' },
  emptyText: { color: 'rgba(255,255,255,0.8)', fontSize: 18, textAlign: 'center', marginTop: 50 },
  historyCard: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 20, 
    padding: 15, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden'
  },
  historyImage: { width: 100, height: 100, borderRadius: 12, backgroundColor: '#ddd' },
  resultsContainer: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  dateText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 5 },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginBottom: 8 },
  resultText: { fontSize: 14, color: '#FFFFFF', marginBottom: 4 },
  bold: { fontWeight: 'bold', color: '#FF7EB3' },
});