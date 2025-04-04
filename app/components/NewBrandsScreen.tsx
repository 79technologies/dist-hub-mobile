import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserTie, faShop, faBan, faSearch } from '@fortawesome/free-solid-svg-icons';
import Toast from 'react-native-toast-message';
import { Brand } from "@/app/interface/BrandSelectionScreen";
import { BeatsOutletSegmentInterface } from '../interface/BeatsOutletSegment';
import { SelectedOrders, SegmentOrder } from "@/app/interface/Orders";
import { SegmentBrandData } from "@/app/constants/SegmentBrand";
import SKUModal from './SKUModal';
import ReviewOrderModal from '@/app/components/ReviewOrderModal';
import CustomDropdown from './CustomDropdown';

type NewBrandsScreenProps = {
  selectedBeat: BeatsOutletSegmentInterface | null;
  selectedOutlet: BeatsOutletSegmentInterface | null;
  handleBrandsCancel: () => void;
};

const newSelectedBeat = { "id": "outlet_654", "name": "Ashirwad Family Bar & Rest  Balli" }
const newSelectedOutlet = { "id": "outlet_654", "name": "Ashirwad Family Bar & Rest  Balli" }

const NewBrandsScreen: React.FC<NewBrandsScreenProps> = ({ selectedBeat, selectedOutlet, handleBrandsCancel }) => {
  // const NewBrandsScreen : React.FC = () => {

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [reviewOrderModalVisibility, setReviewOrderModalVisibility] = useState(false);
  const [ordersList, setOrdersList] = useState<SelectedOrders>({});

  const [brandsData, setBrandsData] = useState<Brand[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<BeatsOutletSegmentInterface | null>(null);
  const [segmentDropdownData, setSegmentDropdownData] = useState<BeatsOutletSegmentInterface[]>([]);
  const [segmentOrderData, setSegmentOrderData] = useState<SegmentOrder[]>([]);

  // const handleOrdersUpdate = (brandId: string, updatedSkus: SelectedOrders) => {
  //   console.log("brands selction screen, data passed as below");
  //   console.log("brandId => ",brandId,"\Updated datd -> ", updatedSkus);

  //   if(Object.keys(ordersList).length === 0){
  //     setOrdersList({[brandId] : updatedSkus});
  //   }else{
  //     setOrdersList((prevOrders) => {
  //       console.log("prevOrders\t",prevOrders);
  //       let updatedOrders = { ...prevOrders };
  //       console.log(updatedOrders[brandId]);
  //       updatedOrders[brandId] = updatedSkus
  //       return updatedOrders;
  //     });
  //   }
  // };

  const handleOrdersUpdate = (brandId: string, updatedSkus: SelectedOrders) => {
    console.log("brands selection screen, data passed as below");
    console.log("segmentId => ", selectedSegment?.id, "brandId => ", brandId, "\Updated data -> ", updatedSkus);

    setSegmentOrderData((prevSegments) => {
      return prevSegments.map((segment) => {
        if (segment.segmentId === selectedSegment?.id) {
          // Update the segmentOrders within the matching segment
          return {
            ...segment,
            segmentOrders: {
              ...segment.segmentOrders,
              [brandId]: updatedSkus,
            },
          };
        }
        return segment; // Return unchanged segment
      });
    });
    // setOrdersList();
    if (Object.keys(ordersList).length === 0) {
      setOrdersList({ [brandId]: updatedSkus });
    } else {
      setOrdersList((prevOrders) => {
        console.log("prevOrders\t", prevOrders);
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

  const isBrandSelected = (brandId: string) => {
    if (!ordersList.hasOwnProperty(brandId)) return false;
    const skus = ordersList[brandId];
    return Object.values(skus).some((sku: any) => sku.checked === true);
  };

  const handleCancelOrder = () => {
    setSelectedBrand(null);
    setModalVisibility(false);
    setReviewOrderModalVisibility(false);
    setOrdersList({});
    handleBrandsCancel();
    console.log("cancel order clicked");
  };

  useEffect(() => {
    const segmentsDropdownData = SegmentBrandData.map((segment) => ({
      id: segment.segmentId,
      name: segment.segmentName,
    }));
    setSegmentDropdownData(segmentsDropdownData);

    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋'
    });
  }, []);

  useEffect(() => {
    // console.log("", segmentOrderData);
    console.log("%%%%%%%%%%%%% segmentOrderData changed\t", JSON.stringify(segmentOrderData, null, 2));
  }, [segmentOrderData]);

  useEffect(() => {
    console.log("useEffect ordersList\t", ordersList);
  }, [ordersList]);

  // set brands data after segment has been selected
  // set segmentOrderData as well
  // useEffect(() => {
  //   if(selectedSegment){
  //     const finalBrandsData = SegmentBrandData.find((segmentData) => segmentData.segmentId === selectedSegment.id);
  //     if (!finalBrandsData) {
  //       console.log(`Segment with ID '${selectedSegment}' not found.`);
  //     }else{
  //       setBrandsData(finalBrandsData.brands);

  //       setSegmentOrderData((prevSegments) => {
  //         const segmentExists = prevSegments.some(seg => seg.segmentId === selectedSegment.id);
  //         if (segmentExists) {
  //           return prevSegments.map(seg =>
  //             seg.segmentId === selectedSegment.id
  //               ? { ...seg, segmentOrders: ordersList }
  //               : seg
  //           );
  //         } else {
  //           return [...prevSegments, {
  //             segmentId: selectedSegment.id,
  //             segmentName: selectedSegment.name,
  //             segmentOrders: ordersList,
  //           }];
  //         }
  //       });


  //       // console.log("############ segmentOrderData\t",segmentOrderData);
  //       // const currSegmentState = segmentOrderData;

  //       // let segmentFound : any = null;
  //       // currSegmentState.forEach(segment => {
  //       //     if(segment.segmentId === selectedSegment.id){
  //       //       console.log("$$$$$ segment\t",segment);
  //       //       segmentFound = segment;
  //       //     }
  //       //   });

  //       //   if(segmentFound){
  //       //     console.log("segmentFound/t",segmentFound);
  //       //     setSegmentOrderData((currSegmentState) => ({
  //       //       ...currSegmentState,
  //       //       [segmentId]: {
  //       //         segmentId : selectedSegment.id,
  //       //         segmentName : selectedSegment.name,
  //       //         segmentOrders : ordersList
  //       //       },
  //       //     }));
  //       //   }else{
  //       //     let temp = segmentOrderData;
  //       //     temp.push({
  //       //       segmentId : selectedSegment.id,
  //       //       segmentName : selectedSegment.name,
  //       //       segmentOrders : {}
  //       //     });
  //       //     setSegmentOrderData(temp);
  //       //   }
  //       // }
  //     }
  //   }
  // }, [selectedSegment, ordersList]);

  useEffect(() => {
    if (selectedSegment) {
      const finalBrandsData = SegmentBrandData.find((segmentData) => segmentData.segmentId === selectedSegment.id);
      if (!finalBrandsData) {
        console.log(`Segment with ID '${selectedSegment.id}' not found.`);
        setBrandsData([]);
      } else {
        setBrandsData(finalBrandsData.brands);
        setSegmentOrderData((prevSegments) => {
          const segmentIndex = prevSegments.findIndex(seg => seg.segmentId === selectedSegment.id);

          if (segmentIndex === -1) {
            // Segment does not exist, add it
            return [...prevSegments, {
              segmentId: selectedSegment.id,
              segmentName: selectedSegment.name,
              segmentOrders: {}, // Initialize with empty segmentOrders
            }];
          } else {
            return prevSegments; // If segment exists, do not update
          }
        });
      }
    } else {
      setBrandsData([]);
    }
  }, [selectedSegment]);


  return (
    <View style={styles.container}>
      <View style={styles.outletNameContainer}>
        <FontAwesomeIcon icon={faShop} size={32} style={styles.outletName} /><Text style={styles.outletName}>{selectedOutlet?.name}</Text>
      </View>
      {selectedOutlet ?
        // {newSelectedOutlet?
        <View style={styles.dropdownContainerActive}>
          <CustomDropdown
            setSelectedDropdownProps={setSelectedSegment}
            dropdownData={segmentDropdownData}
            dropdownType="Segment"
          />
        </View>
        : <></>
      }
      <FlatList
        style={styles.brandContainer}
        data={brandsData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (isBrandSelected(item.id) ?
          <TouchableOpacity
            // style={styles.brandItem}
            style={[styles.brandItem, styles.selectedBrandItem]}
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
            }}
          >
            <Text style={styles.brandName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {Object.keys(ordersList).length > 0 ?
        <View style={styles.bottomComponentContainer}>
          <TouchableOpacity
            style={[styles.bottomComponentReview, styles.bottomComponentButton]}
            onPress={() => { setReviewOrderModalVisibility(true) }}
            activeOpacity={0.8} // Adjust opacity on press (optional)
          >
            <Text style={styles.bottomComponentText}>Review <FontAwesomeIcon icon={faSearch} size={20} style={styles.buttonIcons} /></Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bottomComponentCancel, styles.bottomComponentButton]} onPress={handleCancelOrder} >
            <Text style={styles.bottomComponentText}>Cancel <FontAwesomeIcon icon={faBan} size={20} style={styles.buttonIcons} /></Text>
          </TouchableOpacity>
        </View>
        : <TouchableOpacity style={styles.cancelOrderButton} onPress={handleCancelOrder} >
          <Text style={styles.bottomComponentText}>Cancel <FontAwesomeIcon icon={faBan} size={20} style={styles.buttonIcons} /></Text>
        </TouchableOpacity>
      }
      {modalVisibility && selectedBrand ?
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
      {reviewOrderModalVisibility ?
        <ReviewOrderModal
          beatName={selectedBeat?.name}
          segmentOrderData={segmentOrderData}
          // outlet={selectedOutlet?.name}
          outlet={selectedOutlet?.name}
          brandsData={brandsData}
          // brandsData={finalBrandsData.brands}
          clearOrdersList={clearOrdersList}
          setReviewOrderModalVisibility={setReviewOrderModalVisibility}
          handleCancelOrder={handleCancelOrder}
        /> :
        <></>
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
  dropdownContainer: {
    flex: 1,
    // padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // maxHeight: '80%', // Limit modal height
    backgroundColor: "#3B0B61",
  },
  dropdownContainerActive: {
    width: '100%',
    height: 200,
    // position:'relative',
    // top:100
  },
  dropdownText: {
    // marginBottom:100,
    color: "#FFFFFF",
    fontSize: 25,
    height: 50
  },
  dropdown: {
    height: 50,
    width: '80%',
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
  outletNameContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#2C0156",
    padding: 20,
    // borderRadius:8,
    // borderWidth: 1,
    // borderColor: '#4DA2BA',
    // borderStyle:'dashed'
  },
  outletName: {
    fontSize: 32,
    fontWeight: 'bold',
    // marginBottom: 10,
    color: '#FFFFFF',
  },
  brandContainer: {
    // flex:1,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
    maxHeight: '100%',
  },
  brandItem: {
    padding: 15,
    backgroundColor: "#D9F5E4",
    margin: 2,
  },
  selectedBrandItem: {
    backgroundColor: '#65529A', // Change background color for selected brands
    // borderWidth: 10,
    // borderColor: 'green',
  },
  brandName: {
    color: "#4DA2BA",
    fontWeight: '900',
    fontSize: 20,
  },
  bottomComponentContainer: {
    flexDirection: 'row', // Arrange children horizontally
    justifyContent: 'space-around', // Distribute space between buttons
    marginTop: 10,
    // padding: 10, // Optional padding
  },
  bottomComponentButton: {
    padding: 10,
    alignItems: 'center',
    width: '50%'
  },
  bottomComponentReview: {
    backgroundColor: '#FFA209',
  },
  bottomComponentCancel: {
    backgroundColor: '#FF0033',
  },
  cancelOrderButton: {
    height: 40,
    width: '100%',
    backgroundColor: "#FF0033",
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  bottomComponentText: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: 'bold',
  },
  buttonIcons: {
    color: "#ffffff",
  }
});

export default NewBrandsScreen;