import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faXmark,
  faBox,
  faWineBottle,
  faPlus,
  faMinus,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { Brand } from '@/interface/BrandSelectionScreen';
import { SelectedOrders, SelectedOrderData } from '@/interface/Orders';

type SKUModalProps = {
  selectedBrand: Brand;
  skuList: SelectedOrders;
  setModalVisibility: (newValue: boolean) => void;
  setSelectedBrand: (newValue: null) => void;
  handleOrdersUpdate: (brandId: string, updatedSkus: SelectedOrders) => void;
};

const BG_DARK = '#0C1420';
const CARD_BG = '#162032';
const INPUT_BG = '#1E2D42';
const BRAND_GOLD = '#D4AF37';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_MUTED = '#8A9BB0';
const BORDER_COLOR = '#2A3F58';

const SKUModal: React.FC<SKUModalProps> = ({
  selectedBrand,
  skuList,
  setModalVisibility,
  setSelectedBrand,
  handleOrdersUpdate,
}) => {
  const [selectedSkus, setSelectedSkus] = useState<SelectedOrders>(skuList);
  const [orderLoader, setOrderLoader] = useState(false);

  const toggleSku = useCallback((sku: string) => {
    setSelectedSkus((prev) => {
      const current = prev[sku];
      if (current?.checked) {
        return { ...prev, [sku]: { ...current, checked: false } };
      }
      return { ...prev, [sku]: { checked: true, type: '0', quantity: '1' } };
    });
  }, []);

  const setType = useCallback((sku: string, type: SelectedOrderData['type']) => {
    setSelectedSkus((prev) => ({
      ...prev,
      [sku]: { ...prev[sku], type },
    }));
  }, []);

  const adjustQuantity = useCallback((sku: string, delta: number) => {
    setSelectedSkus((prev) => {
      const current = prev[sku];
      const newQty = Math.max(1, parseInt(current.quantity || '1', 10) + delta);
      return { ...prev, [sku]: { ...current, quantity: String(newQty) } };
    });
  }, []);

  const closeModal = useCallback(() => {
    setSelectedBrand(null);
    setModalVisibility(false);
  }, [setSelectedBrand, setModalVisibility]);

  const handleSKUSubmit = useCallback(() => {
    setOrderLoader(true);
    setTimeout(() => {
      handleOrdersUpdate(selectedBrand.id, selectedSkus);
      setOrderLoader(false);
      setSelectedBrand(null);
      setModalVisibility(false);
    }, 600);
  }, [selectedSkus, selectedBrand.id, handleOrdersUpdate, setSelectedBrand, setModalVisibility]);

  const checkedCount = Object.values(selectedSkus).filter((s) => s.checked).length;

  return (
    <Modal animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.sheetHeader}>
          <View>
            <Text style={styles.brandName}>{selectedBrand.name}</Text>
            <Text style={styles.skuCountText}>{selectedBrand.skus.length} SKUs available</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal} activeOpacity={0.7}>
            <FontAwesomeIcon icon={faXmark} size={17} color={TEXT_MUTED} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.skuScroll}
          contentContainerStyle={styles.skuScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {selectedBrand.skus.map((skuItem) => {
            const skuData = selectedSkus[skuItem];
            const isChecked = skuData?.checked ?? false;
            return (
              <View key={skuItem} style={[styles.skuRow, isChecked && styles.skuRowActive]}>
                <TouchableOpacity
                  style={styles.skuRowHeader}
                  onPress={() => toggleSku(skuItem)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                    {isChecked && <FontAwesomeIcon icon={faCheck} size={10} color={BG_DARK} />}
                  </View>
                  <Text style={[styles.skuName, isChecked && styles.skuNameActive]}>
                    {skuItem}
                  </Text>
                </TouchableOpacity>

                {isChecked && (
                  <View style={styles.skuControls}>
                    <View style={styles.typeToggle}>
                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          skuData.type === '0' && styles.typeButtonActive,
                        ]}
                        onPress={() => setType(skuItem, '0')}
                        activeOpacity={0.7}
                      >
                        <FontAwesomeIcon
                          icon={faBox}
                          size={11}
                          color={skuData.type === '0' ? BG_DARK : TEXT_MUTED}
                        />
                        <Text
                          style={[
                            styles.typeButtonText,
                            skuData.type === '0' && styles.typeButtonTextActive,
                          ]}
                        >
                          Cases
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          skuData.type === '1' && styles.typeButtonActive,
                        ]}
                        onPress={() => setType(skuItem, '1')}
                        activeOpacity={0.7}
                      >
                        <FontAwesomeIcon
                          icon={faWineBottle}
                          size={11}
                          color={skuData.type === '1' ? BG_DARK : TEXT_MUTED}
                        />
                        <Text
                          style={[
                            styles.typeButtonText,
                            skuData.type === '1' && styles.typeButtonTextActive,
                          ]}
                        >
                          Bottles
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.stepper}>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => adjustQuantity(skuItem, -1)}
                        activeOpacity={0.7}
                      >
                        <FontAwesomeIcon icon={faMinus} size={11} color={TEXT_PRIMARY} />
                      </TouchableOpacity>
                      <Text style={styles.stepperValue}>{skuData.quantity}</Text>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => adjustQuantity(skuItem, 1)}
                        activeOpacity={0.7}
                      >
                        <FontAwesomeIcon icon={faPlus} size={11} color={TEXT_PRIMARY} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          {orderLoader ? (
            <View style={styles.loaderRow}>
              <ActivityIndicator size="small" color={BRAND_GOLD} />
              <Text style={styles.loaderText}>Saving...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.addButton, checkedCount === 0 && styles.addButtonDisabled]}
              onPress={handleSKUSubmit}
              disabled={checkedCount === 0}
              activeOpacity={0.85}
            >
              <Text style={styles.addButtonText}>
                {checkedCount > 0
                  ? `Add ${checkedCount} SKU${checkedCount !== 1 ? 's' : ''} to Order`
                  : 'Select SKUs above'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CARD_BG,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER_COLOR,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  skuCountText: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: INPUT_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skuScroll: {
    flex: 1,
  },
  skuScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  skuRow: {
    backgroundColor: INPUT_BG,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    overflow: 'hidden',
  },
  skuRowActive: {
    borderColor: BRAND_GOLD,
  },
  skuRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CARD_BG,
  },
  checkboxChecked: {
    backgroundColor: BRAND_GOLD,
    borderColor: BRAND_GOLD,
  },
  skuName: {
    fontSize: 15,
    fontWeight: '500',
    color: TEXT_MUTED,
    flex: 1,
  },
  skuNameActive: {
    color: TEXT_PRIMARY,
  },
  skuControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
  },
  typeToggle: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 8,
    padding: 3,
    gap: 3,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: BRAND_GOLD,
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
  typeButtonTextActive: {
    color: BG_DARK,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 8,
    overflow: 'hidden',
  },
  stepperBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: INPUT_BG,
  },
  stepperValue: {
    minWidth: 36,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
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
  addButton: {
    backgroundColor: BRAND_GOLD,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.35,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: BG_DARK,
    letterSpacing: 0.2,
  },
});

export default SKUModal;
