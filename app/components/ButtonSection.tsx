/* eslint-disable import/no-unresolved */
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp, moderateScale, wp } from "../utils/responsive";

interface ButtonSectionProps {
  onShowAddInput: () => void;
  onResetAllChecks: () => void;
}

export default function ButtonSection({
  onShowAddInput,
  onResetAllChecks,
}: ButtonSectionProps) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.addButton} onPress={onShowAddInput}>
        <Ionicons
          name="add-circle-outline"
          size={moderateScale(20)}
          color="white"
        />
        <Text style={styles.addButtonText}>項目追加</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resetButton} onPress={onResetAllChecks}>
        <Ionicons
          name="refresh-outline"
          size={moderateScale(20)}
          color="white"
        />
        <Text style={styles.resetButtonText}>リセット</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(2.5),
    gap: wp(4),
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: moderateScale(5),
    gap: wp(1),
  },
  addButtonText: {
    color: "white",
    fontSize: moderateScale(14),
    fontWeight: "bold",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: moderateScale(5),
    gap: wp(1),
  },
  resetButtonText: {
    color: "white",
    fontSize: moderateScale(14),
    fontWeight: "bold",
  },
});
