import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BeatsOutletSegmentInterface } from '../interface/BeatsOutletSegment';

type CustomRadioButtonProps = {
    options : BeatsOutletSegmentInterface[];
    onSelect: (RadioBtnData: BeatsOutletSegmentInterface, type : string) => void;
    radioBtnType : string;
};

const CustomRadioButton:React.FC<CustomRadioButtonProps> = ({ options, onSelect, radioBtnType }) => {
  const [selectedOption, setSelectedOption] = useState<BeatsOutletSegmentInterface|null>(null);

  const handleOptionSelect = (option:BeatsOutletSegmentInterface) => {
    setSelectedOption(option);
    if (onSelect) {
      onSelect(option, radioBtnType);
    }
  };

  return (
    <View style={styles.radioBtnContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.radioButton,
            selectedOption?.id === option.id && styles.selectedRadioButton,
          ]}
          onPress={() => handleOptionSelect(option)}
        >
          <View
            style={[
              styles.radioButtonInner,
              selectedOption?.id === option.id && styles.selectedRadioButtonInner,
            ]}
          />
          <Text style={styles.radioButtonLabel}>{option.displayName}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
    radioBtnContainer:{
        marginBottom:50
    },
    radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    },
    radioButtonInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 10,
    },
    selectedRadioButton: {
    // Styles for the outer circle when selected (if needed)
    },
    selectedRadioButtonInner: {
    backgroundColor: '#007AFF', // Example selected color
    },
    radioButtonLabel: {
    fontSize: 16,
    },
});

export default CustomRadioButton;