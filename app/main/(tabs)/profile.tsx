import { AuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");

  // Cargar perfil desde Supabase
  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("name, username, email")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setEditName(data.name || "");
        setEditUsername(data.username || "");
      }
      setLoading(false);
    };
    loadProfile();
  }, [user]);

  // Guardar cambios
  const handleSave = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        name: editName,
        username: editUsername,
      })
      .eq("id", user.id);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setProfile({ ...profile, name: editName, username: editUsername });
      setModalVisible(false);
      Alert.alert("Éxito", "Perfil actualizado correctamente");
    }
  };

  return (
    <View style={styles.bgContainer}>
      {/* Logout */}
      <TouchableOpacity style={styles.logoutIcon} onPress={logout}>
        <Entypo name="log-out" size={25} color="#F8C61E" />
      </TouchableOpacity>

      {/* Avatar */}
      <View style={styles.avatarCircle}>
        <FontAwesome size={36} name="user" color="#F8C61E" />
      </View>

      {/* Username y nombre */}
      <Text style={styles.username}>
        {profile?.username || "Cargando..."}
      </Text>
      <Text style={styles.userId}>
        {profile?.name || ""}
      </Text>
      <Text style={styles.userId}>
        {profile?.email || ""}
      </Text>

      {/* Botón para editar */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.editButtonText}>Editar perfil</Text>
      </TouchableOpacity>

      {/* 🔹 Sección de balance */}
      <View style={styles.balanceActionsContainer}>
        <View style={styles.balanceSectionInner}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>$1000.00</Text>
        </View>
        <View style={styles.actionsRowCustom}>
          <TouchableOpacity style={styles.actionButtonYellow}>
            <Text style={styles.actionButtonYellowText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonYellow}>
            <Text style={styles.actionButtonYellowText}>Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonYellow}>
            <Text style={styles.actionButtonYellowText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 Sección de info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoItem}>Personal Information</Text>
        <Text style={styles.infoItem}>Security</Text>
        <Text style={styles.infoItem}>Notifications</Text>
        <Text style={styles.infoItem}>Support</Text>
        <Text style={styles.infoItem}>Account Status</Text>
      </View>

      {/* 🔹 Modal de edición */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={editUsername}
              onChangeText={setEditUsername}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 120,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#252C37",
    borderWidth: 2,
    borderColor: "#252C37",
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#252C37",
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  logoutIcon: {
    position: "absolute",
    top: 60,
    right: 25,
    zIndex: 10,
  },
  editButton: {
    marginTop: 16,
    backgroundColor: "#F8C61E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  editButtonText: {
    color: "#252C37",
    fontWeight: "bold",
    fontSize: 16,
  },
  balanceActionsContainer: {
    width: "90%",
    backgroundColor: "#252C37",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 22,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#1a202c",
    shadowColor: "#323f52ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  balanceSectionInner: {
    alignItems: "center",
    marginBottom: 18,
  },
  actionsRowCustom: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionButtonYellow: {
    flex: 1,
    backgroundColor: "#F8C61E",
    marginHorizontal: 6,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#FdD700",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  actionButtonYellowText: {
    color: "#252C37",
    fontWeight: "bold",
    fontSize: 16,
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  balanceValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  infoSection: {
    width: "90%",
    backgroundColor: "#f4f4f4",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoItem: {
    fontSize: 16,
    color: "#252C37",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#F8C61E",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  saveButtonText: {
    fontWeight: "bold",
    color: "#252C37",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontWeight: "bold",
    color: "#252C37",
  },
});
