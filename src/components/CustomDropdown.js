import React, {useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, fontSizes, spacing} from '../styles/theme';
import CustomInput from './CustomInput';

const CustomDropdown = ({data, onSelect, selectedValue, placeholder}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [filteredData, setFilteredData] = useState(data);

  const handleSelect = item => {
    onSelect(item.id); // Notify parent component of selected account ID
    setSearchTerm(item.name); // Show selected item name in input
    setDropdownVisible(false); // Hide dropdown after selection
  };

  const handleSearch = text => {
    setSearchTerm(text);
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const handleEnterKeyPress = () => {
    if (filteredData.length > 0) {
      handleSelect(filteredData[0]); // Select the closest match
      setDropdownVisible(false); // Hide dropdown after selection
    }
  };

  return (
    <View style={styles.container}>
      <CustomInput
        label={placeholder}
        icon={isDropdownVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
        onPressIcon={() => setDropdownVisible(!isDropdownVisible)} // Toggle dropdown visibility
        placeholder="Search or select account"
        value={searchTerm}
        onFocus={() => setDropdownVisible(true)} // Show dropdown on focus
        onChangeText={handleSearch}
        onKeyPress={({nativeEvent}) => {
          if (nativeEvent.key === 'Enter') handleEnterKeyPress(); // Select best match on Enter
        }}
      />
      {isDropdownVisible && (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          style={styles.dropdown}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleSelect(item)} // Ensure item is selected on click
            >
              <Text style={styles.itemText}>{item?.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.small,
  },
  dropdown: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    backgroundColor: colors.white,
    marginTop: 4,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightText,
  },
  itemText: {
    fontSize: fontSizes.medium,
    color: colors.text,
  },
});

export default CustomDropdown;
