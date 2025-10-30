/* eslint-disable import/no-unresolved */
import React from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { hp } from "../utils/responsive";

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
  // 今日の日付を取得
  const today = new Date().toISOString().split("T")[0];

  // markedDatesに今日と選択された日付のスタイリングを追加
  const enhancedMarkedDates = {
    ...markedDates,
    [today]: {
      ...markedDates[today],
      selected: today === selectedDate,
      selectedColor: "#007AFF",
      selectedTextColor: "white",
      marked: markedDates[today]?.marked || false,
      dotColor: markedDates[today]?.dotColor || "#007AFF",
    },
    [selectedDate]: {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: "#007AFF",
      selectedTextColor: "white",
      marked: markedDates[selectedDate]?.marked || false,
      dotColor: markedDates[selectedDate]?.dotColor || "#007AFF",
    },
  };

  return (
    <View style={styles.calendarContainer}>
      <Calendar
        onDayPress={(day) => onDateSelect(day.dateString)}
        markedDates={enhancedMarkedDates}
        theme={{
          todayTextColor: "#007AFF",
          selectedDayBackgroundColor: "#007AFF",
          selectedDayTextColor: "white",
          arrowColor: "#007AFF",
          monthTextColor: "#333",
          indicatorColor: "#007AFF",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    marginBottom: hp(2.5),
  },
});
