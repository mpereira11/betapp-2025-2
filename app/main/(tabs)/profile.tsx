import { AuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./profile.styles";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Modal edición
  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");

  // Camera / avatar
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Cargar perfil desde Supabase
  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("name, username, email, avatar_url")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setEditName(data.name || "");
        setEditUsername(data.username || "");
        if (data.avatar_url) {
          setPhotoUri(data.avatar_url);
        }
      }
      setLoading(false);
    };
    loadProfile();
  }, [user]);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // Abre la cámara cuando el usuario pulsa el avatar.
  const openCamera = async () => {
    try {
      // Si el hook aún no ha cargado el estado, pedimos permiso y esperamos.
      if (!permission || !permission.granted) {
        const result = await requestPermission();
        // requestPermission puede retornar PermissionResponse; comprobamos granted.
        if (!result || !result.granted) {
          Alert.alert(
            "Permiso necesario",
            "Necesitamos permiso para usar la cámara. Por favor habilítalo."
          );
          return;
        }
      }
      // Si llegamos aquí, tenemos permiso.
      setShowCameraModal(true);
    } catch (err) {
      console.log("openCamera error:", err);
      Alert.alert("Error", "No se pudo solicitar permiso de cámara.");
    }
  };

  const takePicture = async () => {
    try {
      if (!cameraRef.current) {
        Alert.alert("Cámara", "La cámara aún no está lista.");
        return;
      }
      
      // Se toma la foto actual y se guarda en la const photo
      const photo = await cameraRef.current.takePictureAsync?.();
      if (!photo) {
        Alert.alert("Error", "No se pudo tomar la foto.");
        return;
      }

      // Se guarda la uri de la foto en el estado para mostrarla en el avatar
      const uri = photo.uri ?? (photo.base64 ? `data:image/jpg;base64,${photo.base64}` : null);
      if (uri) {
        setPhotoUri(uri);
      }

      setShowCameraModal(false);

      // Opcional: subir la foto a Supabase Storage y guardar la URL en profiles
      // await uploadAvatarToSupabase(uri);
    } catch (err) {
      console.log("takePicture error:", err);
      Alert.alert("Error", "Ha ocurrido un error al tomar la foto.");
    }
  };

  // Ejemplo básico de subida a Supabase (opcional). Ajusta bucket/nombres según tu configuración.
  // NOTA: la API de supabase storage puede devolver estructuras ligeramente distintas según la versión;
  // prueba y ajusta (este helper es un punto de partida).
  const uploadAvatarToSupabase = async (uri: string) => {
    if (!user) return;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ext = uri.split(".").pop()?.split("?")[0] ?? "jpg";
      const filePath = `avatars/${user.id}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, blob, { upsert: true });

      if (uploadError) {
        console.log("uploadError", uploadError);
        throw uploadError;
      }

      // Obtener URL pública (estructura puede variar)
      const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = (publicData as any)?.publicUrl ?? (publicData as any)?.publicURL ?? null;

      if (publicUrl) {
        // Actualizar profile
        await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
        setProfile((p: any) => ({ ...p, avatar_url: publicUrl }));
      }
    } catch (err) {
      console.log("uploadAvatarToSupabase error:", err);
      Alert.alert("Error", "No se pudo subir la imagen al servidor.");
    }
  };

  // Guardar cambios en el modal de perfil
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
      <TouchableOpacity style={styles.logoutIcon} onPress={() => router.push('/login')}>
        <Entypo name="log-out" size={25} color="#F8C61E" />
      </TouchableOpacity>

      {/* Avatar: ahora es TouchableOpacity */}
      <TouchableOpacity style={styles.avatarCircle} onPress={openCamera} activeOpacity={0.8}>
        {photoUri ? ( // Si hay una foto guardada se usa su uri para ponerla como imagen, si no, el icono por defecto
          <Image source={{ uri: photoUri }} style={styles.avatarImage} />
        ) : (
          <FontAwesome size={36} name="user" color="#F8C61E" />
        )}
      </TouchableOpacity>
      <Text style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Toca el avatar para cambiarlo</Text>

      {/* Username y nombre */}
      <Text style={styles.username}>{profile?.username || "Cargando..."}</Text>
      <Text style={styles.userId}>{profile?.name || ""}</Text>
      <Text style={styles.userId}>{profile?.email || ""}</Text>

      {/* Botón para editar */}
      <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.editButtonText}>Editar perfil</Text>
      </TouchableOpacity>

      {/* Balance e info (igual que antes) */}
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

      <View style={styles.infoSection}>
        <Text style={styles.infoItem}>Personal Information</Text>
        <Text style={styles.infoItem}>Security</Text>
        <Text style={styles.infoItem}>Notifications</Text>
        <Text style={styles.infoItem}>Support</Text>
        <Text style={styles.infoItem}>Account Status</Text>
      </View>

      {/* Modal de Cámara */}
      <Modal visible={showCameraModal} animationType="slide" transparent={false}>
        <View style={styles.cameraModal}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            onCameraReady={() => setIsCameraReady(true)}
          />
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.controlButton} onPress={() => setShowCameraModal(false)}>
              <Text style={styles.controlText}>Cerrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.shotButton]}
              onPress={takePicture}
              disabled={!isCameraReady}
            >
              <Text style={styles.controlText}>Tomar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
              <Text style={styles.controlText}>Flip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de edición */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TextInput style={styles.input} placeholder="Nombre" value={editName} onChangeText={setEditName} />
            <TextInput style={styles.input} placeholder="Username" value={editUsername} onChangeText={setEditUsername} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}