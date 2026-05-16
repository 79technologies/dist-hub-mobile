import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShoppingCart, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { Brand } from '@/interface/BrandSelectionScreen';
import { SelectedOrders, SelectedOrderData } from '@/interface/Orders';
import { DropdownData } from '@/constants/DummyData';

type SKUModalProps = {
  selectedBrand: Brand;
  skuList: SelectedOrders;
  setModalVisibility: (newValue: boolean) => void;
  setSelectedBrand: (newValue: null) => void;
  handleOrdersUpdate: (brandId: string, updatedSkus: SelectedOrders) => void;
};

const SKUModal: React.FC<SKUModalProps> = ({
  selectedBrand,
  skuList,
  setModalVisibility,
  setSelectedBrand,
  handleOrdersUpdate,
}) => {
  const [selectedSkus, setSelectedSkus] = useState<SelectedOrders>(skuList);
  const [orderLoader, setOrderLoader] = useState<boolean>(false);

  const handleCheckboxChange = (sku: string, checked: boolean) => {
    setSelectedSkus((prev) => ({
      ...prev,
      [sku]: { checked, type: '0', quantity: '1' },
    }));
  };

  const handleDropdownChange = (sku: string, skuType: string | undefined) => {
    if (!skuType) return;
    // DropdownData only contains values '0' and '1'; the cast is safe.
    setSelectedSkus((prev) => ({
      ...prev,
      [sku]: { ...prev[sku], type: skuType as SelectedOrderData['type'] },
    }));
  };

  const handleSetQuantityChange = (sku: string, quantity: string) => {
    setSelectedSkus((prev) => ({
      ...prev,
      [sku]: { ...prev[sku], quantity },
    }));
  };

  const handleSKUSubmit = () => {
    setOrderLoader(true);
    setTimeout(() => {
      handleOrdersUpdate(selectedBrand.id, selectedSkus);
      setOrderLoader(false);
      closeModal();
    }, 800);
  };

  const closeModal = () => {
    setSelectedBrand(null);
    setModalVisibility(false);
  };

  return (
    <Modal animationType="slide" transparent style={styles.container}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>{selectedBrand.name}</Text>
          </View>
          {selectedBrand.skus.map((skuItem: string) => (
            <View key={skuItem} style={styles.skuContainer}>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={selectedSkus[skuItem]?.checked ? 'checked' : 'unchecked'}
                  onPress={() => handleCheckboxChange(skuItem, !selectedSkus[skuItem]?.checked)}
                />
                <Text>{skuItem}</Text>
              </View>
              {selectedSkus[skuItem]?.checked && (
                <View style={styles.skuTypeDropdownContainer}>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={DropdownData}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    value={selectedSkus[skuItem].type}
                    onChange={(item) => handleDropdownChange(skuItem, item.value)}
                  />
                </View>
              )}
              {selectedSkus[skuItem]?.checked && (
                <TextInput
                  style={styles.skuQuantityInputBox}
                  defaultValue={selectedSkus[skuItem].quantity}
                  onChangeText={(value) => handleSetQuantityChange(skuItem, value)}
                  keyboardType="numeric"
                />
              )}
            </View>
          ))}
          {orderLoader ? (
            <View style={styles.loaderWrapper}>
              <Text>Saving Changes...</Text>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.submitButton, styles.modalButton]}
                onPress={handleSKUSubmit}
              >
                <Text style={styles.buttonText}>
                  Add <FontAwesomeIcon icon={faShoppingCart} style={styles.buttonIcons} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ffffff',
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
  skuContainer: {
    padding: 16,
    marginBottom: 16,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(250, 233, 244, 0.5)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skuTypeDropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#F9FAFB',
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  skuQuantityInputBox: {
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
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
    minWidth: 100,
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

export default SKUModal;
