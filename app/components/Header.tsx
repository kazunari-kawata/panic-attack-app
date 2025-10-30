/* eslint-disable import/no-unresolved */
import { usePathname } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { hp, moderateScale, wp } from "../utils/responsive";

// ページ名のマッピング
const pageNames: { [key: string]: string } = {
  "/": "記録作成",
  "/records": "記録一覧",
  "/analysis": "分析",
  "/breathing": "呼吸法",
  "/checklist": "外出前チェックリスト",
  "/favorites": "お気に入り",
};

export default function Header() {
  const pathname = usePathname();
  const currentPageName = pageNames[pathname] || "パニック発作管理";

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{currentPageName}</Text>
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
