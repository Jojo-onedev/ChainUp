import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useBlockchainMobile } from '../blockchain/useBlockchainMobile';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [mode, setMode] = useState('home'); // home, scan, manual, result
  const [hash, setHash] = useState('');
  const [result, setResult] = useState(null);
  const [resultStatus, setResultStatus] = useState(null); // 'success' | 'error'
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { loading, verifyDiploma } = useBlockchainMobile();

  const handleVerify = async (hashValue) => {
    const h = hashValue || hash;
    if (!h.trim()) return;

    setMode('result');
    setResult(null);
    setResultStatus(null);

    const data = await verifyDiploma(h.trim());
    if (data && data.valid) {
      setResult(data);
      setResultStatus('success');
    } else {
      setResultStatus('error');
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setHash(data);
    handleVerify(data);
  };

  const handleScanPress = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Permission refusée',
          "L'accès à la caméra est nécessaire pour scanner un QR Code."
        );
        return;
      }
    }
    setScanned(false);
    setMode('scan');
  };

  const reset = () => {
    setMode('home');
    setHash('');
    setResult(null);
    setResultStatus(null);
    setScanned(false);
  };

  // ── SCAN QR ──
  if (mode === 'scan') {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar barStyle="light-content" />
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />

        {/* Overlay */}
        <View style={styles.scanOverlay}>
          <Text style={styles.scanTitle}>DiploChain Verify</Text>
          <Text style={styles.scanSubtitle}>Pointez votre caméra vers le QR Code du diplôme</Text>

          {/* Cadre de scan */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={reset}>
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── RÉSULTAT ──
  if (mode === 'result') {
    return (
      <LinearGradient colors={['#f8fafc', '#e0f2fe']} style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.resultContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Text style={styles.logoIcon}>🛡</Text>
            </View>
            <Text style={styles.logoText}>DiploChain <Text style={{ color: '#2563eb' }}>Verify</Text></Text>
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Consultation de la Blockchain...</Text>
            </View>
          ) : resultStatus === 'success' && result ? (
            <View style={styles.resultCard}>
              {/* Badge */}
              <LinearGradient colors={['#dcfce7', '#f0fdf4']} style={styles.successBadge}>
                <Text style={styles.successIcon}>✓</Text>
              </LinearGradient>
              <Text style={styles.resultTitle}>Diplôme Authentique</Text>
              <Text style={styles.resultSubtitle}>Certifié sur la blockchain Polygon</Text>

              <View style={styles.divider} />

              {/* Infos */}
              <InfoRow label="Titulaire" value={result.name} />
              <InfoRow label="Type de diplôme" value={result.degree} />
              <InfoRow label="Année" value={String(result.year)} />
              <InfoRow label="Enregistré le" value={result.date} />

              <View style={styles.divider} />
              <Text style={styles.hashLabel}>EMPREINTE NUMÉRIQUE</Text>
              <Text style={styles.hashValue} numberOfLines={2}>{hash}</Text>

              <TouchableOpacity style={styles.primaryBtn} onPress={reset}>
                <Text style={styles.primaryBtnText}>Nouvelle Vérification</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.resultCard}>
              <LinearGradient colors={['#fee2e2', '#fff1f2']} style={styles.errorBadge}>
                <Text style={styles.errorIcon}>✕</Text>
              </LinearGradient>
              <Text style={styles.resultTitle}>Diplôme Non Valide</Text>
              <Text style={styles.resultSubtitle}>
                Ce code ne correspond à aucun diplôme certifié sur DiploChain.
              </Text>

              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#ef4444' }]} onPress={reset}>
                <Text style={styles.primaryBtnText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    );
  }

  // ── HOME + SAISIE MANUELLE ──
  return (
    <LinearGradient colors={['#f8fafc', '#eff6ff']} style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.homeContainer}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>🛡</Text>
          </View>
          <Text style={styles.logoText}>DiploChain <Text style={{ color: '#2563eb' }}>Verify</Text></Text>
        </View>

        {/* Badge réseau */}
        <View style={styles.networkBadge}>
          <View style={styles.dot} />
          <Text style={styles.networkText}>POLYGON AMOY · ACTIF</Text>
        </View>

        {/* Titre principal */}
        <Text style={styles.heroTitle}>Vérifiez un{'\n'}diplôme en{'\n'}<Text style={{ color: '#2563eb' }}>30 secondes.</Text></Text>
        <Text style={styles.heroSub}>
          Scannez le QR Code ou saisissez le hash pour confirmer l'authenticité d'un diplôme sur la blockchain.
        </Text>

        {/* Bouton Scan QR */}
        <TouchableOpacity onPress={handleScanPress} activeOpacity={0.85}>
          <LinearGradient colors={['#1e40af', '#2563eb']} style={styles.scanBtn}>
            <Text style={styles.scanBtnIcon}>📷</Text>
            <View>
              <Text style={styles.scanBtnTitle}>Scanner un QR Code</Text>
              <Text style={styles.scanBtnSub}>Utilisez la caméra de votre téléphone</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Séparateur */}
        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.orText}>ou</Text>
          <View style={styles.line} />
        </View>

        {/* Saisie manuelle */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>SAISIE MANUELLE DU HASH</Text>
          <TextInput
            style={styles.input}
            placeholder="0x... (Copiez le hash du diplôme)"
            placeholderTextColor="#cbd5e1"
            value={hash}
            onChangeText={setHash}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.verifyBtn, !hash.trim() && { opacity: 0.5 }]}
            onPress={() => handleVerify()}
            disabled={!hash.trim()}
          >
            <Text style={styles.verifyBtnText}>✓  Vérifier le Diplôme</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>© 2026 DiploChain · Décentralisé & Sécurisé</Text>
      </ScrollView>
    </LinearGradient>
  );
}

