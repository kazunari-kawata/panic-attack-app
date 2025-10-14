/* eslint-disable import/no-unresolved */

import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { moderateScale } from "../utils/responsive";

interface CorrelationData {
  [key: string]: { [key: string]: number };
}

interface CorrelationAnalysisProps {
  locationFeelingCorrelation: CorrelationData;
  feelingActionCorrelation: CorrelationData;
}

export default function CorrelationAnalysis({
  locationFeelingCorrelation,
  feelingActionCorrelation,
}: CorrelationAnalysisProps) {
  const getTopCorrelation = (correlation: CorrelationData) => {
    const results: {
      [key: string]: { item: string; count: number; total: number };
    } = {};
    Object.keys(correlation).forEach((key) => {
      const subData = correlation[key];
      const total = Object.values(subData).reduce(
        (sum, val) => sum + (typeof val === "number" ? val : 0),
        0
      );
      if (Object.keys(subData).length > 0) {
        const validEntries = Object.entries(subData).filter(
          ([_, value]) =>
            typeof value === "number" && !isNaN(value) && isFinite(value)
        );
        if (validEntries.length > 0) {
          const [topItem, topCount] = validEntries.reduce((a, b) =>
            a[1] > b[1] ? a : b
          );
          results[key] = { item: topItem, count: topCount, total };
        }
      }
    });
    return results;
  };

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
    barPercentage: 0.7,
  };

  const screenWidth = Dimensions.get("window").width;
  // 利用可能な幅を計算: 画面幅 - 左右マージン(20) - 左右パディング(30) - セクションパディング(20) = 画面幅 - 70
  const chartWidth = screenWidth - moderateScale(70);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>相関分析</Text>

      <Text style={styles.subTitle}>場所別の主な症状</Text>
      {(() => {
        const correlationData = getTopCorrelation(locationFeelingCorrelation);
        const top5Entries = Object.entries(correlationData)
          .sort(([, a], [, b]) => b.total - a.total)
          .slice(0, 5);
        const chartLabels = top5Entries.map(([key]) => key);
        const chartData = validateChartData(
          top5Entries.map(([, value]) => value.total)
        );
        return Object.keys(correlationData).length > 0 ? (
          <>
            {chartLabels.length > 0 && chartData.length > 0 && (
              <BarChart
                data={{
                  labels: chartLabels,
                  datasets: [{ data: chartData }],
                }}
                width={chartWidth}
                height={moderateScale(400)}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig}
                style={styles.chart}
                showValuesOnTopOfBars
                verticalLabelRotation={45}
                fromZero={true}
              />
            )}
            {Object.entries(correlationData).map(([location, data]) => (
              <View key={location} style={styles.reportItem}>
                <Text style={styles.label}>{location}:</Text>
                <Text style={styles.value}>
                  {data.item} ({data.count}回 / 総{data.total}回)
                </Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.noData}>データがありません</Text>
        );
      })()}

      <Text style={styles.subTitle}>症状別の主な対処法</Text>
      {(() => {
        const correlationData = getTopCorrelation(feelingActionCorrelation);
        const top5Entries = Object.entries(correlationData)
          .sort(([, a], [, b]) => b.total - a.total)
          .slice(0, 5);
        const chartLabels = top5Entries.map(([key]) => key);
        const chartData = validateChartData(
          top5Entries.map(([, value]) => value.total)
        );
        return Object.keys(correlationData).length > 0 ? (
          <>
            {chartLabels.length > 0 && chartData.length > 0 && (
              <BarChart
                data={{
                  labels: chartLabels,
                  datasets: [{ data: chartData }],
                }}
                width={chartWidth}
                height={moderateScale(400)}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig}
                style={styles.chart}
                showValuesOnTopOfBars
                verticalLabelRotation={45}
              />
            )}
            {Object.entries(correlationData).map(([feeling, data]) => (
              <View key={feeling} style={styles.reportItem}>
                <Text style={styles.label}>{feeling}:</Text>
                <Text style={styles.value}>
                  {data.item} ({data.count}回 / 総{data.total}回)
                </Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.noData}>データなし</Text>
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
  reportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(6),
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#555",
    flex: 0.3,
  },
  value: {
    fontSize: moderateScale(14),
    color: "#333",
    flex: 0.7,
    textAlign: "right",
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
    paddingRight: moderateScale(30),
  },
});
