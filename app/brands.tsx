import React, { useEffect, useState, useCallback, useContext, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Brand } from '@/interface/BrandSelectionScreen';
import { BeatsOutletSegmentInterface } from '@/interface/BeatsOutletSegment';
import { SelectedOrders, SegmentOrder } from '@/interface/Orders';
import { getSegments, getBrandsBySegment } from '@/db/queries/segments';
import { saveOrder } from '@/db/queries/orders';
import { FinalOrderContext } from '@/contexts/FinalOrderContext';
import SKUModal from '@/components/SKUModal';
import ReviewOrderModal from '@/components/ReviewOrderModal';

type BrandsOrdersList = { [brandId: string]: SelectedOrders };

const BG_DARK = '#0C1420';
const CARD_BG = '#162032';
const INPUT_BG = '#1E2D42';
const BRAND_GOLD = '#D4AF37';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_MUTED = '#8A9BB0';
const BORDER_COLOR = '#2A3F58';
const SUCCESS = '#10B981';

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
            // segmentOrders is typed as SelectedOrders but holds BrandsOrdersList at runtime
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

  const getBrandSkuCount = useCallback(
    (brandId: string) => {
      if (!(brandId in ordersList)) return 0;
      return Object.values(ordersList[brandId]).filter((sku) => sku.checked).length;
    },
    [ordersList]
  );

  const getSegmentItemCount = useCallback(
    (segmentId: string) => {
      const seg = segmentOrderData.find((s) => s.segmentId === segmentId);
      if (!seg) return 0;
      const brandsOrders = seg.segmentOrders as unknown as BrandsOrdersList;
      return Object.values(brandsOrders).reduce(
        (total, skus) => total + Object.values(skus).filter((sku) => sku.checked).length,
        0
      );
    },
    [segmentOrderData]
  );

  const totalBrandsSelected = useMemo(
    () =>
      Object.values(ordersList).filter((skus) =>
        Object.values(skus).some((sku) => sku.checked)
      ).length,
    [ordersList]
  );

  const handleCancelOrder = useCallback(() => {
    router.replace('/beats-outlet');
  }, [router]);

  const onSubmitOrder = useCallback(async () => {
    const orderId = await saveOrder(db, {
      beatId,
      beatName,
      outletId,
      outletName,
      segmentOrderData,
    });
    setFinalOrderData({
      orderId,
      beatId,
      beatName,
      outletId,
      outletName,
      submittedAt: new Date().toISOString(),
    });
  }, [db, beatId, beatName, outletId, outletName, segmentOrderData, setFinalOrderData]);

  const handleBrandPress = useCallback((brand: Brand) => {
    setSelectedBrand(brand);
    setModalVisibility(true);
  }, []);

  const renderBrandItem = useCallback(
    ({ item }: { item: Brand }) => {
      const selected = isBrandSelected(item.id);
      const count = getBrandSkuCount(item.id);
      return (
        <TouchableOpacity
          style={[styles.brandCard, selected && styles.brandCardSelected]}
          onPress={() => handleBrandPress(item)}
          activeOpacity={0.75}
        >
          {selected && (
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>{count}</Text>
            </View>
          )}
          <Text
            style={[styles.brandName, selected && styles.brandNameSelected]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [isBrandSelected, getBrandSkuCount, handleBrandPress]
  );

  const renderSegmentPill = useCallback(
    ({ item }: { item: BeatsOutletSegmentInterface }) => {
      const isActive = selectedSegment?.id === item.id;
      const count = getSegmentItemCount(item.id);
      return (
        <TouchableOpacity
          style={[styles.segmentPill, isActive && styles.segmentPillActive]}
          onPress={() => setSelectedSegment(item)}
          activeOpacity={0.75}
        >
          <Text style={[styles.segmentPillText, isActive && styles.segmentPillTextActive]}>
            {item.name}
          </Text>
          {count > 0 && (
            <View style={[styles.segmentBadge, isActive && styles.segmentBadgeActive]}>
              <Text style={styles.segmentBadgeText}>{count}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [selectedSegment, getSegmentItemCount]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancelOrder} activeOpacity={0.7}>
          <FontAwesomeIcon icon={faChevronLeft} size={16} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerOutlet} numberOfLines={1}>
            {outletName}
          </Text>
          <Text style={styles.headerBeat} numberOfLines={1}>
            {beatName}
          </Text>
        </View>
      </View>

      <View style={styles.segmentSection}>
        <FlatList
          horizontal
          data={segmentDropdownData}
          keyExtractor={(item) => item.id}
          renderItem={renderSegmentPill}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.segmentPillsContainer}
        />
      </View>

      {!selectedSegment ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Choose a Segment</Text>
          <Text style={styles.emptyStateSubtitle}>
            Select a segment above to view available brands
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.brandGrid}
          contentContainerStyle={styles.brandGridContent}
          data={brandsData}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderBrandItem}
        />
      )}

      <View style={styles.bottomBar}>
        {totalBrandsSelected > 0 ? (
          <>
            <View style={styles.bottomBarInfo}>
              <View style={styles.bottomBarBadge}>
                <Text style={styles.bottomBarBadgeText}>{totalBrandsSelected}</Text>
              </View>
              <Text style={styles.bottomBarInfoText}>
                brand{totalBrandsSelected !== 1 ? 's' : ''} selected
              </Text>
            </View>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => setReviewOrderModalVisibility(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.reviewButtonText}>Review Order</Text>
              <FontAwesomeIcon icon={faChevronRight} size={13} color={BG_DARK} />
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.bottomBarEmptyText}>Select brands to start your order</Text>
        )}
      </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_DARK,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerOutlet: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  headerBeat: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 1,
  },
  segmentSection: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  segmentPillsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
  },
  segmentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginRight: 8,
  },
  segmentPillActive: {
    backgroundColor: BRAND_GOLD,
    borderColor: BRAND_GOLD,
  },
  segmentPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: TEXT_MUTED,
  },
  segmentPillTextActive: {
    color: BG_DARK,
    fontWeight: '700',
  },
  segmentBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: SUCCESS,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  segmentBadgeActive: {
    backgroundColor: BG_DARK,
  },
  segmentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 22,
  },
  brandGrid: {
    flex: 1,
  },
  brandGridContent: {
    padding: 10,
  },
  brandCard: {
    flex: 1,
    margin: 5,
    padding: 16,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    minHeight: 88,
    justifyContent: 'flex-end',
  },
  brandCardSelected: {
    borderColor: BRAND_GOLD,
    backgroundColor: INPUT_BG,
  },
  brandBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: BRAND_GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  brandBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: BG_DARK,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_MUTED,
    lineHeight: 20,
  },
  brandNameSelected: {
    color: BRAND_GOLD,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: CARD_BG,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  bottomBarInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bottomBarBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: SUCCESS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBarBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  bottomBarInfoText: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BRAND_GOLD,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: BG_DARK,
  },
  bottomBarEmptyText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: TEXT_MUTED,
  },
});
