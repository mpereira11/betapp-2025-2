import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";



export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [confirmationMsg, setConfirmationMsg] = useState('');

  const handleRegister = async () => {
    setError('');
    setConfirmationMsg('');
    try {
      await register(email, password, name, username);
      setConfirmationMsg('Registro exitoso. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.');
      setEmail('');
      setPassword('');
      setName('');
      setUsername('');
    } catch (err: any) {
      setError(err.message || 'No se pudo registrar');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo-bet-app.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name..."
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username..."
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email..."
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password..."
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
  {!!error && <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>}
  {!!confirmationMsg && <Text style={{ color: 'green', marginBottom: 8 }}>{confirmationMsg}</Text>}
      <TouchableOpacity 
        style={styles.button} onPress={handleRegister} disabled={isLoading}>
        <Text style={styles.text_button}>
          {isLoading ? 'Loading...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
      <View style={styles.icon_row}>
        <Image source={require('../../assets/images/facebook-icon.png')} style={styles.icon} />
        <Image source={require('../../assets/images/google-icon.png')} style={styles.icon} />
        <Image source={require('../../assets/images/X-icon.png')} style={styles.icon} />
      </View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/(auth)/login')}
      >
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: 16,
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#F8C61E',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#252C37'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ffffffff',
  },
  input: {
    height: 50,
    width: 250,
    borderColor: '#F8C61E',
    backgroundColor: '#3A3F47',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: '#ffffffff',
  },
  image: {
    width: 144,
    height: 144,
    marginBottom: 25
  },
  button: {
  backgroundColor: '#F8C61E',
  borderRadius: 25,
  paddingVertical: 18,
  paddingHorizontal: 32,
  marginTop: 40,
  shadowColor: '#FdD700',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.5,
  shadowRadius: 5,
  },
  text_button: {
    color: '#252C37',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: '#F8C61E',
    marginBottom: 20,
  },
  icon_row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    gap: 20,
  }
});