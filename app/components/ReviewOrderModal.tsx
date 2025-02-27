import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStore, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { SelectedOrderData, SelectedOrders } from "@/app/interface/Orders";
import { BrandsData } from "@/app/constants/DummyData";

type ReviewOrderModal = {
  ordersList : SelectedOrders;
  clearOrdersList : () => void;
  setReviewOrderModalVisibility : (newValue: boolean) => void;
};

type FinalDataObject = {
  brandId : string;
  brandName : string;
  skus:SelectedOrderData[];
}

const ReviewOrderModal: React.FC<ReviewOrderModal> = ({ordersList, clearOrdersList, setReviewOrderModalVisibility}) => {
  const [finalData, setFinalData] = useState<FinalDataObject[]>([]);
  
  const transformOrdersList = (ordersList : SelectedOrders,) => {
    return Object.entries(ordersList).map(([brandId, skus]) => {
      const brand = BrandsData.find((b) => b.id === brandId);
      const selectedSkus: SelectedOrderData[] = Object.entries(skus).map(([sku, details]) => ({
          checked: details.checked,
          type: details.type,
          quantity: details.quantity,
      }));

      return {
          brandId,
          brandName: brand?.name || 'Unknown Brand',
          skus: selectedSkus,
      };
    });
};

  const handleSKUSubmit = () => {
    clearOrdersList();
    closeModal();
  };

  const closeModal = () => {
    setReviewOrderModalVisibility(false);
  }

  useEffect(() => {
    const finalData = transformOrdersList(ordersList);
    // console.log(finalData);
    console.log(JSON.stringify(finalData, null, 2));
    // console.log(Object.keys(finalData["0"].skus["250ml"]));
    setFinalData(finalData);
  }, []);

  const renderItem = ({ item }: { item: FinalDataObject }) => {
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.brandName}>{item.brandName}</Text>
            {item.skus.map((skuDetail, index) => (
                <View key={index} style={styles.skuContainer}>
                    <Text style={styles.skuText}>
                        Checked: {skuDetail.checked ? 'Yes' : 'No'}, Type: {skuDetail.type}, Quantity: {skuDetail.quantity || 'N/A'}
                    </Text>
                </View>
            ))}
        </View>
      );
    };

  return (
    <Modal
      animationType="slide"
      transparent
      style={styles.container}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>Your Order</Text>
          </View>
          <FlatList
            data={finalData}
            keyExtractor={(item) => item.brandId}
            renderItem={renderItem}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
                style={[styles.submitButton, styles.modalButton]}
                onPress={handleSKUSubmit}
            >
                <Text style={styles.buttonText}>Order <FontAwesomeIcon icon={faStore} style={styles.buttonIcons}/></Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.closeButton, styles.modalButton]}
                onPress={closeModal}
            >
                <Text style={styles.buttonText}>Cancel <FontAwesomeIcon icon={faCircleXmark} style={styles.buttonIcons}/></Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
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
      fontSize: 14,
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
  modalTitleContainer : {
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonsContainer:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  modalButton:{
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    padding : 10,
  },
  buttonText:{
    color : "#ffffff",
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcons:{
    color : "#ffffff",
  },
  submitButton : {
    backgroundColor : "#00887A"
  },
  closeButton : {
    backgroundColor : "#FF0033"
  }
});

export default ReviewOrderModal;