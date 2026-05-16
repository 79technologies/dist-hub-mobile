import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { BeatsOutletSegmentInterface } from '../interface/BeatsOutletSegment';

const CARD_BG = '#162032';
const INPUT_BG = '#1E2D42';
const BRAND_GOLD = '#D4AF37';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_MUTED = '#8A9BB0';
const BORDER_COLOR = '#2A3F58';

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
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (item: BeatsOutletSegmentInterface) => {
    setSelectedId(item.id);
    setSelectedDropdownProps(item);
  };

  return (
    <Dropdown
      style={[styles.dropdown, isFocused && styles.dropdownFocused]}
      placeholderStyle={styles.placeholder}
      selectedTextStyle={styles.selectedText}
      inputSearchStyle={styles.searchInput}
      containerStyle={styles.listContainer}
      itemTextStyle={styles.itemText}
      itemContainerStyle={styles.itemContainer}
      activeColor={INPUT_BG}
      data={dropdownData}
      search
      labelField="name"
      valueField="id"
      placeholder={`Select ${dropdownType}`}
      searchPlaceholder={`Search ${dropdownType.toLowerCase()}...`}
      value={selectedId}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChange={handleChange}
      renderRightIcon={() => (
        <FontAwesomeIcon
          icon={faChevronDown}
          size={14}
          color={isFocused ? BRAND_GOLD : TEXT_MUTED}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 52,
    backgroundColor: INPUT_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 16,
  },
  dropdownFocused: {
    borderColor: BRAND_GOLD,
  },
  placeholder: {
    fontSize: 15,
    color: TEXT_MUTED,
  },
  selectedText: {
    fontSize: 15,
    color: TEXT_PRIMARY,
    fontWeight: '500',
  },
  searchInput: {
    height: 44,
    fontSize: 15,
    borderRadius: 8,
    borderColor: BORDER_COLOR,
    color: TEXT_PRIMARY,
    backgroundColor: INPUT_BG,
  },
  listContainer: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    marginTop: 4,
    overflow: 'hidden',
  },
  itemText: {
    fontSize: 15,
    color: TEXT_PRIMARY,
  },
  itemContainer: {
    backgroundColor: CARD_BG,
    paddingVertical: 2,
  },
});

export default CustomDropdown;
