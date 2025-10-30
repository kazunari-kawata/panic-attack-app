/* eslint-disable import/no-unresolved */
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { moderateScale } from "../utils/responsive";

interface RecordItem {
  id: string;
  date: string;
  time: string;
  location: string;
  feeling: string | string[];
  action: string | string[];
}

interface PieChartsSectionProps {
  records: any[]; // 展開されたレコードを受け取る
}

export default function PieChartsSection({ records }: PieChartsSectionProps) {
  // ランダムカラーを生成する関数
  const getRandomColor = (index: number) => {
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#FF6384",
      "#C9CBCF",
      "#4BC0C0",
      "#FF6384",
    ];
    return colors[index % colors.length];
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
      <Text style={styles.sectionTitle}>割合分析</Text>

      <Text style={styles.subTitle}>場所の割合</Text>
      {(() => {
        const locationData = Object.entries(
          records.reduce((acc, record) => {
            acc[record.location] = (acc[record.location] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number })
        ).map(([label, value], index) => ({
          name: label,
          population: value,
          color: getRandomColor(index),
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        }));

        return locationData.length > 0 ? (
          <PieChart
            data={locationData}
            width={chartWidth}
            height={moderateScale(200)}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        ) : (
          <Text style={styles.noData}>データがありません</Text>
        );
      })()}

      <Text style={styles.subTitle}>症状の割合</Text>
      {(() => {
        const feelingData = Object.entries(
          records.reduce((acc, record) => {
            acc[record.feeling] = (acc[record.feeling] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number })
        ).map(([label, value], index) => ({
          name: label,
          population: value,
          color: getRandomColor(index),
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        }));

        return feelingData.length > 0 ? (
          <PieChart
            data={feelingData}
            width={chartWidth}
            height={moderateScale(200)}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        ) : (
          <Text style={styles.noData}>データがありません</Text>
        );
      })()}

      <Text style={styles.subTitle}>対処法の割合</Text>
      {(() => {
        const actionData = Object.entries(
          records.reduce((acc, record) => {
            acc[record.action] = (acc[record.action] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number })
        ).map(([label, value], index) => ({
          name: label,
          population: value,
          color: getRandomColor(index),
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        }));

        return actionData.length > 0 ? (
          <PieChart
            data={actionData}
            width={chartWidth}
            height={moderateScale(200)}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
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
});
