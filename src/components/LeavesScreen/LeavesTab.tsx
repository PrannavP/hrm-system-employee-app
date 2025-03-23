import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

type Leave = {
    id: string;
    type: string;
    date: string;
    status: "Approved" | "Pending" | "Rejected";
    description: string;
};

type LeavesTabProps = {
    leavesData: Leave[];
};

const LeavesTab: React.FC<LeavesTabProps> = () => {
    const leavesData: Leave[] = [
        { id: "1", type: "Sick Leave", date: "Mar 20, 2025", status: "Approved", description: "Fever recovery" },
        { id: "2", type: "Annual Leave", date: "Apr 05, 2025", status: "Pending", description: "Family vacation" },
        { id: "3", type: "Casual Leave", date: "Mar 25, 2025", status: "Rejected", description: "Personal work" },
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Approved":
                return { backgroundColor: "#28a745", color: "#fff" };
            case "Pending":
                return { backgroundColor: "#ff9800", color: "#fff" };
            case "Rejected":
                return { backgroundColor: "#dc3545", color: "#fff" };
            default:
                return {};
        }
    };

    return (
        <FlatList
            data={leavesData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardType}>{item.type}</Text>
                        <Text style={[styles.statusBadge, getStatusStyle(item.status)]}>{item.status}</Text>
                    </View>
                    <Text style={styles.cardDate}>{item.date}</Text>
                    <Text style={styles.cardDesc}>{item.description}</Text>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1.5,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    cardType: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 15,
        fontSize: 12,
        fontWeight: "bold",
    },
    cardDate: {
        fontSize: 14,
        color: "#555",
        marginBottom: 5,
    },
    cardDesc: {
        fontSize: 12,
        color: "#666",
    },
});

export default LeavesTab;