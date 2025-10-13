/* eslint-disable import/no-unresolved */
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { hp, moderateScale, wp } from "../utils/responsive";

interface AddItemFormProps {
  newItem: string;
  setNewItem: (text: string) => void;
  onAddItem: () => void;
  onCancel: () => void;
}

export default function AddItemForm({
  newItem,
  setNewItem,
  onAddItem,
  onCancel,
}: AddItemFormProps) {
  return (
    <View style={styles.addContainer}>
      <TextInput
        style={styles.input}
        value={newItem}
        onChangeText={setNewItem}
        placeholder="新しい項目を入力"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onAddItem}>
          <Ionicons
            name="add-circle-outline"
            size={moderateScale(20)}
            color="white"
          />
          <Text style={styles.buttonText}>追加</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Ionicons
            name="close-circle-outline"
            size={moderateScale(20)}
            color="#666"
          />
          <Text style={styles.cancelButtonText}>キャンセル</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addContainer: {
    marginTop: hp(2.5),
    padding: wp(2.5),
    backgroundColor: "white",
    borderRadius: moderateScale(5),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  input: {
    height: hp(5),
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: hp(1.3),
    paddingHorizontal: wp(2.5),
    borderRadius: moderateScale(5),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: wp(2),
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: hp(1),
    borderRadius: moderateScale(5),
    gap: wp(1),
  },
  buttonText: {
    color: "white",
    fontSize: moderateScale(14),
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: moderateScale(14),
    fontWeight: "bold",
  },
});
