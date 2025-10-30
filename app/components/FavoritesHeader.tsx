import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale } from "../utils/responsive";

interface FavoritesHeaderProps {
  isEditMode: boolean;
  onEditToggle: () => void;
}

export default function FavoritesHeader({
  isEditMode,
  onEditToggle,
}: FavoritesHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.subtitle}>心を落ち着かせるためのコンテンツ集</Text>
      <TouchableOpacity style={styles.editButton} onPress={onEditToggle}>
        <Ionicons
          name={isEditMode ? "checkmark-outline" : "create-outline"}
          size={moderateScale(20)}
          color="#007AFF"
        />
        <Text style={styles.editButtonText}>
          {isEditMode ? "完了" : "編集"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: moderateScale(20),
    backgroundColor: "#E3F2FD",
    alignItems: "center",
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: "#5DADE2",
    textAlign: "center",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(15),
    marginTop: moderateScale(10),
    borderWidth: 1,
    borderColor: "#BBDEFB",
  },
  editButtonText: {
    fontSize: moderateScale(14),
    color: "#007AFF",
    marginLeft: moderateScale(4),
  },
});