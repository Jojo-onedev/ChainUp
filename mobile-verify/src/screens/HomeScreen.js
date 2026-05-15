import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useBlockchainMobile } from '../blockchain/useBlockchainMobile';

export default function HomeScreen() {
  const [mode, setMode] = useState('home'); // home | scan | result
  const [hash, setHash] = useState('');
  const [result, setResult] = useState(null);
  const [resultStatus, setResultStatus] = useState(null); // 'success' | 'error'
  const [scanned, setScanned] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { loading, verifyDiploma } = useBlockchainMobile();

  // ── Vérification blockchain / Hors-ligne ──
  const handleVerify = async (hashValue) => {
    const h = hashValue || hash;
    if (!h.trim()) return;

    setMode('result');
    setResult(null);
    setResultStatus(null);
    setOfflineMode(false);

    // Tentative de lecture Hors-ligne (JSON)
    try {
      if (h.startsWith('{')) {
        const decoded = JSON.parse(h);
        if (decoded.s) {
          // C'est un certificat signé !
          setResult({
            name: decoded.n,
            degree: decoded.d,
            year: decoded.y,
            date: "Certifié par " + decoded.i,
            valid: true
          });
          setResultStatus('success');
          setOfflineMode(true);
          return;
        }
      }
    } catch (e) {
      console.log("Not a JSON QR, checking as hash...");
    }

    // Sinon, vérification Blockchain classique (Online)
    const data = await verifyDiploma(h.trim());
    if (data && data.valid) {
      setResult(data);
      setResultStatus('success');
    } else {
      setResultStatus('error');
    }
  };

  // ── Scanner QR ──
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
        Alert.alert('Permission refusée', "L'accès à la caméra est nécessaire pour scanner un QR Code.");
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

  // ─────────────────────────────────────────
  // ÉCRAN : Scanner QR
  // ─────────────────────────────────────────
  if (mode === 'scan') {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar barStyle="light-content" />
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
        <View style={styles.scanOverlay}>
          <Text style={styles.scanTitle}>DiploChain Verify</Text>
          <Text style={styles.scanSubtitle}>Pointez votre caméra vers le QR Code du diplôme</Text>

          {/* Cadre de scan avec coins bleus */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={reset}>
            <MaterialIcons name="close" size={18} color="#fff" />
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─────────────────────────────────────────
  // ÉCRAN : Résultat
  // ─────────────────────────────────────────
  if (mode === 'result') {
    return (
      <LinearGradient colors={['#f8fafc', '#e0f2fe']} style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.resultContainer}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <MaterialIcons name="verified-user" size={22} color="#fff" />
            </View>
            <Text style={styles.logoText}>
              DiploChain <Text style={{ color: '#2563eb' }}>Verify</Text>
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Consultation de la Blockchain...</Text>
            </View>

          ) : resultStatus === 'success' && result ? (
            <View style={styles.resultCard}>
              <LinearGradient colors={['#dcfce7', '#f0fdf4']} style={styles.successBadge}>
                <MaterialIcons name="check-circle" size={44} color="#16a34a" />
              </LinearGradient>
              <Text style={styles.resultTitle}>Diplôme Authentique</Text>
              {offlineMode ? (
                <View style={[styles.networkBadge, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', alignSelf: 'center', marginBottom: 15 }]}>
                  <MaterialIcons name="offline-pin" size={12} color="#2563eb" />
                  <Text style={[styles.networkText, { color: '#2563eb' }]}>SIGNATURE CRYPTO · HORS-LIGNE</Text>
                </View>
              ) : (
                <Text style={styles.resultSubtitle}>Certifié sur la blockchain Polygon</Text>
              )}

              <View style={styles.divider} />

              <InfoRow label="Titulaire" value={result.name} />
              <InfoRow label="Type de diplôme" value={result.degree} />
              <InfoRow label="Année" value={String(result.year)} />
              <InfoRow label="Enregistré le" value={result.date} />

              <View style={styles.divider} />
              <Text style={styles.hashLabel}>EMPREINTE NUMÉRIQUE</Text>
              <Text style={styles.hashValue} numberOfLines={2}>{hash}</Text>

              <TouchableOpacity style={styles.primaryBtn} onPress={reset}>
                <MaterialIcons name="refresh" size={18} color="#fff" />
                <Text style={styles.primaryBtnText}>Nouvelle Vérification</Text>
              </TouchableOpacity>
            </View>

          ) : (
            <View style={styles.resultCard}>
              <LinearGradient colors={['#fee2e2', '#fff1f2']} style={styles.errorBadge}>
                <MaterialIcons name="gpp-bad" size={44} color="#dc2626" />
              </LinearGradient>
              <Text style={styles.resultTitle}>Diplôme Non Valide</Text>
              <Text style={styles.resultSubtitle}>
                Ce code ne correspond à aucun diplôme certifié sur DiploChain.
              </Text>
              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#ef4444' }]} onPress={reset}>
                <MaterialIcons name="refresh" size={18} color="#fff" />
                <Text style={styles.primaryBtnText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    );
  }

  // ─────────────────────────────────────────
  // ÉCRAN : Accueil
  // ─────────────────────────────────────────
  return (
    <LinearGradient colors={['#f8fafc', '#eff6ff']} style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.homeContainer}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <MaterialIcons name="verified-user" size={22} color="#fff" />
          </View>
          <Text style={styles.logoText}>
            DiploChain <Text style={{ color: '#2563eb' }}>Verify</Text>
          </Text>
        </View>

        {/* Badge réseau */}
        <View style={styles.networkBadge}>
          <View style={styles.dot} />
          <Text style={styles.networkText}>POLYGON AMOY · ACTIF</Text>
        </View>

        {/* Titre */}
        <Text style={styles.heroTitle}>
          Vérifiez un{'\n'}diplôme en{'\n'}<Text style={{ color: '#2563eb' }}>30 secondes.</Text>
        </Text>
        <Text style={styles.heroSub}>
          Scannez le QR Code ou saisissez le hash pour confirmer l'authenticité d'un diplôme sur la blockchain.
        </Text>

        {/* Bouton Scanner */}
        <TouchableOpacity onPress={handleScanPress} activeOpacity={0.85}>
          <LinearGradient colors={['#1e40af', '#2563eb']} style={styles.scanBtn}>
            <View style={styles.scanBtnIconBox}>
              <MaterialIcons name="qr-code-scanner" size={32} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.scanBtnTitle}>Scanner un QR Code</Text>
              <Text style={styles.scanBtnSub}>Utilisez la caméra de votre téléphone</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
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
          <View style={styles.inputWrapper}>
            <MaterialIcons name="search" size={20} color="#94a3b8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="0x... (Collez le hash ici)"
              placeholderTextColor="#cbd5e1"
              value={hash}
              onChangeText={setHash}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <TouchableOpacity
            style={[styles.verifyBtn, !hash.trim() && { opacity: 0.4 }]}
            onPress={() => handleVerify()}
            disabled={!hash.trim()}
          >
            <MaterialIcons name="verified" size={18} color="#fff" />
            <Text style={styles.verifyBtnText}>Vérifier le Diplôme</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© 2026 DiploChain · Décentralisé & Sécurisé</Text>
      </ScrollView>
    </LinearGradient>
  );
}

// ── Ligne d'info ──
const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  homeContainer: { flexGrow: 1, padding: 28, paddingTop: 60 },
  resultContainer: { flexGrow: 1, padding: 28, paddingTop: 60 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  logoBox: { width: 42, height: 42, backgroundColor: '#2563eb', borderRadius: 13, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563eb', shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  logoText: { fontSize: 20, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },

  // Badge réseau
  networkBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#bbf7d0', alignSelf: 'flex-start', marginBottom: 32, gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22c55e' },
  networkText: { fontSize: 10, fontWeight: '800', color: '#16a34a', letterSpacing: 1 },

  // Titre
  heroTitle: { fontSize: 40, fontWeight: '900', color: '#0f172a', lineHeight: 48, marginBottom: 14 },
  heroSub: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 36 },

  // Bouton Scanner
  scanBtn: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, borderRadius: 24, shadowColor: '#2563eb', shadowOpacity: 0.3, shadowRadius: 16, elevation: 8, marginBottom: 0 },
  scanBtnIconBox: { width: 52, height: 52, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  scanBtnTitle: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 2 },
  scanBtnSub: { fontSize: 12, color: '#bfdbfe' },

  // Séparateur
  separator: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 28 },
  line: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  orText: { fontSize: 12, fontWeight: '700', color: '#94a3b8' },

  // Saisie manuelle
  inputCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  inputLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 1.5, marginBottom: 10 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 14, paddingHorizontal: 14, borderWidth: 2, borderColor: '#e2e8f0', marginBottom: 14 },
  input: { flex: 1, paddingVertical: 14, fontSize: 14, color: '#0f172a', fontWeight: '600' },
  verifyBtn: { backgroundColor: '#0f172a', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  verifyBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  footer: { textAlign: 'center', color: '#cbd5e1', fontSize: 10, fontWeight: '700', marginTop: 32, letterSpacing: 1 },

  // Scanner overlay
  scanOverlay: { flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: 32, paddingTop: 80 },
  scanTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },
  scanSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 8 },
  scanFrame: { width: 260, height: 260, position: 'relative' },
  corner: { position: 'absolute', width: 36, height: 36, borderColor: '#2563eb', borderWidth: 4 },
  cornerTL: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 8 },
  cornerTR: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 8 },
  cornerBL: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 8 },
  cornerBR: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 8 },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 20 },
  cancelText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Résultat
  resultCard: { backgroundColor: '#fff', borderRadius: 32, padding: 28, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20, elevation: 5 },
  successBadge: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  errorBadge: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  resultTitle: { fontSize: 26, fontWeight: '900', color: '#0f172a', textAlign: 'center', marginBottom: 6 },
  resultSubtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 16, lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  infoLabel: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase', flex: 1 },
  infoValue: { fontSize: 15, fontWeight: '700', color: '#0f172a', flex: 1.5, textAlign: 'right' },
  hashLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 1.5, marginBottom: 6 },
  hashValue: { fontSize: 11, fontFamily: 'monospace', color: '#2563eb', backgroundColor: '#eff6ff', padding: 10, borderRadius: 10, marginBottom: 24 },
  primaryBtn: { backgroundColor: '#0f172a', borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  loadingBox: { alignItems: 'center', paddingVertical: 60, gap: 16 },
  loadingText: { fontSize: 13, fontWeight: '700', color: '#94a3b8', letterSpacing: 1 },
});
