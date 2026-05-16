import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { LoginData } from '@/constants/DummyData';

type Credentials = {
  email: string;
  password: string;
};

const BRAND_GOLD = '#D4AF37';
const BG_DARK = '#0C1420';
const CARD_BG = '#162032';
const INPUT_BG = '#1E2D42';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_MUTED = '#8A9BB0';
const BORDER_COLOR = '#2A3F58';

export default function LoginScreen() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleInputChange = useCallback((field: keyof Credentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  }, [error]);

  const checkCredentials = (email: string, password: string) => {
    return LoginData.find((user) => user.id === email && user.pass === password);
  };

  const handleLogin = async () => {
    const { email, password } = credentials;
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const matchedUser = checkCredentials(email, password);
      if (matchedUser) {
        router.replace('/beats-outlet');
      } else {
        setLoading(false);
        setError('Invalid email or password. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const togglePassword = useCallback(() => setShowPassword((v) => !v), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('@/assets/images/diageo.png')}
                style={styles.logo}
              />
            </View>
            <View style={styles.divider} />
            <Text style={styles.appTitle}>Field Sales Portal</Text>
            <Text style={styles.appSubtitle}>Sign in to manage your beat routes</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeading}>Welcome back</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email address</Text>
              <TextInput
                mode="outlined"
                value={credentials.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="you@diageo.com"
                placeholderTextColor={TEXT_MUTED}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <FontAwesomeIcon icon={faEnvelope} size={16} color={TEXT_MUTED} />
                    )}
                  />
                }
                style={styles.textInput}
                outlineStyle={styles.inputOutline}
                textColor={TEXT_PRIMARY}
                theme={{
                  colors: {
                    primary: BRAND_GOLD,
                    onSurfaceVariant: TEXT_MUTED,
                    background: INPUT_BG,
                  },
                }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                mode="outlined"
                value={credentials.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                placeholder="••••••••"
                placeholderTextColor={TEXT_MUTED}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <FontAwesomeIcon icon={faLock} size={16} color={TEXT_MUTED} />
                    )}
                  />
                }
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    color={TEXT_MUTED}
                    onPress={togglePassword}
                  />
                }
                style={styles.textInput}
                outlineStyle={styles.inputOutline}
                textColor={TEXT_PRIMARY}
                theme={{
                  colors: {
                    primary: BRAND_GOLD,
                    onSurfaceVariant: TEXT_MUTED,
                    background: INPUT_BG,
                  },
                }}
              />
            </View>

            {error && (
              <View style={styles.errorBox}>
                <FontAwesomeIcon icon={faCircleExclamation} size={14} color="#FC8181" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator size="small" color={BG_DARK} />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerDot} />
            <Text style={styles.footerText}>Powered by 79 Technologies</Text>
            <View style={styles.footerDot} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_DARK,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginBottom: 20,
    shadowColor: BRAND_GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    width: 180,
    height: 48,
    resizeMode: 'contain',
  },
  divider: {
    width: 48,
    height: 2,
    backgroundColor: BRAND_GOLD,
    borderRadius: 2,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  cardHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_MUTED,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: INPUT_BG,
    fontSize: 15,
  },
  inputOutline: {
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    borderWidth: 1,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(252, 129, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(252, 129, 129, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#FC8181',
    fontSize: 13,
    flex: 1,
  },
  loginButton: {
    backgroundColor: BRAND_GOLD,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: BRAND_GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#0C1420',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 32,
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER_COLOR,
  },
  footerText: {
    fontSize: 12,
    color: TEXT_MUTED,
    letterSpacing: 0.3,
  },
});
