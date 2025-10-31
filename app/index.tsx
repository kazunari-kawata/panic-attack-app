import React, { useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CalendarView from "./components/CalendarView";
import RecordForm from "./components/RecordForm";
import { useRecordForm } from "./hooks/useRecordForm";
import { getMarkedDates } from "./utils/calendarUtils";
import { hp, moderateScale, wp } from "./utils/responsive";

export default function App() {
  const {
    selectedDate,
    editingRecord,
    time,
    setTime,
    location,
    setLocation,
    feeling,
    setFeeling,
    action,
    setAction,
    records,
    scrollViewRef,
    handleDateSelect,
    handleSaveRecord,
    handleCancel,
    scrollToInput,
    loadRecords,
  } = useRecordForm();

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  return (
    <View style={[styles.container, styles.background]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? hp(9) : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.contentContainer}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>
              {editingRecord ? "記録（編集）" : `${selectedDate}の記録`}
            </Text>

            <CalendarView
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              markedDates={getMarkedDates(records, selectedDate)}
            />
            <RecordForm
              editingRecord={editingRecord}
              time={time}
              setTime={setTime}
              location={location}
              setLocation={setLocation}
              feeling={feeling}
              setFeeling={setFeeling}
              action={action}
              setAction={setAction}
              onSave={handleSaveRecord}
              onCancel={handleCancel}
              scrollToInput={scrollToInput}
              scrollViewRef={scrollViewRef}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

// スタイル定義
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    backgroundColor: "#e6f3ff", // 薄い落ち着いた青
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(8),
    paddingTop: hp(1.5),
    paddingBottom: hp(2),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: hp(1.5),
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
