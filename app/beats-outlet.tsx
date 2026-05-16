import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { BeatsOutletSegmentInterface } from '@/interface/BeatsOutletSegment';
import { getBeats, getOutletsByBeat } from '@/db/queries/beats';
import { FinalOrderContext } from '@/contexts/FinalOrderContext';
import CustomDropdown from '@/components/CustomDropdown';

export default function BeatsOutletScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { finalOrderData } = useContext(FinalOrderContext);

  const [beatsDropdownData, setBeatsDropdownData] = useState<BeatsOutletSegmentInterface[]>([]);
  const [outletDropdownData, setOutletDropdownData] = useState<BeatsOutletSegmentInterface[]>([]);
  const [selectedBeat, setSelectedBeat] = useState<BeatsOutletSegmentInterface | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<BeatsOutletSegmentInterface | null>(null);

  useEffect(() => {
    getBeats(db).then(setBeatsDropdownData);
  }, [db]);

  useEffect(() => {
    setSelectedOutlet(null);
    if (!selectedBeat) {
      setOutletDropdownData([]);
      return;
    }
    getOutletsByBeat(db, selectedBeat.id).then(setOutletDropdownData);
  }, [db, selectedBeat]);

  useEffect(() => {
    if (!selectedOutlet || !selectedBeat) return;
    router.push({
      pathname: '/brands',
      params: {
        beatId: selectedBeat.id,
        beatName: selectedBeat.name,
        outletId: selectedOutlet.id,
        outletName: selectedOutlet.name,
      },
    });
  }, [selectedOutlet]);

  if (beatsDropdownData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Fetching Beats Data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {finalOrderData && (
        <View style={styles.lastOrderBanner}>
          <Text style={styles.lastOrderText}>
            Order #{finalOrderData.orderId} submitted — {finalOrderData.outletName}
          </Text>
        </View>
      )}
      <Text style={styles.dropdownText}>
        Welcome Aboard! <FontAwesomeIcon icon={faUserTie} size={25} style={styles.buttonIcons} />
      </Text>
      <View style={styles.dropdownContainerActive}>
        <CustomDropdown
          setSelectedDropdownProps={setSelectedBeat}
          dropdownData={beatsDropdownData}
          dropdownType="Beat"
        />
      </View>
      {outletDropdownData.length > 0 && (
        <View style={styles.dropdownContainerActive}>
          <CustomDropdown
            setSelectedDropdownProps={setSelectedOutlet}
            dropdownData={outletDropdownData}
            dropdownType="Outlet"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B0B61',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B0B61',
  },
  dropdownContainerActive: {
    width: '100%',
    height: 200,
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 25,
    height: 50,
  },
  buttonIcons: {
    color: '#ffffff',
  },
  loadingText: {
    color: '#ffffff',
  },
  lastOrderBanner: {
    width: '100%',
    backgroundColor: '#00887A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  lastOrderText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
