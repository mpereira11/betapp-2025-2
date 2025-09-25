import React from 'react'
import { Text, View } from 'react-native'

interface Message {
    id: string,// UUID
    text: string,
    sentBy: string, // UUID FK id profile
    media?: {
        url: string,
        type: 'image' | 'video'
    },
    createdAt: Date,
    deletedAt: Date | null,
    editedAt: Date | null,
    seenAt: Date | null
    sentAt: Date | null,
    chatId:string // UUID FK chat id
}

interface chat {
    id: string, //UUID FK profile id
    userId: string, // UUID FK profile id
    userId2: string,
    messages: Message[]
}


export default function Chat() {

    // Create 1 messages

    return (
        <View>
            <Text>Chat</Text>
        </View>
    )
}