import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageCard(props: { name: string; message: string; timestamp: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{props.name}</Text>
      <Text style={styles.message}>{props.message}</Text>
      <Text style={styles.time}>{props.timestamp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  title: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  message: { fontSize: 14 },
  time: { fontSize: 12, color: '#666', marginTop: 8 },
});
