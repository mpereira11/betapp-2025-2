import { AuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function WalletScreen() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");

  // Cargar saldo y movimientos
  const fetchWallet = async () => {
    if (!user) return;

    setLoading(true);
    // Obtener puntos actuales
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error cargando saldo:", profileError);
    } else {
      setBalance(profile.points ?? 0);
    }

    // Obtener historial
    const { data: walletData, error: walletError } = await supabase
      .from("wallet_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (walletError) console.error("Error cargando historial:", walletError);
    else setHistory(walletData ?? []);

    setLoading(false);
  };

  useEffect(() => {
    fetchWallet();
  }, [user]);

  // Manejar depósito o retiro
  const handleTransaction = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      Alert.alert("Error", "Por favor ingresa un monto válido");
      return;
    }

    const newBalance =
      transactionType === "deposit" ? balance + value : balance - value;

    if (transactionType === "withdraw" && newBalance < 0) {
      Alert.alert("Error", "Saldo insuficiente");
      return;
    }

    // Actualizar puntos
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ points: newBalance })
      .eq("id", user.id);

    if (updateError) {
      Alert.alert("Error", "No se pudo actualizar el saldo");
      return;
    }

    // Insertar registro en historial
    const { error: insertError } = await supabase.from("wallet_history").insert([
      {
        user_id: user.id,
        type: transactionType,
        amount: value,
      },
    ]);

    if (insertError) {
      Alert.alert("Error", "No se pudo registrar la transacción");
      return;
    }

    setModalVisible(false);
    setAmount("");
    fetchWallet();
  };

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.transactionRow,
        item.type === "deposit"
          ? { borderLeftColor: "green" }
          : { borderLeftColor: "red" },
      ]}
    >
      <Text style={styles.transactionType}>
        {item.type === "deposit" ? "Depósito" : "Retiro"}
      </Text>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.type === "deposit" ? "green" : "red" },
        ]}
      >
        {item.type === "deposit" ? "+" : "-"}${item.amount}
      </Text>
      <Text style={styles.transactionDate}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.logoutIcon}
        onPress={() => router.push("/login")}
      >
        <Entypo name="log-out" size={25} color="#F8C61E" />
      </TouchableOpacity>

      <Text style={styles.title}>Mi Billetera</Text>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Saldo actual</Text>
        <Text style={styles.balanceValue}>${balance.toFixed(2)}</Text>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.buttonGreen, { backgroundColor: "green" }]}
          onPress={() => {
            setTransactionType("deposit");
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>Depositar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonRed, { backgroundColor: "red" }]}
          onPress={() => {
            setTransactionType("withdraw");
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>Retirar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.historyTitle}>Historial de transacciones</Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() =>
          !loading ? (
            <Text style={{ color: "#666", marginTop: 16 }}>
              No hay transacciones aún
            </Text>
          ) : null
        }
        style={{ width: "100%", paddingHorizontal: 20 }}
      />

      {/* MODAL DE DEPÓSITO / RETIRO */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {transactionType === "deposit" ? "Depositar" : "Retirar"}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Monto..."
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <TouchableOpacity
              style={[
                styles.modalButton,
                {
                  backgroundColor:
                    transactionType === "deposit" ? "green" : "red",
                },
              ]}
              onPress={handleTransaction}
            >
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.modalButton, { backgroundColor: "#ccc" }]}
            >
              <Text style={{ color: "#000" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  logoutIcon: {
    position: "absolute",
    top: 60,
    right: 25,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#252C37",
    marginTop: 100,
    marginBottom: 20,
  },
  balanceContainer: {
    backgroundColor: "#252C37",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "85%",
  },
  balanceLabel: { color: "#F8C61E", fontSize: 16 },
    balanceValue: { color: "#fff", fontSize: 32, fontWeight: "700", marginTop: 5 },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginVertical: 20,
  },
  buttonGreen: {
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    shadowColor: '#086600ff',
    shadowOpacity: 0.3,
  },
  buttonRed: {
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    shadowColor: '#c70000ff',
    shadowOpacity: 0.3,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#252C37",
    marginBottom: 10,
  },
  transactionRow: {
    flexDirection: "column",
    borderLeftWidth: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  transactionType: { fontSize: 16, fontWeight: "600", color: "#252C37" },
  transactionAmount: { fontSize: 16, fontWeight: "700" },
  transactionDate: { color: "#666", fontSize: 12, marginTop: 4 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    marginBottom: 12,
    textAlign: "center",
  },
  modalButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
