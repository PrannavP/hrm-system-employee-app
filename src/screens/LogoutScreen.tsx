import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const LogoutScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Logout Screen</Text>
            <Button title='Logout' />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
    },
});

export default LogoutScreen;