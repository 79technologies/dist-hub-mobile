import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
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
    handleOrdersUpdate(selectedBrand.id, selectedSkus);
    closeModal();
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
                <View>
                  {selectedSkus[skuItem]?.checked?
                    <Dropdown
                      // style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                      // placeholderStyle={styles.placeholderStyle}
                      // selectedTextStyle={styles.selectedTextStyle}
                      // inputSearchStyle={styles.inputSearchStyle}
                      // iconStyle={styles.iconStyle}
                      data={DropdownData}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      searchPlaceholder="Search..."
                      value={selectedSkus[skuItem].type}
                      // onFocus={() => setIsFocus(true)}
                      // onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        handleDropdownChange(skuItem, item.value);
                        // setValue(item.value);
                        // setIsFocus(false);
                    }}
                  />
                    : <></>
                  }
                </View>
                <View>
                  {selectedSkus[skuItem]?.checked?
                    <TextInput
                      style={styles.input}
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

export default SKUModal;