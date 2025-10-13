/* eslint-disable import/no-unresolved */
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { hp, moderateScale, wp } from "../utils/responsive";

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
}: RecordFormProps) {
  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="時間（例: 14:30）"
        placeholderTextColor="gray"
        value={time}
        onChangeText={setTime}
      />
      <TextInput
        style={styles.input}
        placeholder="どこで？（例: 電車の中）"
        placeholderTextColor="gray"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="どう感じたか？（例: 動悸がした）"
        placeholderTextColor="gray"
        value={feeling}
        onChangeText={setFeeling}
      />
      <TextInput
        style={styles.input}
        placeholder="どう対処したか？（例: 深呼吸をした）"
        placeholderTextColor="gray"
        value={action}
        onChangeText={setAction}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={onSave}>
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
