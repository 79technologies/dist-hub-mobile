import { useState, useEffect } from "react";
import { View } from "react-native";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import ToastProvider from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import LoginForm from './LoginForm';
import BrandSelectionScreen from './components/BrandSelectionScreen';

export default function Index() {
  const [loginStatus, setLoginStatus] = useState<boolean>(true);

  const handleLoginStatusChange = (newValue:boolean) => {
    setLoginStatus(newValue);
  };

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋'
    });
  };

  return (
    // <ToastProvider>
      <View style={{flex: 1, justifyContent: "center"}}>
        <StatusBar style="dark" />
        {loginStatus ? 
          <BrandSelectionScreen />
          : <LoginForm onLoginChange={handleLoginStatusChange} showToast={showToast}/>
        }
      </View>
    // </ToastProvider>
  );
}
