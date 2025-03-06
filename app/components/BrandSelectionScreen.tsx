import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserTie, faShop, faBan, faSearch } from '@fortawesome/free-solid-svg-icons';
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
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState(OutletData);

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

  const handleOutletSearch = (text:string) => {
    setSearch(text);
    const filtered = OutletData.filter((item) =>
      item.label.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
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
      <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownText}>Welcome Aboard! <FontAwesomeIcon icon={faUserTie} size={25} style={styles.buttonIcons}/></Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={filteredData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder='Select Outlet...'
          searchPlaceholder="Search"
          value={outlet.id}
          onChange={item => {
            handleDropdownChange(item.value, item.label);
          }}
          onChangeText={handleOutletSearch}
        />
      </View>:
      <>
        <View style={styles.outletNameContainer}>
          <FontAwesomeIcon icon={faShop} size={32} style={styles.outletName}/><Text style={styles.outletName}>{outlet.label}</Text>
        </View>
        <FlatList
          style={styles.brandContainer}
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
          <View style={styles.bottomComponentContainer}>
            <TouchableOpacity 
              style={[styles.bottomComponentReview, styles.bottomComponentButton]}
              onPress={()=>{setReviewOrderModalVisibility(true)}}
              activeOpacity={0.8} // Adjust opacity on press (optional)
            >
              <Text style={styles.bottomComponentText}>Review <FontAwesomeIcon icon={faSearch} size={20} style={styles.buttonIcons}/></Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bottomComponentCancel,styles.bottomComponentButton]} onPress={handleCancelOrder} >
              <Text style={styles.bottomComponentText}>Cancel <FontAwesomeIcon icon={faBan} size={20} style={styles.buttonIcons}/></Text>
            </TouchableOpacity>
          </View>
          : <TouchableOpacity style={styles.cancelOrderButton} onPress={handleCancelOrder} >
              <Text style={styles.bottomComponentText}>Cancel <FontAwesomeIcon icon={faBan} size={20} style={styles.buttonIcons}/></Text>
            </TouchableOpacity>
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
        {/* <View style={styles.cancelOrderButtonContainer}> */}
          
        {/* </View> */}
        { reviewOrderModalVisibility ?
          <ReviewOrderModal ordersList={ordersList} outlet={outlet} clearOrdersList={clearOrdersList} setReviewOrderModalVisibility={setReviewOrderModalVisibility} handleCancelOrder={handleCancelOrder}/> :
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
    // padding: 20,
    justifyContent: 'center',
    // alignItems: 'center',
    // maxHeight: '80%', // Limit modal height
  },
  dropdownContainer:{
    flex: 1,
    // padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // maxHeight: '80%', // Limit modal height
    backgroundColor : "#3B0B61",
  },
  dropdownText:{
    // marginBottom:100,
    color:"#FFFFFF",
    fontSize:25,
    height:50
  },
  dropdown: {
    height: 50,
    width:'80%',
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
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#2C0156",
    padding: 20,
    // borderRadius:8,
    // borderWidth: 1,
    // borderColor: '#4DA2BA',
    // borderStyle:'dashed'
  },
  outletName:{
    fontSize: 32,
    fontWeight: 'bold',
    // marginBottom: 10,
    color: '#FFFFFF',
  },
  brandContainer:{
    // flex:1,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
    maxHeight:'100%',
  },
  brandItem: {
    padding: 15,
    backgroundColor : "#D9F5E4",
    margin : 2,
  },
  selectedBrandItem: {
    backgroundColor: '#65529A', // Change background color for selected brands
    // borderWidth: 10,
    // borderColor: 'green',
  },
  brandName: {
    color:"#4DA2BA",
    fontWeight:'900',
    fontSize: 20,
  },
  bottomComponentContainer: {
    flexDirection: 'row', // Arrange children horizontally
    justifyContent: 'space-around', // Distribute space between buttons
    marginTop:10,
    // padding: 10, // Optional padding
  },
  bottomComponentButton : {
    padding: 10,
    alignItems: 'center',
    width:'50%'
  },
  bottomComponentReview: {
    backgroundColor: '#FFA209',
  },
  bottomComponentCancel: {
    backgroundColor: '#FF0033',
  },
  cancelOrderButton:{
    height:40,
    width:'100%',
    backgroundColor : "#FF0033",
    alignItems: 'center',
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
  },
  bottomComponentText:{
    color : "#ffffff",
    fontSize: 25,
    fontWeight: 'bold',
  },
  buttonIcons:{
    color : "#ffffff",
  }
});

export default BrandSelectionScreen;