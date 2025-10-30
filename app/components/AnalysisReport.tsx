/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { moderateScale } from "../utils/responsive";
import BasicStats from "./BasicStats";
import CorrelationAnalysis from "./CorrelationAnalysis";
import HeatmapCalendar from "./HeatmapCalendar";
import PieChartsSection from "./PieChartsSection";
import TimeAnalysis from "./TimeAnalysis";

interface AnalysisReportProps {
  records: any[]; // 展開されたレコードを受け取る
  originalRecordCount: number; // 元のレコード数
}

interface CorrelationData {
  [key: string]: { [key: string]: number };
}

interface TimeAnalysisData {
  timeSlots: { [key: string]: number };
  weekdays: { [key: string]: number };
  monthly: { [key: string]: number };
}

export default function AnalysisReport({
  records,
  originalRecordCount,
}: AnalysisReportProps) {
  const [analysis, setAnalysis] = useState({
    total: 0,
    topLocation: "---",
    topAction: "---",
    locationFeelingCorrelation: {} as CorrelationData,
    feelingActionCorrelation: {} as CorrelationData,
    timeAnalysis: {
      timeSlots: {},
      weekdays: {},
      monthly: {},
    } as TimeAnalysisData,
  });

  useEffect(() => {
    if (records.length === 0) {
      setAnalysis({
        total: 0,
        topLocation: "データなし",
        topAction: "データなし",
        locationFeelingCorrelation: {},
        feelingActionCorrelation: {},
        timeAnalysis: {
          timeSlots: {},
          weekdays: {},
          monthly: {},
        },
      });
      return;
    }

    // 最も頻度の高い場所の計算
    const locationCount: { [key: string]: number } = {};
    records.forEach((record) => {
      if (record.location) {
        locationCount[record.location] =
          (locationCount[record.location] || 0) + 1;
      }
    });
    const topLocation =
      Object.keys(locationCount).length > 0
        ? Object.keys(locationCount).reduce(
            (a, b) => (locationCount[a] > locationCount[b] ? a : b),
            "---"
          )
        : "---";

    // 最も頻度の高い対処法の計算
    const actionCount: { [key: string]: number } = {};
    records.forEach((record) => {
      if (record.action) {
        actionCount[record.action] = (actionCount[record.action] || 0) + 1;
      }
    });
    const topAction =
      Object.keys(actionCount).length > 0
        ? Object.keys(actionCount).reduce(
            (a, b) => (actionCount[a] > actionCount[b] ? a : b),
            "---"
          )
        : "---";

    // 場所×感情のクロス分析
    const locationFeeling: CorrelationData = {};
    records.forEach((record) => {
      if (!locationFeeling[record.location]) {
        locationFeeling[record.location] = {};
      }
      locationFeeling[record.location][record.feeling] =
        (locationFeeling[record.location][record.feeling] || 0) + 1;
    });

    // 感情×対処法のクロス分析
    const feelingAction: CorrelationData = {};
    records.forEach((record) => {
      if (!feelingAction[record.feeling]) {
        feelingAction[record.feeling] = {};
      }
      feelingAction[record.feeling][record.action] =
        (feelingAction[record.feeling][record.action] || 0) + 1;
    });

    // 時間軸分析
    const timeSlots: { [key: string]: number } = {
      "朝(6-12)": 0,
      "昼(12-18)": 0,
      "夕(18-22)": 0,
      "夜(22-6)": 0,
    };
    const weekdays: { [key: string]: number } = {
      日: 0,
      月: 0,
      火: 0,
      水: 0,
      木: 0,
      金: 0,
      土: 0,
    };
    const monthly: { [key: string]: number } = {};

    records.forEach((record) => {
      // 時間帯分析
      if (record.time && record.time.includes(":")) {
        const hour = parseInt(record.time.split(":")[0]);
        if (!isNaN(hour)) {
          if (hour >= 6 && hour < 12) timeSlots["朝(6-12)"]++;
          else if (hour >= 12 && hour < 18) timeSlots["昼(12-18)"]++;
          else if (hour >= 18 && hour < 22) timeSlots["夕(18-22)"]++;
          else timeSlots["夜(22-6)"]++;
        }
      }

      // 曜日分析
      if (record.date) {
        const date = new Date(record.date);
        if (!isNaN(date.getTime())) {
          const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
          weekdays[dayNames[date.getDay()]]++;
        }
      }

      // 月次分析
      if (record.date) {
        const date = new Date(record.date);
        if (!isNaN(date.getTime())) {
          const monthKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
          monthly[monthKey] = (monthly[monthKey] || 0) + 1;
        }
      }
    });

    setAnalysis({
      total: originalRecordCount, // 必ず元の記録数を使用
      topLocation,
      topAction,
      locationFeelingCorrelation: locationFeeling,
      feelingActionCorrelation: feelingAction,
      timeAnalysis: {
        timeSlots,
        weekdays,
        monthly,
      },
    });
  }, [records, originalRecordCount]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>分析レポート</Text>

      <BasicStats
        total={analysis.total}
        topLocation={analysis.topLocation}
        topAction={analysis.topAction}
      />

      <PieChartsSection records={records} />

      <CorrelationAnalysis
        locationFeelingCorrelation={analysis.locationFeelingCorrelation}
        feelingActionCorrelation={analysis.feelingActionCorrelation}
      />

      <TimeAnalysis timeAnalysis={analysis.timeAnalysis} />

      <HeatmapCalendar records={records} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: moderateScale(15),
    marginHorizontal: moderateScale(5),
    marginVertical: moderateScale(5),
    borderRadius: moderateScale(5),
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
    marginBottom: moderateScale(15),
    textAlign: "center",
    color: "#333",
  },
});
