// BrandSelectionScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Toast from 'react-native-toast-message';
import { Brand } from "@/app/interface/BrandSelectionScreen";
import { SelectedOrders } from "@/app/interface/Orders";
import { BrandsData, OutletData } from "@/app/constants/DummyData";
import SKUModal from './SKUModal';
import ReviewOrderModal from '@/app/components/ReviewOrderModal';

type Outlet = {
  id: string;
  label: string;
};

const BrandSelectionScreen: React.FC = () => {
  const [outlet, setOutlet] = useState<Outlet>({ id: '', label: '' });

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

  const handleDropdownChange = (outletId:string, outletLabel:string) => {
    setOutlet({
      id : outletId,
      label : outletLabel
    });
    setSelectedBrand(BrandsData[4]);
  }

  const clearOrdersList = () => {
    setOrdersList({});
  }

  const isBrandSelected = (brandId:string) => {
    if (!ordersList.hasOwnProperty(brandId)) return false;
      const skus = ordersList[brandId];
      return Object.values(skus).some((sku:any) => sku.checked === true);
  };

  const handleCancelOrder = () => {
    // if (!ordersList.hasOwnProperty(brandId)) return false;
    //   const skus = ordersList[brandId];
    //   return Object.values(skus).some((sku:any) => sku.checked === true);
    setOutlet({ id: '', label: '' });
    setSelectedBrand(null);
    setModalVisibility(false);
    setReviewOrderModalVisibility(false);
    setOrdersList({});
    console.log("cancel order clicked");
  };

  // testing code start
  useEffect(() => {
    // setSelectedBrand(BrandsData[4]);
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
      {outlet.id == '' ?
      <>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={OutletData}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder='Select Outlet...'
          searchPlaceholder="Search..."
          value={outlet.id}
          onChange={item => {
            handleDropdownChange(item.value, item.label);
          }}
        />
      </>:
      <>
        <View style={styles.outletNameContainer}>
          <Text style={styles.outletName}>{outlet.label}</Text>
        </View>
        <View style={styles.cancelOrderButtonContainer}>
          <TouchableOpacity style={styles.cancelOrderButton} onPress={handleCancelOrder} >
            <Text style={styles.cancelOrderButtonText}>Cancel <FontAwesomeIcon icon={faCircleXmark} style={styles.cancelOrderButtonIcons}/></Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={BrandsData}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (isBrandSelected(item.id)?
            <TouchableOpacity
                // style={styles.brandItem}
                style={[styles.brandItem,styles.selectedBrandItem]}
                onPress={() => {
                  setSelectedBrand(item);
                  setModalVisibility(true);
                  }
                }
            >
              <Text style={styles.brandName}>{item.name}</Text>
            </TouchableOpacity>
            :
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
      </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#F9FAFB', // Light background for modern look
    shadowColor: '#000', // Subtle shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#6B7280', // Medium gray for placeholder
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 8,
    borderColor: '#D1D5DB', // Light border for search input
  },
  outletNameContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 20,
  },
  outletName:{
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Dark gray
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
  selectedBrandItem: {
    backgroundColor: 'green', // Change background color for selected brands
    // borderWidth: 2,
    // borderColor: '#007bff',
  },
  bottomComponent: {
    backgroundColor: 'lightblue', // Example styling
    padding: 10,
    alignItems: 'center'
  },
  cancelOrderButtonContainer:{
    borderColor:'black',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  cancelOrderButton:{
    borderColor:'black',
    borderRadius: 8,
    padding : 10,
  },
  cancelOrderButtonText:{
    backgroundColor : "#FF0033",
    color : "#ffffff",
    fontSize: 16,
    fontWeight: '600',
  },
  cancelOrderButtonIcons:{
    color : "#ffffff",
  }
});

export default BrandSelectionScreen;