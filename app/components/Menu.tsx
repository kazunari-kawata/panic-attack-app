/* eslint-disable import/no-unresolved */
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Menu = () => {
  return (
    <View style={styles.fixedMenu}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/checklist")}
      >
        <Ionicons name="checkmark-circle-outline" size={24} color="#007bff" />
        <Text style={styles.menuText}>チェックリスト</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/")}
      >
        <Ionicons name="add-circle-outline" size={24} color="#007bff" />
        <Text style={styles.menuText}>記録作成</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/records")}
      >
        <Ionicons name="list-outline" size={24} color="#007bff" />
        <Text style={styles.menuText}>記録一覧</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/breathing")}
      >
        <Ionicons name="heart-outline" size={24} color="#007bff" />
        <Text style={styles.menuText}>呼吸</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedMenu: {
    height: 80,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingTop: 5,
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#007bff",
    marginTop: 4,
  },
});

export default Menu;
