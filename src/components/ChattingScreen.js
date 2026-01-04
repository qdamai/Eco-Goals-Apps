import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';

const ChattingScreen = () => {
    const [messages, setMessages] = useState([
        { id: '1', text: 'Halo! Apa kabar?', sender: 'other' },
        { id: '2', text: 'Saya baik-baik saja, terima kasih!', sender: 'me' },
        { id: '3', text: 'Ada yang bisa saya bantu?', sender: 'other' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const sendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                id: (messages.length + 1).toString(),
                text: newMessage,
                sender: 'me',
            };
            setMessages([...messages, message]);
            setNewMessage('');
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.messageContainer, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                inverted // Membalikkan urutan pesan
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ketik pesan..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <Button title="Kirim" onPress={sendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    myMessage: {
        backgroundColor: '#007AFF',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#E1E1E1',
        alignSelf: 'flex-start',
    },
    messageText: {
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
});

export default ChattingScreen;