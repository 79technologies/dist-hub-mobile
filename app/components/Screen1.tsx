import { useState } from "react";
import { View, Text } from "react-native";
import { Button } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';

export default function Screen1() {
    const navigation = useNavigation();
    return (
        <View style={{flex: 1, justifyContent: "center", backgroundColor:"blue"}}>
            <Text style={{color:"#ffffff"}}>Home Screen Data</Text>
            <Button onPress={() => navigation.navigate('outlet')}>Go to Screen 2</Button>
        </View>
    );
}
