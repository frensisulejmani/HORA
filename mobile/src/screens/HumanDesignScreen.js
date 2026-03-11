import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { hdAPI } from '../api';

export const HumanDesignScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await hdAPI.generateHumanDesign({});
        setData(res.data);
      } catch (e) {
        setError('Unable to load Human Design chart.');
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
        <Text style={styles.loadingText}>Calculating Geometry…</Text>
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
      <Text style={styles.heading}>THE BODYGRAPH</Text>
      <Text style={styles.subheading}>
        Your genetic blueprint is a technical map of your soul’s differentiation.
      </Text>

      <View style={styles.cardRow}>
        <InfoCard label="Type" value={data?.type || '—'} detail={data?.typeDescription} />
        <InfoCard label="Strategy" value={data?.strategy || '—'} detail={data?.authorityDescription} />
      </View>

      <View style={styles.cardRow}>
        <InfoCard label="Authority" value={data?.authority || '—'} detail={data?.authorityDescription} />
        <InfoCard label="Profile" value={data?.profile || '—'} detail={data?.profileDescription} />
      </View>

      {data?.incarnationCross && (
        <View style={styles.fullCard}>
          <Text style={styles.cardLabel}>Life Theme (Incarnation Cross)</Text>
          <Text style={styles.cardValue}>{data.incarnationCross}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const InfoCard = ({ label, value, detail }) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
    {detail ? <Text style={styles.cardDetail}>{detail}</Text> : null}
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
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)'
  },
  fullCard: {
    marginTop: 16,
    backgroundColor: 'rgba(15,23,42,0.8)',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4
  },
  cardDetail: {
    fontSize: 13,
    color: '#9CA3AF'
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

