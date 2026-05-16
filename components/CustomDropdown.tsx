import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { BeatsOutletSegmentInterface } from '../interface/BeatsOutletSegment';

type CustomDropdownProps = {
  dropdownData: BeatsOutletSegmentInterface[];
  dropdownType: string;
  setSelectedDropdownProps: (newValue: BeatsOutletSegmentInterface | null) => void;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  dropdownData,
  dropdownType,
  setSelectedDropdownProps,
}) => {
  const [selectedId, setSelectedId] = useState('');

  const handleChange = (item: BeatsOutletSegmentInterface) => {
    setSelectedId(item.id);
    setSelectedDropdownProps(item);
  };

  return (
    <View style={styles.dropdownContainer}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={dropdownData}
        search
        labelField="name"
        valueField="id"
        placeholder={`Select ${dropdownType}`}
        searchPlaceholder="Search"
        value={selectedId}
        onChange={handleChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  dropdown: {
    height: 50,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#6B7280',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 8,
    borderColor: '#D1D5DB',
  },
});

export default CustomDropdown;
