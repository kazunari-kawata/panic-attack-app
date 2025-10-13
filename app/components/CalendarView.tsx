/* eslint-disable import/no-unresolved */
import React from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";

interface CalendarViewProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  markedDates: { [key: string]: { marked: boolean; dotColor: string } };
}

export default function CalendarView({
  selectedDate,
  onDateSelect,
  markedDates,
}: CalendarViewProps) {
  return (
    <View style={styles.calendarContainer}>
      <Calendar
        onDayPress={(day) => onDateSelect(day.dateString)}
        markedDates={markedDates}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    marginBottom: 20,
  },
});
