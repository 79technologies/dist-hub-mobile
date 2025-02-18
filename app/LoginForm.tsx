// LoginForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

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
};

const LoginForm: React.FC<LoginFormProps> = ({onLoginChange}) => {
  const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const handleInputChange = (field: keyof Credentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
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
      const response = await axios.post<ApiResponse>('http://192.168.29.197:3000/signIn', {
        email,
        password,
      });

      if (response.data.success) {
        Alert.alert('Success', 'You have successfully logged in!');
        onLoginChange(true);
      } else {
        Alert.alert(response.data.message || 'Invalid credentials.');
        setError(response.data.message || 'Invalid credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
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