import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserTie, faShop, faBan, faSearch } from '@fortawesome/free-solid-svg-icons';
import { BeatsOutletData } from "@/app/constants/BeatsOutlet";
import { BeatsOutletSegmentInterface } from '../interface/BeatsOutletSegment';
import { Brand } from "@/app/interface/BrandSelectionScreen";
import { SegmentBrandData } from "@/app/constants/SegmentBrand";
import CustomDropdown from './CustomDropdown';
import NewBrandsScreen from './NewBrandsScreen';

const BeatsOutletSegment: React.FC = () => {
    const[beatsDropdownData,setBeatsDropdownData] = useState<BeatsOutletSegmentInterface[]>([]);
    const[outletDropdownData,setOutletDropdownData] = useState<BeatsOutletSegmentInterface[]>([]);
    const[segmentDropdownData,setSegmentDropdownData] = useState<BeatsOutletSegmentInterface[]>([]);
    const[brandsData, setBrandsData]=useState<Brand[]>([]);

    const[selectedBeat,setSelectedBeat] = useState<BeatsOutletSegmentInterface|null>(null);
    const[selectedOutlet,setSelectedOutlet] = useState<BeatsOutletSegmentInterface|null>(null);
    const[selectedSegment,setSelectedSegment] = useState<BeatsOutletSegmentInterface|null>(null);

    // set initial dropdown data
    useEffect(() => {
        setTimeout(() => {
            const beatsDropdownData = BeatsOutletData.map((beat) => ({
                id: beat.beatId,
                name: beat.beatName,
            }));
            const segmentsDropdownData = SegmentBrandData.map((segment) => ({
                id: segment.segmentId,
                name: segment.segmentName,
            }));
            setBeatsDropdownData(beatsDropdownData);
            setSegmentDropdownData(segmentsDropdownData);
          }, 1500);
    }, []);

    // if selectedBeat changes
    useEffect(() => {
        // set appropriate outletDropdownData and selectedOutlet
        const foundBeat = BeatsOutletData.find((beat) => beat.beatId === selectedBeat?.id);
      
        if (!foundBeat) {
            console.log(`Beat with ID '${selectedBeat}' not found.`);
            setOutletDropdownData([]);
        }else{
            const finalOutletDropdownData = foundBeat.outlets.map((outlet) => ({
                id: outlet.outletId,
                name: outlet.outletName,
            }));
            setOutletDropdownData(finalOutletDropdownData);
        }
        setSelectedOutlet(null);
        setBrandsData([]);
    }, [selectedBeat]);

    // set brands data after segment has been selected
    useEffect(() => {
        console.log("brandsData\t",brandsData);
        if(selectedSegment){
            const finalBrandsData = SegmentBrandData.find((segmentData) => segmentData.segmentId === selectedSegment.id);
            if (!finalBrandsData) {
                console.log(`Segment with ID '${selectedSegment}' not found.`);
            }else{
                setBrandsData(finalBrandsData.brands);
            }
        }
    }, [selectedSegment]);
  return (
    <>
        {brandsData.length>0 ?
            <>
            {/* <Text>okay</Text> */}
                <NewBrandsScreen
                    selectedBeat={selectedBeat}
                    selectedOutlet={selectedOutlet}
                    selectedSegment={selectedSegment}
                    brandsData={brandsData}
                    setSelectedBeat={setSelectedBeat}
                />
            </>
            :<>
                {beatsDropdownData.length>0 ? (
                    <View style={styles.container}>
                        <Text style={styles.dropdownText}>Welcome Aboard! <FontAwesomeIcon icon={faUserTie} size={25} style={styles.buttonIcons}/></Text>
                        <View style={styles.dropdownContainerActive}>
                            <CustomDropdown
                                setSelectedDropdownProps={setSelectedBeat}
                                dropdownData={beatsDropdownData}
                                dropdownType="Beat"
                            />
                        </View>
                        {outletDropdownData.length>0?
                            <View style={styles.dropdownContainerActive}>
                                <CustomDropdown
                                    setSelectedDropdownProps={setSelectedOutlet}
                                    dropdownData={outletDropdownData}
                                    dropdownType="Outlet"
                                />
                            </View>
                            :<></>
                        }
                        {selectedOutlet?
                            <View style={styles.dropdownContainerActive}>
                                <CustomDropdown
                                    setSelectedDropdownProps={setSelectedSegment}
                                    dropdownData={segmentDropdownData}
                                    dropdownType="Segment"
                                />
                            </View>
                            :<></>
                        }
                        {selectedOutlet?
                            <Text style={styles.segmentText}>Selecting Segment will redirect to brands Screen.</Text>
                            :<></>
                        }
                    </View>
                ) : (
                    <>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={styles.loadingText}>Fetching Beats Data</Text>
                    </>
                )}
            </>
        }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : "#3B0B61",
  },
  dropdownContainerActive : {
    width : '100%',
    height:200,
    // position:'relative',
    // top:100
  },
  segmentText:{
    color : "#ffffff",
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  dropdownText:{
    // marginBottom:100,
    color:"#FFFFFF",
    fontSize:25,
    height:50
  },
  buttonIcons:{
    color : "#ffffff",
  },
  loadingText : {
    color : "#ffffff"
  }
});

export default BeatsOutletSegment;