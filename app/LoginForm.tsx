import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { LoginData } from '@/app/constants/DummyData';

type Credentials = {
  email: string;
  password: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  token?: string;
};

// Define the props for LoginForm
type LoginFormProps = {
  onLoginChange: (newValue: boolean) => void;
  showToast : () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({onLoginChange, showToast}) => {
  const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const navigation = useNavigation();

  const handleInputChange = (field: keyof Credentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  };

  const checkCredentials = (email:string, password:string) => {
    return LoginData.find(user => user.id === email && user.pass === password);
  };

  const handleLogin = async () => {
    const { email, password } = credentials;

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const matchedUser = checkCredentials(email,password);

      if (matchedUser) {
        showToast();
        setTimeout(() => {
          onLoginChange(true);
        }, 2000);
      } else {
        setLoading(false);
        setError('Invalid credentials.');
      }

      // const response = await axios.post<ApiResponse>('http://192.168.29.197:3000/signIn', {
      //   email,
      //   password,
      // });

      // if (response.data.success) {
      //   Alert.alert('Success', 'You have successfully logged in!');
      //   onLoginChange(true);
      // } else {
      //   Alert.alert(response.data.message || 'Invalid credentials.');
      //   setError(response.data.message || 'Invalid credentials.');
      // }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('API Error:', err);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.ImageContainer}>
        <Image source={require('@/assets/images/diageo.png')} style={styles.image} />
      </View>
      {/* <Text style={styles.title}>Login</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={credentials.email}
        onChangeText={(text) => handleInputChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={credentials.password}
        onChangeText={(text) => handleInputChange('password', text)}
        secureTextEntry
        autoCapitalize="none"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor : "#D9F5E4",
    flex: 1,
    justifyContent: 'center',
    // textAlign: 'center',
    padding: 20,
    // borderWidth: 1, borderColor: 'red',
  },
  ImageContainer:{
    // flex:1,
    textAlign: 'center',
    // justifyContent: 'center',
    // borderWidth: 1, borderColor: 'red',
  },
  image: {
    // borderWidth: 1, borderColor: 'red',
    width: 'auto',
    marginBottom:50,
    // height: 200,
    // alignItems: 'center',
    resizeMode: 'contain', // or 'cover', 'stretch', etc.
  },
  input: {
    color:'#000',
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default LoginForm;