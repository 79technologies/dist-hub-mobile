import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { BeatsOutletData } from "@/app/constants/BeatsOutlet";
import { BeatsOutletSegmentInterface } from '../interface/BeatsOutletSegment';
import CustomDropdown from './CustomDropdown';
import NewBrandsScreen from './NewBrandsScreen';
import { FinalOrderContext } from '@/app/contexts/FinalOrderContext';

const BeatsOutletSegment: React.FC = () => {
    const [beatsDropdownData, setBeatsDropdownData] = useState<BeatsOutletSegmentInterface[]>([]);
    const [outletDropdownData, setOutletDropdownData] = useState<BeatsOutletSegmentInterface[]>([]);

    const [selectedBeat, setSelectedBeat] = useState<BeatsOutletSegmentInterface | null>(null);
    const [selectedOutlet, setSelectedOutlet] = useState<BeatsOutletSegmentInterface | null>(null);

    const [finalOrderData, setFinalOrderData] = useState({});

    // set initial dropdown data
    useEffect(() => {
        setTimeout(() => {
            const beatsDropdownData = BeatsOutletData.map((beat) => ({
                id: beat.beatId,
                name: beat.beatName,
            }));
            setBeatsDropdownData(beatsDropdownData);
        }, 150);
    }, []);

    // useEffect(() => {
    //     setSelectedBeat(beatsDropdownData[0]);
    //     setSelectedOutlet({"id": "outlet_654", "name": "Ashirwad Family Bar & Rest  Balli"});
    // }, [beatsDropdownData]);

    // if selectedBeat changes
    useEffect(() => {
        // set appropriate outletDropdownData and selectedOutlet
        const foundBeat = BeatsOutletData.find((beat) => beat.beatId === selectedBeat?.id);

        if (!foundBeat) {
            console.log(`Beat with ID '${selectedBeat}' not found.`);
            setOutletDropdownData([]);
        } else {
            const finalOutletDropdownData = foundBeat.outlets.map((outlet) => ({
                id: outlet.outletId,
                name: outlet.outletName,
            }));
            setOutletDropdownData(finalOutletDropdownData);
        }
        setSelectedOutlet(null);
    }, [selectedBeat]);

    const handleBrandsCancel = () => {
        setSelectedOutlet(null);
        setOutletDropdownData([]);
        setSelectedBeat(null);
    }

    return (
        <FinalOrderContext.Provider value={{ finalOrderData, setFinalOrderData }}>
            {selectedOutlet != null ?
                <NewBrandsScreen
                    selectedBeat={selectedBeat}
                    selectedOutlet={selectedOutlet}
                    handleBrandsCancel={handleBrandsCancel}
                />
                : <>
                    {beatsDropdownData.length > 0 ? (
                        <View style={styles.container}>
                            <Text style={styles.dropdownText}>Welcome Aboard! <FontAwesomeIcon icon={faUserTie} size={25} style={styles.buttonIcons} /></Text>
                            <View style={styles.dropdownContainerActive}>
                                <CustomDropdown
                                    setSelectedDropdownProps={setSelectedBeat}
                                    dropdownData={beatsDropdownData}
                                    dropdownType="Beat"
                                />
                            </View>
                            {outletDropdownData.length > 0 ?
                                <View style={styles.dropdownContainerActive}>
                                    <CustomDropdown
                                        setSelectedDropdownProps={setSelectedOutlet}
                                        dropdownData={outletDropdownData}
                                        dropdownType="Outlet"
                                    />
                                </View>
                                : <></>
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
        </FinalOrderContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#3B0B61",
    },
    dropdownContainerActive: {
        width: '100%',
        height: 200,
        // position:'relative',
        // top:100
    },
    segmentText: {
        color: "#ffffff",
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    dropdownText: {
        // marginBottom:100,
        color: "#FFFFFF",
        fontSize: 25,
        height: 50
    },
    buttonIcons: {
        color: "#ffffff",
    },
    loadingText: {
        color: "#ffffff"
    }
});

export default BeatsOutletSegment;