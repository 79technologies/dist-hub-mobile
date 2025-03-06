import { useState } from "react";
import { View, Text } from "react-native";
import { Button } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';

export default function Screen2() {
    const navigation = useNavigation();
  return (
    <View style={{flex: 1, justifyContent: "center", backgroundColor:"purple"}}>
        <Text style={{color:"#ffffff"}}>Outlet Screen Data</Text>
        <Button onPress={() => navigation.navigate('home')}>Go to Screen 1</Button>
    </View>
  );
}
