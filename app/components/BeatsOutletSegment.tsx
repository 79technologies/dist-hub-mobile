import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { BeatsData } from "@/app/constants/DummyData";
import { BeatsOutletSegmentInterface } from '../interface/BeatsOutletSegment';
import CustomDropdown from './CustomDropdown';

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
    <View style={styles.container}>
        {beatsDropdownData.length>0 ? (
            <>
                <CustomDropdown
                    setSelectedDropdownProps={setSelectedBeat}
                    dropdownData={beatsDropdownData}
                    dropdownType="Beat"
                />
                {outletDropdownData.length>0?
                    <CustomDropdown
                        setSelectedDropdownProps={setSelectedOutlet}
                        dropdownData={outletDropdownData}
                        dropdownType="Outlet"
                    />
                    :<></>
                }
                {segmentDropdownData.length>0?
                    <CustomDropdown
                        setSelectedDropdownProps={setSelectedSegment}
                        dropdownData={segmentDropdownData}
                        dropdownType="Segment"
                    />
                    :<></>
                }
                {selectedBeat !== '' && selectedOutlet !== ''  && selectedSegment !== '' ?
                    <>
                        <Text>GTG</Text>
                    </>
                    :<></>
                }
            </>
        ) : (
            <>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Fetching Beats Data</Text>
            </>
        )}
                {/* <Text style={styles.loadingText}>Fetching Beats Data</Text> */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // maxHeight: '80%', // Limit modal height
    backgroundColor : "#3B0B61",
  },
  loadingText : {
    color : "#ffffff"
  }
});

export default BeatsOutletSegment;