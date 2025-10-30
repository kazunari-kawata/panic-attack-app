import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale } from "../utils/responsive";

interface AddFavoriteFormProps {
  newTitle: string;
  newUrl: string;
  onTitleChange: (title: string) => void;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
}

export default function AddFavoriteForm({
  newTitle,
  newUrl,
  onTitleChange,
  onUrlChange,
  onSubmit,
}: AddFavoriteFormProps) {
  return (
    <View style={styles.addForm}>
      <Text style={styles.formTitle}>新しいお気に入りを追加</Text>

      <TextInput
        style={styles.input}
        placeholder="タイトル"
        value={newTitle}
        onChangeText={onTitleChange}
      />

      <TextInput
        style={styles.input}
        placeholder="URL"
        value={newUrl}
        onChangeText={onUrlChange}
        keyboardType="url"
      />

      <TouchableOpacity style={styles.addButton} onPress={onSubmit}>
        <Text style={styles.addButtonText}>追加</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addForm: {
    backgroundColor: "#FFFFFF",
    margin: moderateScale(15),
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  formTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#1565C0",
    marginBottom: moderateScale(15),
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#BBDEFB",
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    marginBottom: moderateScale(10),
    fontSize: moderateScale(14),
    backgroundColor: "#F0F8FF",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
});