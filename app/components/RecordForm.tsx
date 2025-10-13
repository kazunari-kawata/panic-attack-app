/* eslint-disable import/no-unresolved */
import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

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
        <Button
          title={editingRecord ? "この内容で更新する" : "この内容で保存する"}
          onPress={onSave}
        />
        {editingRecord && (
          <Button title="キャンセル" color="gray" onPress={onCancel} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
