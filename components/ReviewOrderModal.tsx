import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShop, faStore, faCircleXmark, faArrowDown, faArrowRight, faWineBottle, faBox } from '@fortawesome/free-solid-svg-icons';
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

const ReviewOrderModal: React.FC<ReviewOrderModalProps> = ({
  beatName,
  outlet,
  segmentOrderData,
  brandsData,
  clearOrdersList,
  setReviewOrderModalVisibility,
  handleCancelOrder,
  onSubmitOrder,
}) => {
  const [finalData, setFinalData] = useState<FinalDataObject[]>([]);
  const [orderLoader, setOrderLoader] = useState<boolean>(false);

  const getBrandsForSegment = (segmentId: string): Brand[] => {
    return SegmentBrandData.find((seg) => seg.segmentId === segmentId)?.brands ?? [];
  };

  const transformOrdersList = (ordersList: SegmentOrder[]): FinalDataObject[] => {
    return ordersList.map((segment) => {
      const segmentOrders: SegmentBrandOrders = {};
      const brandOrders = segment.segmentOrders as unknown as BrandsOrdersList;

      Object.entries(brandOrders).forEach(([brandId, skus]) => {
        const brand = getBrandsForSegment(segment.segmentId).find((b) => b.id === brandId);
        if (!brand) return;
        const skusObject: { [skuKey: string]: SelectedOrderData } = {};
        Object.entries(skus).forEach(([skuKey, skuDetail]) => {
          skusObject[skuKey] = skuDetail;
        });
        segmentOrders[brandId] = { brandName: brand.name, skus: skusObject };
      });

      return { segmentId: segment.segmentId, segmentName: segment.segmentName, segmentOrders };
    });
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

  const closeModal = () => {
    setReviewOrderModalVisibility(false);
  };

  useEffect(() => {
    setFinalData(transformOrdersList(segmentOrderData));
  }, []);

  const renderItem = ({ item }: { item: FinalDataObject }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.brandName}>{item.segmentName}</Text>
      {Object.entries(item.segmentOrders).map(([brandId, brandOrders]) => (
        <View key={brandId} style={styles.skuContainer}>
          <Text style={styles.skuText}>{brandOrders.brandName}</Text>
          {Object.entries(brandOrders.skus).map(
            ([skuKey, skuDetail]) =>
              skuDetail.checked &&
              skuDetail.quantity !== '0' && (
                <View key={skuKey} style={styles.skuContainer}>
                  <Text style={styles.skuText}>
                    {skuKey}{' '}
                    <FontAwesomeIcon icon={faArrowRight} size={15} color="#007AFF" />
                    <Text style={styles.skuText}> {skuDetail.quantity} </Text>
                    {skuDetail.type === '0' ? (
                      <FontAwesomeIcon icon={faBox} size={20} color="#28A745" />
                    ) : (
                      <FontAwesomeIcon icon={faWineBottle} size={20} color="#DC3545" />
                    )}
                  </Text>
                </View>
              )
          )}
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView>
      <Modal animationType="slide" transparent style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>Confirm Order</Text>
              <Text style={styles.modalTitle}>
                <FontAwesomeIcon icon={faArrowDown} size={25} />
              </Text>
              <Text style={styles.modalTitle}>{beatName}</Text>
              <Text style={styles.modalTitle}>
                <FontAwesomeIcon icon={faShop} size={25} />{'  '}{outlet}
              </Text>
            </View>
            <FlatList
              data={finalData}
              keyExtractor={(item) => item.segmentId}
              renderItem={renderItem}
              style={{ flexGrow: 1 }}
            />
            {orderLoader ? (
              <View style={styles.loaderWrapper}>
                <Text>Order Punching in Progress</Text>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.submitButton, styles.modalButton]}
                  onPress={handleOrderPunchIn}
                >
                  <Text style={styles.buttonText}>
                    Order <FontAwesomeIcon icon={faStore} style={styles.buttonIcons} />
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.closeButton, styles.modalButton]}
                  onPress={closeModal}
                >
                  <Text style={styles.buttonText}>
                    Cancel <FontAwesomeIcon icon={faCircleXmark} style={styles.buttonIcons} />
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    padding: 16,
    marginBottom: 16,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(250, 233, 244, 0.5)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  brandName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  skuContainer: {
    marginLeft: 8,
    marginBottom: 4,
  },
  skuText: {
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    maxHeight: '80%',
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitleContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  loaderWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  modalButton: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    padding: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcons: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#00887A',
  },
  closeButton: {
    backgroundColor: '#FF0033',
  },
});

export default ReviewOrderModal;
