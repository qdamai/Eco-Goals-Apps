import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const LeaderboardScreen = () => {
    // Data dummy untuk leaderboard
    const leaderboardData = [
        { id: '1', name: 'Player 1', score: 100 },
        { id: '2', name: 'Player 2', score: 90 },
        { id: '3', name: 'Player 3', score: 80 },
        { id: '4', name: 'Player 4', score: 70 },
        { id: '5', name: 'Player 5', score: 60 },
    ];

    // Render item untuk FlatList
    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.playerName}>{item.name}</Text>
            <Text style={styles.playerScore}>{item.score}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Leaderboard</Text>
            <FlatList
                data={leaderboardData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    itemContainer: {
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    playerName: {
        fontSize: 18,
        fontWeight: '600',
    },
    playerScore: {
        fontSize: 16,
        color: '#555',
    },
});

export default LeaderboardScreen;