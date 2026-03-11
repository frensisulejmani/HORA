import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { destinyAPI } from '../api';

export const DestinyMatrixScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        // Minimal payload – backend only requires name and birth date ISO
        const nowIso = new Date().toISOString();
        const res = await destinyAPI.calculateDestinyMatrix({ name: 'Seeker', birthDateISO: nowIso });
        setData(res.data?.data);
      } catch (e) {
        setError('Unable to load Destiny Matrix.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#A855F7" />
        <Text style={styles.loadingText}>Decoding Matrix…</Text>
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
      <Text style={styles.heading}>Destiny Matrix</Text>
      <Text style={styles.subheading}>
        Your birth code mapped onto the 22 Arcana system.
      </Text>

      <View style={styles.metricRow}>
        <Metric label="Life Path" value={data?.lifePathNumber} />
        <Metric label="Soul Urge" value={data?.soulUrgeNumber} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Center Number</Text>
        <Text style={styles.cardValue}>{data?.centerNumber}</Text>
        {data?.centerMeaning && <Text style={styles.cardDetail}>{data.centerMeaning}</Text>}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Material Flow (Expression)</Text>
        <Text style={styles.cardValue}>{data?.expressionNumber}</Text>
        {data?.expressionMeaning && <Text style={styles.cardDetail}>{data.expressionMeaning}</Text>}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Karmic Lessons (Soul Urge)</Text>
        <Text style={styles.cardValue}>{data?.soulUrgeNumber}</Text>
        {data?.soulUrgeMeaning && <Text style={styles.cardDetail}>{data.soulUrgeMeaning}</Text>}
      </View>
    </ScrollView>
  );
};

const Metric = ({ label, value }) => (
  <View style={styles.metric}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value ?? '—'}</Text>
  </View>
);

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
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  metric: {
    flex: 1,
    backgroundColor: 'rgba(24,24,27,0.9)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)'
  },
  metricLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#A855F7',
    marginBottom: 4
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB'
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
    color: '#A855F7',
    textTransform: 'uppercase',
    marginBottom: 8
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4
  },
  cardDetail: {
    fontSize: 13,
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
    color: '#A855F7',
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  errorText: {
    color: '#FCA5A5'
  }
});

