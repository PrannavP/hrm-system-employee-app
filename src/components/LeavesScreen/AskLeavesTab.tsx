import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableWithoutFeedback, Keyboard, ScrollView, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";

const AskLeavesTab = () => {
    const [leaveType, setLeaveType] = useState<string>("Sick Leave");
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [reason, setReason] = useState<string>("");

    const currentDate = moment().format("YYYY-MM-DD");

    const handleDateChange = (date: string) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (startDate && !endDate) {
            if (moment(date).isBefore(startDate)) {
                setStartDate(date);
            } else {
                setEndDate(date);
            }
        }
    };

    const getMarkedDates = () => {
        let markedDates: { [key: string]: any } = {};
        if (startDate) {
            markedDates[startDate] = { startingDay: true, color: "#007BFF", textColor: "#fff" };
        }
        if (endDate) {
            markedDates[endDate] = { endingDay: true, color: "#007BFF", textColor: "#fff" };
        }
        if (startDate && endDate) {
            let current = moment(startDate);
            while (current.isBefore(endDate)) {
                markedDates[current.format("YYYY-MM-DD")] = { color: "#007BFF", textColor: "#fff" };
                current = current.add(1, "day");
            }
        } else if (startDate) {
            markedDates[startDate] = { selected: true, color: "#007BFF", textColor: "#fff" };
        }
        return markedDates;
    };

    const handleSubmit = () => {
        if (!startDate || !reason) {
            alert("Please fill in all fields.");
            return;
        }

        // Log the user data, leave type, selected date range, and reason
        console.log("User Data:");
        console.log("Leave Type:", leaveType);
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate || startDate);
        console.log("Reason:", reason);

        // Handle submission logic here (e.g., send data to the server)
        alert(`Leave Request Submitted from ${startDate} to ${endDate || startDate}`);

        // Clear the input fields and reset the calendar
        setLeaveType("Sick Leave");
        setStartDate(null);
        setEndDate(null);
        setReason("");
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ScrollView style={styles.leaveRequestForm} showsVerticalScrollIndicator={false}>
                <Text style={styles.leaveFormHeader}>Apply for Leave</Text>
                <Text style={styles.leaveFormSubHeader}>Submit your leave request for approval</Text>

                {/* Leave Type */}
                <Text style={styles.label}>Leave Type</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={leaveType}
                        style={styles.picker}
                        onValueChange={(itemValue) => setLeaveType(itemValue)}
                    >
                        <Picker.Item label="Sick Leave" value="Sick Leave" />
                        <Picker.Item label="Annual Leave" value="Annual Leave" />
                        <Picker.Item label="Casual Leave" value="Casual Leave" />
                    </Picker>
                </View>

                {/* Calendar for Date Selection */}
                <Text style={styles.label}>Select Date</Text>
                <Calendar
                    current={currentDate}
                    minDate={currentDate}
                    onDayPress={(day: { dateString: string }) => handleDateChange(day.dateString)}
                    markingType={"period"}
                    markedDates={getMarkedDates()}
                />

                {/* Reason Text Input */}
                <Text style={styles.label}>Reason</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter reason for leave"
                    value={reason}
                    onChangeText={(text) => setReason(text)}
                    multiline
                />

                {/* Submit Button */}
                <Button title="Submit Leave Request" onPress={handleSubmit} />
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    leaveRequestForm: {
        marginTop: 20,
    },
    leaveFormHeader: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    leaveFormSubHeader: {
        fontSize: 14,
        color: "#666",
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 5,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        marginBottom: 20,
    },
    picker: {
        height: 50,
    },
    textInput: {
        height: 100,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
});

export default AskLeavesTab;