/* eslint-disable import/no-unresolved */
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp, moderateScale } from "../utils/responsive";

const Menu = () => {
  return (
    <View style={styles.fixedMenu}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/checklist")}
      >
        <Feather name="check-circle" size={moderateScale(24)} color="#007bff" />
        <Text style={styles.menuText}>外出前</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/")}
      >
        <Feather name="plus-circle" size={moderateScale(24)} color="#007bff" />
        <Text style={styles.menuText}>記録作成</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/records")}
      >
        <Feather name="list" size={moderateScale(24)} color="#007bff" />
        <Text style={styles.menuText}>記録一覧</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/breathing")}
      >
        <Feather name="wind" size={moderateScale(24)} color="#007bff" />
        <Text style={styles.menuText}>深呼吸</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/analysis")}
      >
        <Feather name="bar-chart-2" size={moderateScale(24)} color="#007bff" />
        <Text style={styles.menuText}>分析</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/favorites")}
      >
        <Feather name="heart" size={moderateScale(24)} color="#007bff" />
        <Text style={styles.menuText}>お気に入り</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedMenu: {
    height: hp(10),
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingTop: hp(0.6),
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    fontSize: moderateScale(12),
    fontWeight: "bold",
    color: "#007bff",
    marginTop: hp(0.5),
  },
});

export default Menu;
