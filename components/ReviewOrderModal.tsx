import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faXmark,
  faLocationDot,
  faStore,
  faBox,
  faWineBottle,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { SelectedOrderData, SelectedOrders, SegmentOrder } from '@/interface/Orders';
import { SegmentBrandData } from '../constants/SegmentBrand';
import { Brand } from '../interface/BrandSelectionScreen';

type ReviewOrderModalProps = {
  outlet: string;
  beatName: string;
  segmentOrderData: SegmentOrder[];
  brandsData: Brand[];
  clearOrdersList: () => void;
  setReviewOrderModalVisibility: (newValue: boolean) => void;
  handleCancelOrder: () => void;
  onSubmitOrder: () => Promise<void>;
};

type SegmentBrandOrders = {
  [brandId: string]: {
    brandName: string;
    skus: { [skuKey: string]: SelectedOrderData };
  };
};

type FinalDataObject = {
  segmentId: string;
  segmentName: string;
  segmentOrders: SegmentBrandOrders;
};

// segmentOrders is typed as SelectedOrders in SegmentOrder but holds { [brandId]: SelectedOrders }
// at runtime. This type makes that explicit for display purposes only.
type BrandsOrdersList = { [brandId: string]: SelectedOrders };

const BG_DARK = '#0C1420';
const CARD_BG = '#162032';
const INPUT_BG = '#1E2D42';
const BRAND_GOLD = '#D4AF37';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_MUTED = '#8A9BB0';
const BORDER_COLOR = '#2A3F58';

const getBrandsForSegment = (segmentId: string): Brand[] =>
  SegmentBrandData.find((seg) => seg.segmentId === segmentId)?.brands ?? [];

const ReviewOrderModal: React.FC<ReviewOrderModalProps> = ({
  beatName,
  outlet,
  segmentOrderData,
  clearOrdersList,
  setReviewOrderModalVisibility,
  handleCancelOrder,
  onSubmitOrder,
}) => {
  const [orderLoader, setOrderLoader] = useState(false);

  const finalData = useMemo<FinalDataObject[]>(() => {
    return segmentOrderData
      .map((segment) => {
        const segmentOrders: SegmentBrandOrders = {};
        const brandOrders = segment.segmentOrders as unknown as BrandsOrdersList;

        Object.entries(brandOrders).forEach(([brandId, skus]) => {
          const brand = getBrandsForSegment(segment.segmentId).find((b) => b.id === brandId);
          if (!brand) return;
          const checkedSkus: { [skuKey: string]: SelectedOrderData } = {};
          Object.entries(skus).forEach(([skuKey, skuDetail]) => {
            if (skuDetail.checked && skuDetail.quantity !== '0') {
              checkedSkus[skuKey] = skuDetail;
            }
          });
          if (Object.keys(checkedSkus).length > 0) {
            segmentOrders[brandId] = { brandName: brand.name, skus: checkedSkus };
          }
        });

        return { segmentId: segment.segmentId, segmentName: segment.segmentName, segmentOrders };
      })
      .filter((seg) => Object.keys(seg.segmentOrders).length > 0);
  }, [segmentOrderData]);

  const totalSkus = useMemo(
    () =>
      finalData.reduce(
        (total, seg) =>
          total +
          Object.values(seg.segmentOrders).reduce(
            (t, brand) => t + Object.keys(brand.skus).length,
            0
          ),
        0
      ),
    [finalData]
  );

  const closeModal = () => {
    setReviewOrderModalVisibility(false);
  };

  const handleOrderPunchIn = async () => {
    setOrderLoader(true);
    try {
      await onSubmitOrder();
      clearOrdersList();
      closeModal();
      handleCancelOrder();
    } finally {
      setOrderLoader(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Review Order</Text>
            <Text style={styles.headerSubtitle}>
              {totalSkus} SKU{totalSkus !== 1 ? 's' : ''} ready to punch
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal} activeOpacity={0.7}>
            <FontAwesomeIcon icon={faXmark} size={17} color={TEXT_MUTED} />
          </TouchableOpacity>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <FontAwesomeIcon icon={faLocationDot} size={14} color={BRAND_GOLD} />
            <Text style={styles.routeLabel}>Beat</Text>
            <Text style={styles.routeValue} numberOfLines={1}>
              {beatName}
            </Text>
          </View>
          <View style={styles.routeDivider} />
          <View style={styles.routeRow}>
            <FontAwesomeIcon icon={faStore} size={14} color={BRAND_GOLD} />
            <Text style={styles.routeLabel}>Outlet</Text>
            <Text style={styles.routeValue} numberOfLines={1}>
              {outlet}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.orderList}
          contentContainerStyle={styles.orderListContent}
          showsVerticalScrollIndicator={false}
        >
          {finalData.map((seg) => (
            <View key={seg.segmentId} style={styles.segmentBlock}>
              <Text style={styles.segmentLabel}>{seg.segmentName}</Text>
              {Object.entries(seg.segmentOrders).map(([brandId, brandOrders]) => (
                <View key={brandId} style={styles.brandBlock}>
                  <Text style={styles.brandName}>{brandOrders.brandName}</Text>
                  {Object.entries(brandOrders.skus).map(([skuKey, skuDetail]) => (
                    <View key={skuKey} style={styles.skuRow}>
                      <FontAwesomeIcon icon={faChevronRight} size={9} color={BORDER_COLOR} />
                      <Text style={styles.skuName} numberOfLines={1}>
                        {skuKey}
                      </Text>
                      <View
                        style={[
                          styles.typeBadge,
                          skuDetail.type === '0' ? styles.typeBadgeCases : styles.typeBadgeBottles,
                        ]}
                      >
                        <FontAwesomeIcon
                          icon={skuDetail.type === '0' ? faBox : faWineBottle}
                          size={10}
                          color={TEXT_PRIMARY}
                        />
                        <Text style={styles.typeBadgeText}>
                          {skuDetail.type === '0' ? 'Cases' : 'Bottles'}
                        </Text>
                      </View>
                      <View style={styles.qtyBadge}>
                        <Text style={styles.qtyText}>×{skuDetail.quantity}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          {orderLoader ? (
            <View style={styles.loaderRow}>
              <ActivityIndicator size="small" color={BRAND_GOLD} />
              <Text style={styles.loaderText}>Punching order...</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.punchButton}
                onPress={handleOrderPunchIn}
                activeOpacity={0.85}
              >
                <Text style={styles.punchButtonText}>Punch Order</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={closeModal} activeOpacity={0.7}>
                <Text style={styles.editButtonText}>Edit Order</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_DARK,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeCard: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
    width: 44,
    fontWeight: '500',
  },
  routeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    flex: 1,
  },
  routeDivider: {
    height: 1,
    backgroundColor: BORDER_COLOR,
    marginVertical: 10,
  },
  orderList: {
    flex: 1,
  },
  orderListContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  segmentBlock: {
    marginBottom: 20,
  },
  segmentLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: BRAND_GOLD,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 2,
  },
  brandBlock: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 10,
  },
  skuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  skuName: {
    fontSize: 13,
    color: TEXT_MUTED,
    flex: 1,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeCases: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  typeBadgeBottles: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },
  qtyBadge: {
    backgroundColor: INPUT_BG,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 36,
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '700',
    color: BRAND_GOLD,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    gap: 10,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
  },
  loaderText: {
    color: TEXT_MUTED,
    fontSize: 15,
  },
  punchButton: {
    backgroundColor: BRAND_GOLD,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  punchButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: BG_DARK,
    letterSpacing: 0.3,
  },
  editButton: {
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
});

export default ReviewOrderModal;
