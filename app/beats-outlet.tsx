import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faRightFromBracket,
  faLocationDot,
  faShop,
  faArrowRight,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { BeatsOutletSegmentInterface } from '@/interface/BeatsOutletSegment';
import { getBeats, getOutletsByBeat } from '@/db/queries/beats';
import { FinalOrderContext } from '@/contexts/FinalOrderContext';
import CustomDropdown from '@/components/CustomDropdown';

const BG_DARK = '#0C1420';
const CARD_BG = '#162032';
const BRAND_GOLD = '#D4AF37';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_MUTED = '#8A9BB0';
const BORDER_COLOR = '#2A3F58';
const SUCCESS = '#10B981';

export default function BeatsOutletScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { finalOrderData } = useContext(FinalOrderContext);

  const [beatsDropdownData, setBeatsDropdownData] = useState<BeatsOutletSegmentInterface[]>([]);
  const [outletDropdownData, setOutletDropdownData] = useState<BeatsOutletSegmentInterface[]>([]);
  const [selectedBeat, setSelectedBeat] = useState<BeatsOutletSegmentInterface | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<BeatsOutletSegmentInterface | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBeats(db).then((data) => {
      setBeatsDropdownData(data);
      setLoading(false);
    });
  }, [db]);

  useEffect(() => {
    setSelectedOutlet(null);
    if (!selectedBeat) {
      setOutletDropdownData([]);
      return;
    }
    getOutletsByBeat(db, selectedBeat.id).then(setOutletDropdownData);
  }, [db, selectedBeat]);

  const handleContinue = useCallback(() => {
    if (!selectedBeat || !selectedOutlet) return;
    router.push({
      pathname: '/brands',
      params: {
        beatId: selectedBeat.id,
        beatName: selectedBeat.name,
        outletId: selectedOutlet.id,
        outletName: selectedOutlet.name,
      },
    });
  }, [selectedBeat, selectedOutlet, router]);

  const handleLogout = useCallback(() => {
    router.replace('/login');
  }, [router]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BRAND_GOLD} />
          <Text style={styles.loadingText}>Loading beats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dist Hub</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <FontAwesomeIcon icon={faRightFromBracket} size={16} color={TEXT_MUTED} />
        </TouchableOpacity>
      </View>

      {finalOrderData && (
        <View style={styles.successBanner}>
          <FontAwesomeIcon icon={faCircleCheck} size={15} color={SUCCESS} />
          <Text style={styles.successBannerText}>
            Order #{finalOrderData.orderId} submitted — {finalOrderData.outletName}
          </Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Select Your Route</Text>
          <Text style={styles.greetingSubtitle}>
            Choose a beat and outlet to begin punching orders
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabel}>
              <FontAwesomeIcon icon={faLocationDot} size={14} color={BRAND_GOLD} />
              <Text style={styles.fieldLabelText}>Beat</Text>
            </View>
            <CustomDropdown
              setSelectedDropdownProps={setSelectedBeat}
              dropdownData={beatsDropdownData}
              dropdownType="Beat"
            />
          </View>

          {outletDropdownData.length > 0 && (
            <View style={[styles.fieldGroup, styles.fieldGroupSpaced]}>
              <View style={styles.fieldLabel}>
                <FontAwesomeIcon icon={faShop} size={14} color={BRAND_GOLD} />
                <Text style={styles.fieldLabelText}>Outlet</Text>
              </View>
              <CustomDropdown
                setSelectedDropdownProps={setSelectedOutlet}
                dropdownData={outletDropdownData}
                dropdownType="Outlet"
              />
            </View>
          )}

          {selectedBeat && selectedOutlet && (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.continueButtonText}>Continue to Brands</Text>
              <FontAwesomeIcon icon={faArrowRight} size={15} color={BG_DARK} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerDot} />
        <Text style={styles.footerText}>Powered by 79 Technologies</Text>
        <View style={styles.footerDot} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_DARK,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  loadingText: {
    color: TEXT_MUTED,
    fontSize: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BRAND_GOLD,
    letterSpacing: 0.5,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  successBannerText: {
    color: SUCCESS,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  greetingSection: {
    marginBottom: 28,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 6,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    lineHeight: 20,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  fieldGroup: {
    gap: 10,
  },
  fieldGroupSpaced: {
    marginTop: 20,
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_MUTED,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: BRAND_GOLD,
    borderRadius: 12,
    height: 52,
    marginTop: 28,
    shadowColor: BRAND_GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: BG_DARK,
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
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
