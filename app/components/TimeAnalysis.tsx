/* eslint-disable import/no-unresolved */
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { moderateScale } from "../utils/responsive";

interface TimeAnalysis {
  timeSlots: { [key: string]: number };
  weekdays: { [key: string]: number };
  monthly: { [key: string]: number };
}

interface TimeAnalysisProps {
  timeAnalysis: TimeAnalysis;
}

export default function TimeAnalysisComponent({
  timeAnalysis,
}: TimeAnalysisProps) {
  // チャートデータの検証関数
  const validateChartData = (data: number[]): number[] => {
    return data.filter(
      (value) =>
        typeof value === "number" &&
        !isNaN(value) &&
        isFinite(value) &&
        value >= 0
    );
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  const screenWidth = Dimensions.get("window").width;
  // 利用可能な幅を計算: 画面幅 - 左右マージン(20) - 左右パディング(30) - セクションパディング(20) = 画面幅 - 70
  const chartWidth = screenWidth - moderateScale(70);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>時間軸分析</Text>

      <Text style={styles.subTitle}>時間帯別回数</Text>
      {(() => {
        const labels = Object.keys(timeAnalysis.timeSlots);
        const data = validateChartData(Object.values(timeAnalysis.timeSlots));
        return labels.length > 0 &&
          data.length > 0 &&
          labels.length === data.length ? (
          <LineChart
            data={{
              labels,
              datasets: [{ data }],
            }}
            width={chartWidth}
            height={moderateScale(200)}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        ) : (
          <Text style={styles.noData}>データがありません</Text>
        );
      })()}

      <Text style={styles.subTitle}>曜日別回数</Text>
      {(() => {
        const labels = Object.keys(timeAnalysis.weekdays);
        const data = validateChartData(Object.values(timeAnalysis.weekdays));
        return labels.length > 0 &&
          data.length > 0 &&
          labels.length === data.length ? (
          <LineChart
            data={{
              labels,
              datasets: [{ data }],
            }}
            width={chartWidth}
            height={moderateScale(200)}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        ) : (
          <Text style={styles.noData}>データがありません</Text>
        );
      })()}

      <Text style={styles.subTitle}>月次トレンド</Text>
      {(() => {
        const allLabels = Object.keys(timeAnalysis.monthly);
        const allData = validateChartData(Object.values(timeAnalysis.monthly));
        const labels = allLabels.slice(-6);
        const data = allData.slice(-6);
        return labels.length > 0 &&
          data.length > 0 &&
          labels.length === data.length ? (
          <LineChart
            data={{
              labels,
              datasets: [{ data }],
            }}
            width={chartWidth}
            height={moderateScale(200)}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        ) : (
          <Text style={styles.noData}>データがありません</Text>
        );
      })()}
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
  subTitle: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    marginBottom: moderateScale(8),
    marginTop: moderateScale(10),
    color: "#555",
  },
  noData: {
    fontSize: moderateScale(14),
    color: "#999",
    textAlign: "center",
    marginVertical: moderateScale(10),
  },
  chart: {
    marginVertical: moderateScale(10),
    borderRadius: moderateScale(8),
  },
});
