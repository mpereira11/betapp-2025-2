// app/main/(tabs)/chats/index.tsx
import { AuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import Entypo from '@expo/vector-icons/Entypo';
import { useFocusEffect } from "@react-navigation/native";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type ChatRow = {
  id: string;
  user_id: string;
  user_id2: string;
  other_user: {
    id: string;
    name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  last_message: {
    id: string;
    text: string;
    created_at: string;
  } | null;
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const today = new Date();

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const msgMidnight = new Date(d);
  msgMidnight.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (todayMidnight.getTime() - msgMidnight.getTime()) / 86400000
  );

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
}

export default function ChatsList() {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState<ChatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const fetchChats = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("chats_with_last_message")
      .select("*")
      .or(`user_id.eq.${user.id},user_id2.eq.${user.id}`)
      .order("last_message_created_at", { ascending: false });

    setLoading(false);
    if (error) {
      console.error("Error fetching chats:", error);
      return;
    }

    const processed: ChatRow[] = (data ?? []).map((c: any) => {
      const isUser1 = c.u1_id === user.id;
      const other_user = isUser1
        ? {
            id: c.u2_id,
            name: c.u2_name,
            username: c.u2_username,
            avatar_url: c.u2_avatar_url,
          }
        : {
            id: c.u1_id,
            name: c.u1_name,
            username: c.u1_username,
            avatar_url: c.u1_avatar_url,
          };

      const last_message = c.last_message_id
        ? {
            id: c.last_message_id,
            text: c.last_message_text,
            created_at: c.last_message_created_at,
          }
        : null;

      return {
        id: c.id,
        user_id: c.user_id,
        user_id2: c.user_id2,
        other_user,
        last_message,
      };
    });

    setChats(processed);
  };

  // 🔹 Suscripción realtime
  useEffect(() => {
    if (!user) return;

    fetchChats();

    const channel: RealtimeChannel = supabase
      .channel("chats-list")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // 🔹 Refrescar al volver al tab
  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [user])
  );

  const handlePressChat = (chatId: string, otherId?: string) => {
    router.push({
      pathname: "/main/chats/chat",
      params: { chatId, otherId },
    } as any);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 🔹 Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <Entypo size={24} name="chat" color="#F8C61E" />
      </View>

      {/* 🔹 Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conversación..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* 🔹 Lista de chats */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 8 }}
        renderItem={({ item }) => {
          const other = item.other_user;
          const lastMsg = item.last_message;

          return (
            <Pressable
              onPress={() => handlePressChat(item.id, other?.id)}
              style={styles.chatRow}
            >
              {other?.avatar_url ? (
                <Image
                  source={{ uri: other.avatar_url }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {other?.name?.[0] ?? other?.username?.[0] ?? "?"}
                  </Text>
                </View>
              )}
              <View style={styles.chatInfo}>
                <Text style={styles.name}>
                  {other?.name ?? other?.username ?? "Usuario"}
                </Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {lastMsg?.text ?? "Sin mensajes aún"}
                </Text>
              </View>
              <Text style={styles.date}>{formatDate(lastMsg?.created_at)}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#252C37",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    height: 100,
  },
  headerTitle: { color: "#F8C61E", fontSize: 20, fontWeight: "700" },
  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  searchInput: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#252C37",
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F8C61E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  chatInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  lastMessage: { fontSize: 14, color: "#666" },
  date: { fontSize: 12, color: "#999", marginLeft: 8 },
});
