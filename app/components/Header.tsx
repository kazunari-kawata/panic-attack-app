/* eslint-disable import/no-unresolved */
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { hp, moderateScale, wp } from "../utils/responsive";

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>「アプリ名」</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#5DADE2",
    paddingTop: hp(1.5),
    paddingBottom: hp(2.5),
    paddingHorizontal: wp(5),
    alignItems: "center",
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#fff",
  },
});
