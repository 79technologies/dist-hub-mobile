// BrandSelectionScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { Brand } from "@/app/interface/BrandSelectionScreen";
import { SelectedOrders } from "@/app/interface/Orders";
import { BrandsData } from "@/app/constants/DummyData";
import SKUModal from './SKUModal';
import ReviewOrderModal from '@/app/components/ReviewOrderModal';

const BrandSelectionScreen: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [reviewOrderModalVisibility, setReviewOrderModalVisibility] = useState(false);
  const [ordersList, setOrdersList] = useState<SelectedOrders>({});

  const handleOrdersUpdate = (brandId: string, updatedSkus: SelectedOrders) => {
    console.log("brands selction screen, data passed as below");
    console.log("brandId => ",brandId,"\Updated datd -> ", updatedSkus);

    if(Object.keys(ordersList).length === 0){
      setOrdersList({[brandId] : updatedSkus});
    }else{
      setOrdersList((prevOrders) => {
        console.log("prevOrders\t",prevOrders);
        let updatedOrders = { ...prevOrders };
        console.log(updatedOrders[brandId]);
        updatedOrders[brandId] = updatedSkus
        return updatedOrders;
      });
    }
  };

  const clearOrdersList = () => {
    setOrdersList({});
  }

  // testing code start
  useEffect(() => {
    console.log("BrandSelectionScreen useEffect ordersList\t",ordersList);
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋'
    });
  }, [ordersList]);
  // testing code end

  return (
    <View style={styles.container}>
      <FlatList
        data={BrandsData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
              style={styles.brandItem}
              onPress={() => {
                 setSelectedBrand(item);
                 setModalVisibility(true);
                }
              }
          >
            <Text style={styles.brandName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {Object.keys(ordersList).length > 0 ?
        <TouchableOpacity 
          style={styles.bottomComponent}
          onPress={()=>{setReviewOrderModalVisibility(true)}}
          activeOpacity={0.8} // Adjust opacity on press (optional)
        >
          <Text>Review Order</Text>
        </TouchableOpacity>
        :<></>
      }
      { modalVisibility && selectedBrand ?
        <SKUModal
          selectedBrand={selectedBrand}
          skuList={ordersList[selectedBrand?.id] || {}}
          // skuList={ Object.keys(ordersList).length == 0 ? {} : ordersList.selectedBrand.sku }
          setModalVisibility={setModalVisibility}
          setSelectedBrand={setSelectedBrand}
          handleOrdersUpdate={handleOrdersUpdate}
        /> :
        <></>
      }
      { reviewOrderModalVisibility ?
        <ReviewOrderModal ordersList={ordersList} clearOrdersList={clearOrdersList} setReviewOrderModalVisibility={setReviewOrderModalVisibility}/> :
        <></>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  brandItem: {
    padding: 15,
    backgroundColor : "maroon",
    margin : 2,
    borderBottomColor: '#ccc',
  },
  selectedItem: {
    backgroundColor: '#e0f2f7', // Highlight selected items
  },
  brandName: {
    color:"#ffffff",
    fontSize: 18,
  },
  bottomComponent: {
    position: 'absolute',
    bottom: 0, // Sticks to the bottom
    left: 0,
    right: 0, // Stretches to the full width
    backgroundColor: 'lightblue', // Example styling
    padding: 10,
    alignItems: 'center'
  }
});

export default BrandSelectionScreen;