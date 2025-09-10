import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Tab() {
  const router = useRouter();
  return (
    <View style={styles.bgContainer}>
      <TouchableOpacity style={styles.logoutIcon} onPress={() => router.push('/login')}>
        <Entypo name="log-out" size={25} color="#F8C61E" />
      </TouchableOpacity>
      {/* Círculo para avatar con icono */}
      <View style={styles.avatarCircle}>
        <FontAwesome size={36} name="user" color="#F8C61E" />
      </View>
      {/* Nombre de usuario */}
      <Text style={styles.username}>Username</Text>
      {/* Código ID */}
      <Text style={styles.userId}>ID: 12345678</Text>

      {/* Sección de balance y botones juntos */}
      <View style={styles.balanceActionsContainer}>
        <View style={styles.balanceSectionInner}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>$1000.00</Text>
        </View>
        <View style={styles.actionsRowCustom}>
          <TouchableOpacity style={styles.actionButtonYellow}><Text style={styles.actionButtonYellowText}>Deposit</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonYellow}><Text style={styles.actionButtonYellowText}>Withdraw</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonYellow}><Text style={styles.actionButtonYellowText}>History</Text></TouchableOpacity>
        </View>
      </View>

      {/* Sección de información */}
      <View style={styles.infoSection}>
        <Text style={styles.infoItem}>Personal Information</Text>
        <Text style={styles.infoItem}>Security</Text>
        <Text style={styles.infoItem}>Notifications</Text>
        <Text style={styles.infoItem}>Support</Text>
        <Text style={styles.infoItem}>Account Status</Text>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 120,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#252C37',
    borderWidth: 2,
    borderColor: '#252C37',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#252C37',
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  balanceActionsContainer: {
    width: '90%',
    backgroundColor: '#252C37',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 22,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#1a202c',
    shadowColor: '#323f52ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  balanceSectionInner: {
    alignItems: 'center',
    marginBottom: 18,
  },
  actionsRowCustom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButtonYellow: {
    flex: 1,
    backgroundColor: '#F8C61E',
    marginHorizontal: 6,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#FdD700',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  actionButtonYellowText: {
    color: '#252C37',
    fontWeight: 'bold',
    fontSize: 16,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  infoSection: {
    width: '90%',
    backgroundColor: '#f4f4f4',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoItem: {
    fontSize: 16,
    color: '#252C37',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logoutIcon: {
    position: 'absolute',
    top: 60,
    right: 25,
    zIndex: 10,
  },
});