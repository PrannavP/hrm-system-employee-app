import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkIn, checkOut } from '../services/api';
import { useUser } from '../hooks/useUser';

const HomeScreen: React.FC = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("");
    const [checkInTime, setCheckInTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
    const { user } = useUser();

    useEffect(() => {
        (async () => {
            let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
            if (locationStatus !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            // Retrieve check-in time from AsyncStorage
            const storedCheckInTime = await AsyncStorage.getItem('checkInTime');
            if (storedCheckInTime) {
                const parsedCheckInTime = new Date(storedCheckInTime);
                setCheckInTime(parsedCheckInTime);
                updateElapsedTime(parsedCheckInTime);
            }
        })();
    }, []);

    const handleCheckInOut = async (action: 'checkin' | 'checkout') => {
        if (!location) return;

        if (!user) {
            setStatus("User information is missing.");
            return;
        }

        try {
            console.log(user.emp_id);
            const response = action === 'checkin' 
                ? await checkIn(location.coords.latitude, location.coords.longitude, user.emp_id)
                : await checkOut(location.coords.latitude, location.coords.longitude, user.emp_id);

            setStatus(response.data.message);
            
            if (action === 'checkin') {
                const now = new Date();
                setCheckInTime(now);
                await AsyncStorage.setItem('checkInTime', now.toISOString());
                updateElapsedTime(now);
            } else {
                setCheckInTime(null);
                await AsyncStorage.removeItem('checkInTime');
                setElapsedTime("00:00:00");
            }
        } catch (error: any) {
            setStatus(error.response?.data?.message || "An error occurred during check-in/out");
        }
    };

    const updateElapsedTime = (startTime: Date) => {
        const now = new Date();
        const diff = now.getTime() - startTime.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setElapsedTime(
            `${String(hours).padStart(2, '0')}:` +
            `${String(minutes).padStart(2, '0')}:` +
            `${String(seconds).padStart(2, '0')}`
        );
    };

    useEffect(() => {
        if (checkInTime) {
            const interval = setInterval(() => updateElapsedTime(checkInTime), 1000);
            return () => clearInterval(interval);
        }
    }, [checkInTime]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{errorMsg}</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                {location && (
                    <MapView
                        key={location.coords.latitude + location.coords.longitude} // Unique key to force re-render
                        provider="google"
                        style={styles.map}
                        userInterfaceStyle='dark'
                        showsPointsOfInterest={false}
                        showsBuildings={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        zoomTapEnabled={false}
                        initialRegion={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                            title="You are here"
                        />
                    </MapView>
                )}
            </View>
            
            {/* Check-in/out Component */}
            <View style={styles.checkInOutContainer}>
                <Text style={styles.sectionTitle}>Check-in & Check-out</Text>
                <Text style={styles.timerText}>{elapsedTime}</Text>
                
                {!checkInTime ? (
                    <TouchableOpacity
                        style={styles.checkInButton}
                        onPress={() => handleCheckInOut('checkin')}
                    >
                        <Text style={styles.buttonText}>Check-In</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.checkOutButton}
                        onPress={() => handleCheckInOut('checkout')}
                    >
                        <Text style={styles.buttonText}>Check-Out</Text>
                    </TouchableOpacity>
                )}
                
                <Text style={styles.statusText}>{status}</Text>
                {checkInTime && (
                    <Text style={styles.timeText}>
                        Checked in at: {formatTime(checkInTime)}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapContainer: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 8,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    checkInOutContainer: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    timerText: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    checkInButton: {
        backgroundColor: '#16a34a',
        padding: 12,
        borderRadius: 4,
        marginBottom: 8,
    },
    checkOutButton: {
        backgroundColor: '#dc2626',
        padding: 12,
        borderRadius: 4,
        marginBottom: 8,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '500',
    },
    statusText: {
        textAlign: 'center',
        marginTop: 8,
        color: '#6b7280',
    },
    timeText: {
        textAlign: 'center',
        marginTop: 4,
        color: '#4b5563',
    },
});

export default HomeScreen;