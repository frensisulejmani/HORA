import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hora</Text>
        <Text style={styles.subtitle}>Cosmic Insights</Text>
      </View>

      <View style={styles.buttonGroup}>
        <PrimaryButton label="Human Design Analysis" onPress={() => navigation.navigate('HumanDesign')} />
        <PrimaryButton label="Destiny Matrix" onPress={() => navigation.navigate('DestinyMatrix')} />
        <PrimaryButton label="Ascendant" onPress={() => navigation.navigate('Ascendant')} />
      </View>
    </View>
  );
};

const PrimaryButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    paddingHorizontal: 24,
    paddingTop: 32
  },
  header: {
    marginTop: 32,
    marginBottom: 32
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff'
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#9CA3AF'
  },
  buttonGroup: {
    marginTop: 24,
    gap: 16
  },
  button: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  }
});

