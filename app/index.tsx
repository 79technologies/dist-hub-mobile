import { useState, useEffect } from "react";
import { View } from "react-native";
import Toast from 'react-native-toast-message';
import LoginForm from './LoginForm';
import BrandSelectionScreen from './components/BrandSelectionScreen';

export default function Index() {
  const [loginStatus, setLoginStatus] = useState<boolean>(false);

  const handleLoginStatusChange = (newValue:boolean) => {
    setLoginStatus(newValue);
  }

  useEffect(() => {
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋'
    });
  },[]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      {loginStatus ? (
        // <Text>Login Successfull</Text>
        <BrandSelectionScreen />
      ) : (
        <LoginForm onLoginChange={handleLoginStatusChange}/>
      )}
    </View>
  );
}
