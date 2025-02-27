import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShoppingCart, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { Brand } from "@/app/interface/BrandSelectionScreen";
import { SelectedOrders } from "@/app/interface/Orders";
import { DropdownData } from "@/app/constants/DummyData";

type SKUModalProps = {
  selectedBrand: Brand;
  skuList : SelectedOrders | {};
  setModalVisibility : (newValue: boolean) => void;
  setSelectedBrand : ( newValue : null ) => void;
  handleOrdersUpdate : ( brandId: string, updatedSkus : SelectedOrders ) => void;
};

const SKUModal: React.FC<SKUModalProps> = ({selectedBrand, skuList, setModalVisibility, setSelectedBrand, handleOrdersUpdate}) => {
  console.log("SKUModal init skuList\t",skuList);
  const [selectedSkus, setSelectedSkus] = useState<SelectedOrders>(skuList);
  const [orderLoader, setOrderLoader] = useState<boolean>(false);

  useEffect(() => {
    console.log("useEffect selectedSkus -> ",selectedSkus);
  },[selectedSkus]);

  const handleCheckboxChange = (sku:string, checkBoxValue:boolean) => {
    console.log("checkbox value changed");
    setSelectedSkus((prev) => ({
      ...prev,
      [sku]: {
        checked: checkBoxValue,
        type: '0',
        quantity : '1'
      },
    }));
    // if(checkBoxValue){
    //   setSelectedSkus((prev) => ({
    //     ...prev,
    //     [sku]: {
    //       checked: checkBoxValue,
    //       type: '0',
    //       quantity : '1'
    //     },
    //   }));
    // }else{
    //   setSelectedSkus((prev) => ({
    //     ...prev,
    //     [sku]: {
    //       checked: checkBoxValue
    //     },
    //   }));
    // }
  };

  const handleDropdownChange = (sku:string, skuType:string| undefined) => {
    console.log("selectedSkus inside dropdown change", selectedSkus);
    console.log(sku, skuType);
    setSelectedSkus((prev) => ({
      ...prev,
      [sku]: {
        ...prev[sku],
        type:skuType
      },
    }));
    
    // setSelectedSkus((prev) => {
    //   let updatedOrder = prev;
    //   // updatedOrder[sku].type = skuType;
    //   return updatedOrder;
    // });
  };

  const handleSetQuantityChange = (sku:string, quantityValue:string) => {
    setSelectedSkus((prev) => ({
      ...prev,
      [sku]: {
        ...prev[sku],
        quantity:quantityValue
      },
    }));
  };

  const handleSKUSubmit = () => {
    console.log("selectedSkus\t",selectedSkus);
    console.log("selectedBrand\t",selectedBrand);
    console.log("skuList\t",skuList);
    setOrderLoader(true);
    handleOrdersUpdate(selectedBrand.id, selectedSkus);
    setTimeout(() => {
      setOrderLoader(false);
      closeModal();
    }, 300);
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
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>{selectedBrand.name}</Text>
          </View>
          {selectedBrand.skus.map( (skuItem:string) =>
              <View key={skuItem} style={styles.skuContainer}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    status={selectedSkus[skuItem]?.checked ? 'checked' : 'unchecked'}
                    onPress={() => handleCheckboxChange(skuItem, !selectedSkus[skuItem]?.checked)}
                  />
                  <Text key={skuItem}>{skuItem}</Text>
                </View>
                <View style={styles.skuTypeDropdownContainer}>
                  {selectedSkus[skuItem]?.checked?
                    <Dropdown
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={DropdownData}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      value={selectedSkus[skuItem].type}
                      onChange={item => {
                        handleDropdownChange(skuItem, item.value);
                    }}
                  />
                    : <></>
                  }
                </View>
                <View>
                  {selectedSkus[skuItem]?.checked?
                    <TextInput
                      style={styles.skuQuantityInputBox}
                      defaultValue={selectedSkus[skuItem].quantity}
                      // value={selectedSkus[skuItem].quantity}
                      onChangeText={(value)=>handleSetQuantityChange(skuItem, value)}
                      keyboardType="numeric"
                    />
                    : <></>
                  }
                </View>
              </View>
            )
          }
          {orderLoader?
          <View style={styles.loaderWrapper}>
            <Text>Saving Changes...</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
          :
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                  style={[styles.submitButton, styles.modalButton]}
                  onPress={handleSKUSubmit}
              >
                  <Text style={styles.buttonText}>Add <FontAwesomeIcon icon={faShoppingCart} style={styles.buttonIcons}/></Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={[styles.closeButton, styles.modalButton]}
                  onPress={closeModal}
              >
                  <Text style={styles.buttonText}>Cancel <FontAwesomeIcon icon={faCircleXmark} style={styles.buttonIcons}/></Text>
              </TouchableOpacity>
            </View>
          }
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
    flex:1,
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
  skuContainer:{
    padding: 16,
    marginBottom: 16,
    borderStyle:'dashed',
    backgroundColor: 'rgba(250, 233, 244, 0.5)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  checkboxContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    // padding:20
  },
  skuTypeDropdownContainer:{
    marginBottom:20
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#F9FAFB', // Light background for modern look
    // shadowColor: '#000', // Subtle shadow
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    // color: '#', // Medium gray for placeholder
  },
  selectedTextStyle: {
    fontSize: 16,
    // color: 'red', // Darker gray for selected text
  },
  skuQuantityInputBox: {
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB', // Light background for modern look
  },
  loaderWrapper:{
    // flex:1,
    justifyContent: 'center',
    alignItems: 'center',
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
    minWidth: 100,
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

export default SKUModal;