import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserTie, faShop, faBan, faSearch } from '@fortawesome/free-solid-svg-icons';
import { BeatsOutletSegmentInterface, Beats, Outlet, Segment } from '../interface/BeatsOutletSegment';

type CustomDropdownProps = {
    dropdownData : BeatsOutletSegmentInterface[];
    dropdownType : string;
    setSelectedDropdownProps : (newValue : BeatsOutletSegmentInterface | null) => void;
};

const CustomDropdown:React.FC<CustomDropdownProps> = ({ dropdownData, dropdownType, setSelectedDropdownProps }) => {
    const [selectedDropdownData, setSelectedDropdownData] = useState<BeatsOutletSegmentInterface>({id:'',name:''});
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState<string[]|[]>([]);

    const handleDropdownChange = (outletId:string, outletLabel:string) => {
      const finalData = {
        id : outletId,
        name : outletLabel
      };
        setSelectedDropdownData(finalData);
        setSelectedDropdownProps(finalData);
        // console.log(outletId, outletLabel);
    }

    const handleOutletSearch = (text:string) => {
        setSearch(text);
        const filtered = dropdownData.filter((item) =>
            item.name.toLowerCase().includes(text.toLowerCase())
        );
        // setFilteredData(filtered);
    }

    const handleOptionSelect = (option:BeatsOutletSegmentInterface) => {
        // setSelectedOption(option);
        // if (onSelect) {
        //   onSelect(option, radioBtnType);
        // }
    }

    // set initial dropdown data
    useEffect(() => {
        // console.log(dropdownData,"\t",dropdownType);
        // const dropdownDataStrings = dropdownData.map((data)=>(data.name))
        // setFilteredData(dropdownDataStrings);
        // console.log(dropdownDataStrings);
    }, []);

    return (
        <View style={styles.dropdownContainer}>
            {/* <Text style={styles.dropdownText}>Welcome Aboard! <FontAwesomeIcon icon={faUserTie} size={25} style={styles.buttonIcons}/></Text> */}
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={dropdownData}
                search
                // minHeight={500}
                maxHeight={500}
                labelField="name"
                valueField="id"
                placeholder={`Select ${dropdownType}`}
                searchPlaceholder="Search"
                value={selectedDropdownData.id}
                onChange={item => {
                    handleDropdownChange(item.id, item.name);
                }}
                onChangeText={handleOutletSearch}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    dropdownContainer:{
        flex: 1,
        padding: 20,
        // justifyContent: 'center',
        alignItems: 'center',
        // maxHeight: '80%', // Limit modal height
        // borderColor:'red',
        // borderWidth:2,
        width:"100%"
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
      buttonIcons:{
        color : "#ffffff",
      }
    });

export default CustomDropdown;