/* eslint-disable import/no-unresolved */
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { hp, moderateScale, wp } from "../utils/responsive";

interface TimePickerProps {
  time: string;
  onTimeChange: (time: string) => void;
  placeholder?: string;
}

export default function TimePicker({
  time,
  onTimeChange,
  placeholder = "時間を選択",
}: TimePickerProps) {
  // ドラムロール用の状態
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timeDate, setTimeDate] = useState(() => {
    // timeの文字列（HH:MM）をDateオブジェクトに変換
    if (time && time.includes(":")) {
      const [hours, minutes] = time.split(":").map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
      }
    }
    // デフォルトは現在時刻
    return new Date();
  });

  // 一時的な時間選択用の状態
  const [tempTimeDate, setTempTimeDate] = useState(timeDate);

  // 時間選択ボタンのハンドラー
  const showTimePicker = () => {
    setTempTimeDate(timeDate);
    setDatePickerOpen(true);
  };

  // ドラムロール時間変更ハンドラー（一時的な変更）
  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempTimeDate(selectedDate);
    }
  };

  // 時間確定ハンドラー
  const confirmTime = () => {
    setTimeDate(tempTimeDate);
    const timeString = tempTimeDate.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
    onTimeChange(timeString);
    setDatePickerOpen(false);
  };

  // キャンセルハンドラー
  const cancelTime = () => {
    setTempTimeDate(timeDate);
    setDatePickerOpen(false);
  };

  // 背景タップで確定
  const closeTimePicker = () => {
    confirmTime();
  };

  // timeプロパティが変更された時にtimeDateを同期
  useEffect(() => {
    if (time && time.includes(":")) {
      const [hours, minutes] = time.split(":").map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        setTimeDate(date);
        setTempTimeDate(date);
      }
    }
  }, [time]);

  return (
    <>
      {/* 時間選択ボタン */}
      <TouchableOpacity style={styles.timeButton} onPress={showTimePicker}>
        <Text style={styles.timeButtonText}>{time || placeholder}</Text>
      </TouchableOpacity>

      {/* ドラムロールピッカーのモーダル */}
      <Modal
        visible={datePickerOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelTime}
      >
        <TouchableWithoutFeedback onPress={closeTimePicker}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.pickerContainer}>
                <View style={styles.dateTimePickerWrapper}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={tempTimeDate}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={handleTimeChange}
                    style={styles.dateTimePicker}
                    textColor="#000000"
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={cancelTime}
                  >
                    <Text style={styles.cancelButtonText}>キャンセル</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={confirmTime}
                  >
                    <Text style={styles.confirmButtonText}>確定</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  timeButton: {
    height: hp(5),
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: hp(1.3),
    paddingHorizontal: wp(2.5),
    borderRadius: moderateScale(5),
    backgroundColor: "white",
    justifyContent: "center",
  },
  timeButtonText: {
    fontSize: moderateScale(16),
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: moderateScale(10),
    padding: wp(5),
    alignItems: "center",
    minWidth: wp(80),
    maxWidth: wp(90),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateTimePickerWrapper: {
    backgroundColor: "white",
    borderRadius: moderateScale(5),
    padding: wp(2),
    minHeight: hp(25),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  dateTimePicker: {
    backgroundColor: "white",
    height: hp(20),
    width: wp(70),
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: hp(2),
    gap: wp(3),
  },
  button: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    borderRadius: moderateScale(5),
    minWidth: wp(20),
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  confirmButtonText: {
    color: "white",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: moderateScale(16),
  },
});
