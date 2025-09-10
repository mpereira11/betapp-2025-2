import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Tab() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutIcon} onPress={() => router.push('/login')}>
        <Entypo name="log-out" size={25} color="#F8C61E" />
      </TouchableOpacity>
      <Text>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    position: 'absolute',
    top: 60,
    right: 25,
    zIndex: 10,
  },
});