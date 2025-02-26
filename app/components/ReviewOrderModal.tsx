import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { SelectedOrders } from "@/app/interface/Orders";

type ReviewOrderModal = {
  ordersList : SelectedOrders;
  clearOrdersList : () => void;
  setReviewOrderModalVisibility : (newValue: boolean) => void;
};

const ReviewOrderModal: React.FC<ReviewOrderModal> = ({ordersList, clearOrdersList, setReviewOrderModalVisibility}) => {
  const handleSKUSubmit = () => {
    clearOrdersList();
    closeModal();
  };

  const closeModal = () => {
    setReviewOrderModalVisibility(false);
  }

  return (
    <Modal
      animationType="slide"
      transparent
      style={styles.container}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Your Order</Text>
          {/* <FlatList
            data={ordersList}
            keyExtractor={(item) => item.}
            renderItem={({ item: brand }) => (
              <View style={styles.brandContainer}>
                <Text style={styles.brandName}>{brand.name}</Text>
                {Object.keys(brand.skus).map((skuName) => {
                  const sku = brand.skus[skuName];
                  return (
                    <View key={skuName} style={styles.skuContainer}>
                      <Text style={styles.skuName}>{skuName}</Text>
                      <Text style={styles.skuDetails}>
                        Type: {sku.type}, Quantity: {sku.quantity}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          /> */}
          <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSKUSubmit}
          >
              <Text style={styles.submitButtonText}>ADD Items</Text>
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

export default ReviewOrderModal;