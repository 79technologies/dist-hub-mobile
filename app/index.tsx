import { useState } from "react";
import { View } from "react-native";
import LoginForm from './LoginForm';
import BrandSelectionScreen from './components/BrandSelectionScreen';

export default function Index() {
  const [loginStatus, setLoginStatus] = useState<boolean>(true);

  const handleLoginStatusChange = (newValue:boolean) => {
    setLoginStatus(newValue);
  }

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
