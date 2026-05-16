import React, { useEffect, useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShop, faBan, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Brand } from '@/interface/BrandSelectionScreen';
import { BeatsOutletSegmentInterface } from '@/interface/BeatsOutletSegment';
import { SelectedOrders, SegmentOrder } from '@/interface/Orders';
import { getSegments, getBrandsBySegment } from '@/db/queries/segments';
import { saveOrder } from '@/db/queries/orders';
import { FinalOrderContext } from '@/contexts/FinalOrderContext';
import SKUModal from '@/components/SKUModal';
import ReviewOrderModal from '@/components/ReviewOrderModal';
import CustomDropdown from '@/components/CustomDropdown';

// Maps brandId → per-brand SKU selections. Distinct from SelectedOrders (skuKey → SelectedOrderData).
type BrandsOrdersList = { [brandId: string]: SelectedOrders };

export default function BrandsScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { setFinalOrderData } = useContext(FinalOrderContext);
  const { beatId, beatName, outletId, outletName } = useLocalSearchParams<{
    beatId: string;
    beatName: string;
    outletId: string;
    outletName: string;
  }>();

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [reviewOrderModalVisibility, setReviewOrderModalVisibility] = useState(false);
  const [ordersList, setOrdersList] = useState<BrandsOrdersList>({});
  const [brandsData, setBrandsData] = useState<Brand[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<BeatsOutletSegmentInterface | null>(null);
  const [segmentDropdownData, setSegmentDropdownData] = useState<BeatsOutletSegmentInterface[]>([]);
  const [segmentOrderData, setSegmentOrderData] = useState<SegmentOrder[]>([]);

  useEffect(() => {
    getSegments(db).then(setSegmentDropdownData);
  }, [db]);

  useEffect(() => {
    if (!selectedSegment) {
      setBrandsData([]);
      return;
    }
    getBrandsBySegment(db, selectedSegment.id).then((brands) => {
      setBrandsData(brands);
      setSegmentOrderData((prev) => {
        const exists = prev.some((seg) => seg.segmentId === selectedSegment.id);
        if (exists) return prev;
        return [
          ...prev,
          { segmentId: selectedSegment.id, segmentName: selectedSegment.name, segmentOrders: {} },
        ];
      });
    });
  }, [db, selectedSegment]);

  const handleOrdersUpdate = useCallback(
    (brandId: string, updatedSkus: SelectedOrders) => {
      setSegmentOrderData((prev) =>
        prev.map((seg) => {
          if (seg.segmentId !== selectedSegment?.id) return seg;
          return {
            ...seg,
            // segmentOrders is typed as SelectedOrders but holds BrandsOrdersList at runtime;
            // corrected when constants are replaced with API responses and interfaces are tightened.
            segmentOrders: {
              ...seg.segmentOrders,
              [brandId]: updatedSkus,
            } as unknown as SelectedOrders,
          };
        })
      );
      setOrdersList((prev) => ({ ...prev, [brandId]: updatedSkus }));
    },
    [selectedSegment]
  );

  const clearOrdersList = useCallback(() => setOrdersList({}), []);

  const isBrandSelected = useCallback(
    (brandId: string) => {
      if (!(brandId in ordersList)) return false;
      return Object.values(ordersList[brandId]).some((sku) => sku.checked);
    },
    [ordersList]
  );

  const handleCancelOrder = useCallback(() => {
    router.replace('/beats-outlet');
  }, [router]);

  const onSubmitOrder = useCallback(async () => {
    const orderId = await saveOrder(db, { beatId, beatName, outletId, outletName, segmentOrderData });
    setFinalOrderData({ orderId, beatId, beatName, outletId, outletName, submittedAt: new Date().toISOString() });
  }, [db, beatId, beatName, outletId, outletName, segmentOrderData, setFinalOrderData]);

  const handleBrandPress = useCallback((brand: Brand) => {
    setSelectedBrand(brand);
    setModalVisibility(true);
  }, []);

  const renderBrandItem = useCallback(
    ({ item }: { item: Brand }) => (
      <TouchableOpacity
        style={[styles.brandItem, isBrandSelected(item.id) && styles.selectedBrandItem]}
        onPress={() => handleBrandPress(item)}
      >
        <Text style={styles.brandName}>{item.name}</Text>
      </TouchableOpacity>
    ),
    [isBrandSelected, handleBrandPress]
  );

  return (
    <View style={styles.container}>
      <View style={styles.outletNameContainer}>
        <FontAwesomeIcon icon={faShop} size={32} style={styles.outletName} />
        <Text style={styles.outletName}>{outletName}</Text>
      </View>
      <View style={styles.dropdownContainerActive}>
        <CustomDropdown
          setSelectedDropdownProps={setSelectedSegment}
          dropdownData={segmentDropdownData}
          dropdownType="Segment"
        />
      </View>
      <FlatList
        style={styles.brandContainer}
        data={brandsData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderBrandItem}
      />
      {Object.keys(ordersList).length > 0 ? (
        <View style={styles.bottomComponentContainer}>
          <TouchableOpacity
            style={[styles.bottomComponentReview, styles.bottomComponentButton]}
            onPress={() => setReviewOrderModalVisibility(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.bottomComponentText}>
              Review <FontAwesomeIcon icon={faSearch} size={20} style={styles.buttonIcons} />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bottomComponentCancel, styles.bottomComponentButton]}
            onPress={handleCancelOrder}
          >
            <Text style={styles.bottomComponentText}>
              Cancel <FontAwesomeIcon icon={faBan} size={20} style={styles.buttonIcons} />
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.cancelOrderButton} onPress={handleCancelOrder}>
          <Text style={styles.bottomComponentText}>
            Cancel <FontAwesomeIcon icon={faBan} size={20} style={styles.buttonIcons} />
          </Text>
        </TouchableOpacity>
      )}
      {modalVisibility && selectedBrand && (
        <SKUModal
          selectedBrand={selectedBrand}
          skuList={ordersList[selectedBrand.id] ?? {}}
          setModalVisibility={setModalVisibility}
          setSelectedBrand={setSelectedBrand}
          handleOrdersUpdate={handleOrdersUpdate}
        />
      )}
      {reviewOrderModalVisibility && (
        <ReviewOrderModal
          beatName={beatName}
          segmentOrderData={segmentOrderData}
          outlet={outletName}
          brandsData={brandsData}
          clearOrdersList={clearOrdersList}
          setReviewOrderModalVisibility={setReviewOrderModalVisibility}
          handleCancelOrder={handleCancelOrder}
          onSubmitOrder={onSubmitOrder}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  dropdownContainerActive: {
    width: '100%',
    height: 200,
  },
  outletNameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C0156',
    padding: 20,
  },
  outletName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  brandContainer: {
    padding: 20,
    maxHeight: '100%',
  },
  brandItem: {
    padding: 15,
    backgroundColor: '#D9F5E4',
    margin: 2,
  },
  selectedBrandItem: {
    backgroundColor: '#65529A',
  },
  brandName: {
    color: '#4DA2BA',
    fontWeight: '900',
    fontSize: 20,
  },
  bottomComponentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  bottomComponentButton: {
    padding: 10,
    alignItems: 'center',
    width: '50%',
  },
  bottomComponentReview: {
    backgroundColor: '#FFA209',
  },
  bottomComponentCancel: {
    backgroundColor: '#FF0033',
  },
  cancelOrderButton: {
    height: 40,
    width: '100%',
    backgroundColor: '#FF0033',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  bottomComponentText: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  buttonIcons: {
    color: '#ffffff',
  },
});
