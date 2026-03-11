import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { astroAPI } from '../api';

export const AscendantScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simple demo payload – for real use, plug in stored birth data as on the web.
        const now = new Date();
        const payload = {
          date: now.getUTCDate(),
          month: now.getUTCMonth() + 1,
          year: now.getUTCFullYear(),
          hour: now.getUTCHours(),
          minute: now.getUTCMinutes(),
          latitude: 0,
          longitude: 0,
          timezone: 0
        };
        const res = await astroAPI.getNatal(payload);
        setData(res.data?.data);
      } catch (e) {
        setError('Unable to calculate Ascendant.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#22D3EE" />
        <Text style={styles.loadingText}>Calculating Ascendant…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.heading}>Ascendant</Text>
      <Text style={styles.subheading}>
        The rising sign is the horizon of the self — how the world first meets you.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Ascendant Sign</Text>
        <Text style={styles.cardValue}>{data?.ascendant || 'Unknown'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Sun & Moon Snapshot</Text>
        <Text style={styles.cardDetail}>Sun: {data?.sunSign || 'Unknown'}</Text>
        <Text style={styles.cardDetail}>Moon: {data?.moonSign || 'Unknown'}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    paddingHorizontal: 24,
    paddingTop: 24
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8
  },
  subheading: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24
  },
  card: {
    marginTop: 12,
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)'
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#22D3EE',
    textTransform: 'uppercase',
    marginBottom: 8
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB'
  },
  cardDetail: {
    fontSize: 14,
    color: '#E5E7EB'
  },
  centered: {
    flex: 1,
    backgroundColor: '#050505',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 12,
    color: '#22D3EE',
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  errorText: {
    color: '#FCA5A5'
  }
});

