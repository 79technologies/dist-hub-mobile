// BrandSelectionScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import SKUModal from './SKUModal';

type Brand = {
  id: string;
  name: string;
  skus: string[];
};

const brands: Brand[] = [
  { "id": "1", "name": "Johnnie Walker", "skus": ["250ml", "500ml", "750ml"] },
  { "id": "2", "name": "Smirnoff", "skus": ["250ml", "750ml"] },
  { "id": "3", "name": "Baileys", "skus": ["500ml", "750ml"] },
  { "id": "4", "name": "Tanqueray", "skus": ["250ml", "500ml"] },
  { "id": "5", "name": "Guinness", "skus": ["500ml"] },
  { "id": "6", "name": "Captain Morgan", "skus": ["250ml", "500ml", "750ml"] },
  { "id": "7", "name": "Don Julio", "skus": ["750ml"] },
  { "id": "8", "name": "Cîroc", "skus": ["250ml", "500ml"] },
  { "id": "9", "name": "Ketel One", "skus": ["500ml", "750ml"] },
  { "id": "10", "name": "Buchanan's", "skus": ["250ml", "750ml"] },
  { "id": "11", "name": "Crown Royal", "skus": ["250ml", "500ml"] },
  { "id": "12", "name": "Bulldog Gin", "skus": ["500ml"] },
  { "id": "13", "name": "Zacapa", "skus": ["750ml"] },
  { "id": "14", "name": "Roe & Co", "skus": ["250ml", "500ml", "750ml"] },
  { "id": "15", "name": "Haig Club", "skus": ["500ml"] },
  { "id": "16", "name": "Singleton", "skus": ["250ml", "750ml"] },
  { "id": "17", "name": "Talisker", "skus": ["500ml", "750ml"] },
  { "id": "18", "name": "Lagavulin", "skus": ["250ml"] },
  { "id": "19", "name": "Oban", "skus": ["500ml", "750ml"] },
  { "id": "20", "name": "Clynelish", "skus": ["250ml", "500ml"] }
];

const BrandSelectionScreen: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [modalVisibility, setModalVisibility] = useState(false);

  // testing code start
  useEffect(() => {
    setModalVisibility(true);
    setSelectedBrand(brands[16]);
  }, []);
  // testing code end

  return (
    <View style={styles.container}>
      <FlatList
        data={brands}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
              style={styles.brandItem}
              onPress={() => {
                 setSelectedBrand(item);
                 setModalVisibility(true);
                }
              }
          >
            <Text style={styles.brandName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      { modalVisibility && selectedBrand ?
        <SKUModal
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          setModalVisibility={setModalVisibility}
        /> :
        <></>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  brandItem: {
    padding: 15,
    backgroundColor : "maroon",
    margin : 2,
    borderBottomColor: '#ccc',
  },
  brandName: {
    color:"#ffffff",
    fontSize: 18,
  }
});

export default BrandSelectionScreen;