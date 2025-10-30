/* eslint-disable import/no-unresolved */
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale } from "../utils/responsive";

interface RecordItem {
  id: string;
  date: string;
  time: string;
  location: string;
  feeling: string | string[];
  action: string | string[];
}

interface HeatmapCalendarProps {
  records: any[]; // 展開されたレコードを受け取る
}

export default function HeatmapCalendar({ records }: HeatmapCalendarProps) {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

  // 選択された月の日数を取得
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  // 選択された月の発作日をカウント
  const attackDays = records
    .filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getFullYear() === selectedYear &&
        recordDate.getMonth() === selectedMonth
      );
    })
    .reduce((acc, record) => {
      const day = new Date(record.date).getDate();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });

  // 最大発作回数を取得（色の濃度計算用）
  const maxAttacks = Math.max(...Object.values(attackDays), 0);

  // 月を変更する関数
  const changeMonth = (direction: "prev" | "next") => {
    setSelectedMonth((prev) => {
      let newMonth = prev;
      let newYear = selectedYear;

      if (direction === "prev") {
        newMonth = prev - 1;
        if (newMonth < 0) {
          newMonth = 11;
          newYear = selectedYear - 1;
        }
      } else {
        newMonth = prev + 1;
        if (newMonth > 11) {
          newMonth = 0;
          newYear = selectedYear + 1;
        }
      }

      setSelectedYear(newYear);
      return newMonth;
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ヒートマップカレンダー</Text>
      <View style={styles.calendarContainer}>
        {/* 月選択ボタン */}
        <View style={styles.monthSelector}>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => changeMonth("prev")}
          >
            <Text style={styles.monthButtonText}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.calendarTitle}>
            {selectedYear}年{selectedMonth + 1}月の発作ヒートマップ
          </Text>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => changeMonth("next")}
          >
            <Text style={styles.monthButtonText}>▶</Text>
          </TouchableOpacity>
        </View>
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
                  new Date(selectedYear, selectedMonth, 1).getDay()) /
                  7
              ),
            },
            (_, weekIndex) => (
              <View key={weekIndex} style={styles.calendarRow}>
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const dayNumber =
                    weekIndex * 7 +
                    dayIndex -
                    new Date(selectedYear, selectedMonth, 1).getDay() +
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
                              ? `rgba(194, 166, 140, ${0.3 + intensity * 0.7})`
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
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(10),
  },
  monthButton: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(5),
    marginHorizontal: moderateScale(10),
  },
  monthButtonText: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "black",
  },
  calendarTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    textAlign: "center",
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
});
