/* eslint-disable import/no-unresolved */
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { moderateScale } from "../utils/responsive";

interface BasicStatsProps {
  total: number;
  topLocation: string;
  topAction: string;
}

export default function BasicStats({
  total,
  topLocation,
  topAction,
}: BasicStatsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>基本統計</Text>
      <View style={styles.reportItem}>
        <Text style={styles.label}>総記録数:</Text>
        <Text style={styles.value}>{total}件</Text>
      </View>
      <View style={styles.reportItem}>
        <Text style={styles.label}>最も多い場所:</Text>
        <Text style={styles.value}>{topLocation}</Text>
      </View>
      <View style={styles.reportItem}>
        <Text style={styles.label}>最も多い対処法:</Text>
        <Text style={styles.value}>{topAction}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: moderateScale(20),
    padding: moderateScale(10),
    backgroundColor: "#f9f9f9",
    borderRadius: moderateScale(8),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    marginBottom: moderateScale(10),
    color: "#333",
  },
  reportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(6),
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#555",
    flex: 1,
  },
  value: {
    fontSize: moderateScale(14),
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
});
