import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
import { Checkbox } from 'react-native-paper';
import axios from 'axios';

type Brand = {
  id:string,
  name : string,
  skus: string[]
};

type SKUModalProps = {
    selectedBrand: Brand;
    setModalVisibility: (newValue: boolean) => void;
    setSelectedBrand : ( newValue : null ) => void;
};

// Define the type for the selected SKU data
interface SelectedSkuData {
  checked: boolean;
  type?: 'CASES' | 'BOTTLES';
  quantity?: string;
}

// Define the type for the selectedSkus state
interface SelectedSkus {
  [key: string]: SelectedSkuData;
}


const SKUModal: React.FC<SKUModalProps> = ({selectedBrand, setModalVisibility, setSelectedBrand}) => {
  const [quantity, setQuantity] = useState<string>('');
  const [selectedSkus, setSelectedSkus] = useState<SelectedSkus>({});

  // Function to handle checkbox selection
  const handleCheckboxChange = (sku:string, value:boolean) => {
    setSelectedSkus((prev) => ({
      ...prev,
      [sku]: {
        ...prev[sku],
        checked: value, // Update checkbox state
      },
    }));
  };

   // Function to handle quantity input
  //  const handleQuantityChange = (sku, value) => {
  //   setSelectedSkus((prev) => ({
  //     ...prev,
  //     [sku]: {
  //       ...prev[sku],
  //       quantity: value, // Update quantity
  //     },
  //   }));
  // };


  const handleSKUSubmit = async () => {
    if (!quantity) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.29.197:3000/orders', {
        brandId: selectedBrand.id,
        quantity: parseInt(quantity),
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Data submitted successfully!');
        closeModal();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to submit data. Please try again.');
      console.error('API Error:', err);
    }
  };

  const closeModal = () => {
    setSelectedBrand(null);
    setModalVisibility(false);
  }

  return (
    <Modal
      animationType="slide"
      transparent
      style={styles.container}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedBrand.name}</Text>
          {selectedBrand.skus.map( (skuItem:string) =>
              <View key={skuItem}>
                <View>
                  <Checkbox
                    status={selectedSkus[skuItem]?.checked ? 'checked' : 'unchecked'}
                    onPress={() => handleCheckboxChange(skuItem, !selectedSkus[skuItem]?.checked)}
                  />
                  <Text key={skuItem}>{skuItem}</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Quantity"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
              </View>
            )
          }
          <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSKUSubmit}
          >
              <Text style={styles.submitButtonText}>PUNCH-IN</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
          >
              <Text style={styles.closeButtonText}>CANCEL</Text>
          </TouchableOpacity>
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
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  submitButton : {
    padding : 10,
    backgroundColor : "green"
  },
  submitButtonText:{
    color : "#ffffff"
  },
  closeButton : {
    padding : 10,
    backgroundColor : "red"
  },
  closeButtonText : {
    color : "#ffffff"
  },
});

export default SKUModal;