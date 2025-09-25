import React, { useState } from 'react';
import { Text, View } from 'react-native';

// Users List -> profiles

export default function Users() {

    const [users, setUsers] = useState([]);

    return (
        <View>
            <Text>Users</Text>
        </View>
    )
}