// app/main/(tabs)/chats/chat.tsx
import { AuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Message = {
  id: string;
  text: string;
  sent_by: string;
  media?: any | null;
  created_at: string;
  chat_id: string;
};

type Profile = {
  id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
};

export default function ChatScreen() {
  const params = useLocalSearchParams<{ chatId: string; otherId?: string }>();
  const chatId = params.chatId;
  const otherId = params.otherId;
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [otherUser, setOtherUser] = useState<Profile | null>(null);
  const channelRef = useRef<any>(null);
  const flatRef = useRef<FlatList>(null);
  const router = useRouter();

  // 🔹 Obtener info del otro usuario
  useEffect(() => {
    if (!otherId) return;
    const fetchOther = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, username, avatar_url")
        .eq("id", otherId)
        .single();
      if (!error && data) setOtherUser(data);
    };
    fetchOther();
  }, [otherId]);

  // 🔹 Cargar mensajes y suscripción realtime
  useEffect(() => {
    if (!chatId) return;

    let isMounted = true;

    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });
      setLoading(false);
      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }
      if (isMounted) setMessages(data ?? []);
    };

    fetchMessages();

    const channel = supabase
      .channel(`public:messages:chat_id=${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
          setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      isMounted = false;
      try {
        if (channelRef.current) supabase.removeChannel(channelRef.current);
      } catch {
        // ignore
      }
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!text.trim() || !chatId || !user) return;
    const payload = {
      text: text.trim(),
      sent_by: user.id,
      chat_id: chatId,
      media: null,
    };

    const { data, error } = await supabase.from("messages").insert([payload]).select().single();

    if (error) {
      console.error("Error inserting message:", error);
      return;
    }

    setText("");
    setMessages((prev) => [...prev, data as Message]);
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderItem = ({ item }: { item: Message }) => {
    const mine = item.sent_by === user?.id;
    return (
      <View style={[styles.messageContainer, mine ? styles.myMessage : styles.otherMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timeText}>{new Date(item.created_at).toLocaleTimeString()}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={10}
    >
      {/* 🔹 Header personalizado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#F8C61E" />
        </TouchableOpacity>

        {otherUser?.avatar_url ? (
          <Image source={{ uri: otherUser.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {otherUser?.name?.[0] ?? otherUser?.username?.[0] ?? "?"}
            </Text>
          </View>
        )}

        <Text style={styles.usernameText}>
          {otherUser?.name ?? otherUser?.username ?? "Usuario"}
        </Text>
      </View>

      {/* 🔹 Lista de mensajes */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
      />

      {/* 🔹 Input de mensaje */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Escribe un mensaje..."
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  // 🔹 HEADER NUEVO
  header: {
    backgroundColor: "#252C37",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: { marginRight: 10 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 19,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 19,
    backgroundColor: "#F8C61E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarInitial: { color: "#fff", fontWeight: "700", fontSize: 16 },
  usernameText: { color: "#F8C61E", fontSize: 20, fontWeight: "600" },

  messagesList: { paddingHorizontal: 12, paddingVertical: 8, flexGrow: 1 },

  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 6,
  },
  myMessage: {
    backgroundColor: "#F8C61E",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  messageText: { fontSize: 16 },
  timeText: {
    fontSize: 10,
    color: "#333",
    marginTop: 6,
    textAlign: "right",
  },

  inputRow: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#252C37",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendText: {
    color: "#fff",
    fontWeight: "700",
  },
});
