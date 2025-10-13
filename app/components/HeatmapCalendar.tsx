/* eslint-disable import/no-unresolved */
import React from "react";
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

interface HeatmapCalendarProps {
  records: RecordItem[];
}

export default function HeatmapCalendar({ records }: HeatmapCalendarProps) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 今月の日数を取得
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // 今月の発作日をカウント
  const attackDays = records
    .filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getFullYear() === currentYear &&
        recordDate.getMonth() === currentMonth
      );
    })
    .reduce((acc, record) => {
      const day = new Date(record.date).getDate();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });

  // 最大発作回数を取得（色の濃度計算用）
  const maxAttacks = Math.max(...Object.values(attackDays), 0);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ヒートマップカレンダー</Text>
      <View style={styles.calendarContainer}>
        <Text style={styles.calendarTitle}>
          {currentYear}年{currentMonth + 1}月の発作ヒートマップ
        </Text>
        <View style={styles.calendarGrid}>
          {/* 曜日ヘッダー */}
          <View style={styles.weekdayHeader}>
            {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
              <Text key={day} style={styles.weekdayText}>
                {day}
              </Text>
            ))}
          </View>

          {/* カレンダーグリッド */}
          {Array.from(
            {
              length: Math.ceil(
                (daysInMonth +
                  new Date(currentYear, currentMonth, 1).getDay()) /
                  7
              ),
            },
            (_, weekIndex) => (
              <View key={weekIndex} style={styles.calendarRow}>
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const dayNumber =
                    weekIndex * 7 +
                    dayIndex -
                    new Date(currentYear, currentMonth, 1).getDay() +
                    1;
                  const isValidDay = dayNumber >= 1 && dayNumber <= daysInMonth;
                  const attacks = attackDays[dayNumber] || 0;
                  const intensity = maxAttacks > 0 ? attacks / maxAttacks : 0;

                  return (
                    <View
                      key={dayIndex}
                      style={[
                        styles.calendarDay,
                        !isValidDay && styles.calendarDayEmpty,
                        isValidDay && {
                          backgroundColor:
                            attacks > 0
                              ? `rgba(255, 59, 48, ${0.3 + intensity * 0.7})`
                              : "#f5f5f5",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          attacks > 0 && styles.calendarDayTextActive,
                        ]}
                      >
                        {isValidDay ? dayNumber : ""}
                      </Text>
                      {attacks > 1 && (
                        <Text style={styles.attackCount}>{attacks}</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            )
          )}
        </View>

        {/* 凡例 */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendText}>少ない</Text>
          <View style={styles.legendGradient}>
            <View
              style={[styles.legendColor, { backgroundColor: "#f5f5f5" }]}
            />
            <View
              style={[
                styles.legendColor,
                { backgroundColor: "rgba(255, 59, 48, 0.5)" },
              ]}
            />
            <View
              style={[
                styles.legendColor,
                { backgroundColor: "rgba(255, 59, 48, 0.8)" },
              ]}
            />
            <View
              style={[styles.legendColor, { backgroundColor: "#ff3b30" }]}
            />
          </View>
          <Text style={styles.legendText}>多い</Text>
        </View>
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
  calendarContainer: {
    marginTop: moderateScale(10),
  },
  calendarTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: moderateScale(10),
    color: "#333",
  },
  calendarGrid: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  weekdayHeader: {
    flexDirection: "row",
    marginBottom: moderateScale(5),
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    fontSize: moderateScale(12),
    fontWeight: "bold",
    color: "#666",
  },
  calendarRow: {
    flexDirection: "row",
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: moderateScale(1),
    borderRadius: moderateScale(4),
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  calendarDayEmpty: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  calendarDayText: {
    fontSize: moderateScale(12),
    color: "#333",
  },
  calendarDayTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  attackCount: {
    fontSize: moderateScale(8),
    color: "#fff",
    fontWeight: "bold",
    position: "absolute",
    top: 2,
    right: 2,
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(10),
  },
  legendText: {
    fontSize: moderateScale(12),
    color: "#666",
    marginHorizontal: moderateScale(5),
  },
  legendGradient: {
    flexDirection: "row",
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    overflow: "hidden",
  },
  legendColor: {
    flex: 1,
  },
});
