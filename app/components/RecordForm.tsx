/* eslint-disable import/no-unresolved */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { hp, moderateScale, wp } from "../utils/responsive";
import TimePicker from "./TimePicker";

interface RecordItem {
  id: string;
  date: string;
  time: string;
  location: string;
  feeling: string;
  action: string;
}

interface RecordFormProps {
  editingRecord: RecordItem | null;
  time: string;
  setTime: (time: string) => void;
  location: string;
  setLocation: (location: string) => void;
  feeling: string;
  setFeeling: (feeling: string) => void;
  action: string;
  setAction: (action: string) => void;
  onSave: () => void;
  onCancel: () => void;
  scrollToInput: (scrollY: number) => void;
  scrollViewRef: React.RefObject<ScrollView | null>;
}

export default function RecordForm({
  editingRecord,
  time,
  setTime,
  location,
  setLocation,
  feeling,
  setFeeling,
  action,
  setAction,
  onSave,
  onCancel,
  scrollToInput,
  scrollViewRef,
}: RecordFormProps) {
  // 保存ボタンへのref
  const saveButtonRef = useRef<View>(null);

  // 現在フォーカスされている入力欄のインデックス
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleScrollToFocusedInput = useCallback(() => {
    // 保存ボタンの位置を相対値で計算
    const titleHeight = hp(1.5); // タイトルのmarginBottom
    const calendarHeight = hp(25); // カレンダーの推定高さ
    const inputTotalHeight = hp(6.3) * 4; // 4つの入力欄（高さ5 + マージン1.3）
    const buttonRowMargin = hp(1.3); // ボタン行のmarginTop
    const estimatedButtonPosition =
      titleHeight + calendarHeight + inputTotalHeight + buttonRowMargin;

    console.log("Using estimated button position:", estimatedButtonPosition);
    scrollToInput(estimatedButtonPosition);
  }, [scrollToInput]);

  // キーボード表示時の処理
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        if (focusedIndex !== null) {
          handleScrollToFocusedInput();
        }
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
    };
  }, [focusedIndex, handleScrollToFocusedInput]);

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };
  return (
    <View style={styles.formContainer}>
      {/* 時間選択コンポーネント */}
      <TimePicker time={time} onTimeChange={setTime} placeholder="時間を選択" />

      <TextInput
        style={styles.input}
        placeholder="どこで？（例: 電車の中）"
        placeholderTextColor="gray"
        value={location}
        onChangeText={setLocation}
        onFocus={() => handleFocus(1)}
      />

      <TextInput
        style={styles.input}
        placeholder="どう感じたか？（例: 動悸がした）"
        placeholderTextColor="gray"
        value={feeling}
        onChangeText={setFeeling}
        onFocus={() => handleFocus(2)}
      />

      <TextInput
        style={styles.input}
        placeholder="どう対処したか？（例: 深呼吸をした）"
        placeholderTextColor="gray"
        value={action}
        onChangeText={setAction}
        onFocus={() => handleFocus(3)}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          ref={saveButtonRef}
          style={styles.button}
          onPress={onSave}
        >
          <Text style={styles.buttonText}>
            {editingRecord ? "この内容で更新する" : "この内容で保存する"}
          </Text>
        </TouchableOpacity>
        {editingRecord && (
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              キャンセル
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    paddingBottom: hp(2.5),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    marginBottom: hp(1.3),
  },
  input: {
    height: hp(5),
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: hp(1.3),
    paddingHorizontal: wp(2.5),
    borderRadius: moderateScale(5),
    backgroundColor: "white",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: hp(1.3),
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: hp(1.3),
    paddingHorizontal: wp(5),
    borderRadius: moderateScale(5),
    minWidth: wp(25),
    alignItems: "center",
  },
  buttonText: {
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
    color: "#666666",
  },
});