// Composant Info Row
const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

// ── STYLES ──
const styles = StyleSheet.create({
  homeContainer: { flexGrow: 1, padding: 28, paddingTop: 60 },
  resultContainer: { flexGrow: 1, padding: 28, paddingTop: 60 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  logoBox: { width: 40, height: 40, backgroundColor: '#2563eb', borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563eb', shadowOpacity: 0.4, shadowRadius: 8 },
  logoIcon: { fontSize: 20 },
  logoText: { fontSize: 20, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },

  networkBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#bbf7d0', alignSelf: 'flex-start', marginBottom: 32, gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22c55e' },
  networkText: { fontSize: 10, fontWeight: '800', color: '#16a34a', letterSpacing: 1 },

  heroTitle: { fontSize: 42, fontWeight: '900', color: '#0f172a', lineHeight: 50, marginBottom: 14 },
  heroSub: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 36 },

  scanBtn: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 22, borderRadius: 24, shadowColor: '#2563eb', shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  scanBtnIcon: { fontSize: 32 },
  scanBtnTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  scanBtnSub: { fontSize: 12, color: '#bfdbfe', marginTop: 2 },

  separator: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 28 },
  line: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  orText: { fontSize: 12, fontWeight: '700', color: '#94a3b8' },

  inputCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  inputLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 1.5, marginBottom: 10 },
  input: { backgroundColor: '#f8fafc', borderRadius: 14, padding: 16, fontSize: 15, color: '#0f172a', fontWeight: '600', marginBottom: 14, borderWidth: 2, borderColor: '#e2e8f0' },
  verifyBtn: { backgroundColor: '#0f172a', borderRadius: 16, padding: 18, alignItems: 'center' },
  verifyBtnText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },

  footer: { textAlign: 'center', color: '#cbd5e1', fontSize: 10, fontWeight: '700', marginTop: 32, letterSpacing: 1 },

  // Scan overlay
  scanOverlay: { flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: 32, paddingTop: 80 },
  scanTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },
  scanSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 8 },
  scanFrame: { width: 260, height: 260, position: 'relative' },
  corner: { position: 'absolute', width: 36, height: 36, borderColor: '#2563eb', borderWidth: 4 },
  cornerTL: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 8 },
  cornerTR: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 8 },
  cornerBL: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 8 },
  cornerBR: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 8 },
  cancelBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 20 },
  cancelText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Résultat
  resultCard: { backgroundColor: '#fff', borderRadius: 32, padding: 28, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20, elevation: 5 },
  successBadge: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  successIcon: { fontSize: 36, color: '#16a34a', fontWeight: '900' },
  errorBadge: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  errorIcon: { fontSize: 36, color: '#dc2626', fontWeight: '900' },
  resultTitle: { fontSize: 26, fontWeight: '900', color: '#0f172a', textAlign: 'center', marginBottom: 6 },
  resultSubtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 16, lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  infoLabel: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase', flex: 1 },
  infoValue: { fontSize: 15, fontWeight: '700', color: '#0f172a', flex: 1.5, textAlign: 'right' },
  hashLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 1.5, marginBottom: 6 },
  hashValue: { fontSize: 11, fontFamily: 'monospace', color: '#2563eb', backgroundColor: '#eff6ff', padding: 10, borderRadius: 10, marginBottom: 24 },
  primaryBtn: { backgroundColor: '#0f172a', borderRadius: 18, padding: 18, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  loadingBox: { alignItems: 'center', paddingVertical: 60, gap: 16 },
  loadingText: { fontSize: 13, fontWeight: '700', color: '#94a3b8', letterSpacing: 1 },
});
