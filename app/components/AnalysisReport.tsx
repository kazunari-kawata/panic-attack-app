/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { moderateScale } from "../utils/responsive";

interface RecordItem {
  id: string;
  date: string;
  time: string;
  location: string;
  feeling: string;
  action: string;
}

interface AnalysisReportProps {
  records: RecordItem[];
}

export default function AnalysisReport({ records }: AnalysisReportProps) {
  const [analysis, setAnalysis] = useState({
    total: 0,
    topLocation: "---",
    topAction: "---",
  });

  useEffect(() => {
    // 総記録数の計算
    const total = records.length;

    // 最も頻度の高い場所の計算
    const locationCount: { [key: string]: number } = {};
    records.forEach((record) => {
      locationCount[record.location] =
        (locationCount[record.location] || 0) + 1;
    });
    const topLocation = Object.keys(locationCount).reduce(
      (a, b) => (locationCount[a] > locationCount[b] ? a : b),
      "---"
    );

    // 最も頻度の高い対処法の計算
    const actionCount: { [key: string]: number } = {};
    records.forEach((record) => {
      actionCount[record.action] = (actionCount[record.action] || 0) + 1;
    });
    const topAction = Object.keys(actionCount).reduce(
      (a, b) => (actionCount[a] > actionCount[b] ? a : b),
      "---"
    );

    setAnalysis({
      total,
      topLocation: total > 0 ? topLocation : "データなし",
      topAction: total > 0 ? topAction : "データなし",
    });
  }, [records]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>分析レポート</Text>
      <View style={styles.reportItem}>
        <Text style={styles.label}>総記録数:</Text>
        <Text style={styles.value}>{analysis.total}件</Text>
      </View>
      <View style={styles.reportItem}>
        <Text style={styles.label}>最も多い場所:</Text>
        <Text style={styles.value}>{analysis.topLocation}</Text>
      </View>
      <View style={styles.reportItem}>
        <Text style={styles.label}>最も多い対処法:</Text>
        <Text style={styles.value}>{analysis.topAction}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: moderateScale(15),
    marginHorizontal: moderateScale(10),
    marginBottom: moderateScale(10),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: moderateScale(10),
    textAlign: "center",
    color: "#333",
  },
  reportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(8),
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: moderateScale(14),
    color: "#333",
  },
});
