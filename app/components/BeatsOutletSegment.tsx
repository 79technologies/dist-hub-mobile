import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserTie, faShop, faBan, faSearch } from '@fortawesome/free-solid-svg-icons';
import { BeatsData } from "@/app/constants/DummyData";
import { BeatsOutletSegmentInterface } from '../interface/BeatsOutletSegment';
import CustomDropdown from './CustomDropdown';
import NewBrandsScreen from './NewBrandsScreen';

const BeatsOutletSegment: React.FC = () => {
    const[beatsDropdownData,setBeatsDropdownData] = useState<BeatsOutletSegmentInterface[]>([]);
    const[outletDropdownData,setOutletDropdownData] = useState<BeatsOutletSegmentInterface[]>([]);
    const[segmentDropdownData,setSegmentDropdownData] = useState<BeatsOutletSegmentInterface[]>([]);

    const[selectedBeat,setSelectedBeat] = useState<string>('');
    const[selectedOutlet,setSelectedOutlet] = useState<string>('');
    const[selectedSegment,setSelectedSegment] = useState<string>('');

    const getBeatsDropdownData = () => {
        return BeatsData.map((beat) => ({
            id: beat.beatId,
            name: beat.beatName,
        }));
    }

    // set initial dropdown data
    useEffect(() => {
        setTimeout(() => {
            const beatsDropdownData = getBeatsDropdownData();
            setBeatsDropdownData(beatsDropdownData);
          }, 1500);
    }, []);

    // if selectedBeat changes
    useEffect(() => {
        // set appropriate outletDropdownData and selectedOutlet
        const foundBeat = BeatsData.find((beat) => beat.beatId === selectedBeat);
      
        if (!foundBeat) {
            console.log(`Beat with ID '${selectedBeat}' not found.`);
            setOutletDropdownData([]);
            setSelectedOutlet('');
        }else{
            const finalOutletDropdownData = foundBeat.outlets.map((outlet) => ({
                id: outlet.outletId,
                name: outlet.outletName,
            }));
            setOutletDropdownData(finalOutletDropdownData);
            setSelectedOutlet('');
        }

        // reset segmentDropdownData & selectedSegment
        setSegmentDropdownData([]);
        setSelectedSegment('');
    }, [selectedBeat]);

    // if selectedOutlet changes
    useEffect(() => {
        // set appropriate segmentDropdownData
        const foundBeat : any = BeatsData.find((beat) => beat.beatId === selectedBeat);
        if (!foundBeat) {
            console.log("Beat not found.");
        }else{
            const foundOutlet : any = foundBeat.outlets.find((outlet) => outlet.outletId === selectedOutlet);
            console.log("foundOutlet/t",foundOutlet);
            if (!foundOutlet) {
                console.log("Outlet not found in the specified beat.");
            }else{
                const finalSegmentDropdownData : any = foundOutlet.segments.map((segment:any) => ({
                    id: segment.segmentId,
                    name: segment.segmentName,
                }));
                console.log("finalSegmentDropdownData\t",finalSegmentDropdownData);
                setSegmentDropdownData(finalSegmentDropdownData);
                setSelectedSegment('');
            }
        }

    }, [selectedOutlet]);

    // set segment dropdown data after outlet has been selected
    useEffect(() => {

    }, [segmentDropdownData]);
  return (
    <>
        {selectedBeat !== '' && selectedOutlet !== ''  && selectedSegment !== '' ?
            <NewBrandsScreen
                selectedBeat={selectedBeat}
                selectedOutlet={selectedOutlet}
                selectedSegment={selectedSegment}
                setSelectedBeat={setSelectedBeat}
            />
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
                        {segmentDropdownData.length>0?
                            <View style={styles.dropdownContainerActive}>
                                <CustomDropdown
                                    setSelectedDropdownProps={setSelectedSegment}
                                    dropdownData={segmentDropdownData}
                                    dropdownType="Segment"
                                />
                            </View>
                            :<></>
                        }
                        {segmentDropdownData.length>0?
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