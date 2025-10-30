/* eslint-disable import/no-unresolved */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AnalysisReport from "./components/AnalysisReport";
import TabBar from "./components/TabBar";
import { hp, moderateScale, wp } from "./utils/responsive";

// 保存するデータのキーを定義します。
const STORAGE_KEY = "@panic_records";

// 記録の型定義
interface RecordItem {
  id: string;
  date: string;
  time: string;
  location: string;
  feeling: string | string[];
  action: string | string[];
}

export default function AnalysisPage() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [activeTab, setActiveTab] = useState<
    "week" | "month" | "3months" | "6months" | "year" | "all"
  >("month");

  // タブの定義
  const tabs = [
    { key: "week", label: "今週" },
    { key: "month", label: "今月" },
    { key: "3months", label: "3ヶ月" },
    { key: "6months", label: "6ヶ月" },
    { key: "year", label: "1年" },
    { key: "all", label: "全期間" },
  ] as const;

  // 複数選択データを分析用に展開する関数
  const expandRecordsForAnalysis = (records: RecordItem[]) => {
    const expandedRecords: any[] = [];

    records.forEach((record) => {
      const feelings = Array.isArray(record.feeling)
        ? record.feeling
        : [record.feeling];
      const actions = Array.isArray(record.action)
        ? record.action
        : [record.action];

      // 感情と行動のすべての組み合わせでレコードを展開
      feelings.forEach((feeling) => {
        actions.forEach((action) => {
          expandedRecords.push({
            ...record,
            feeling: feeling,
            action: action,
          });
        });
      });
    });

    return expandedRecords;
  };

  // 期間で記録をフィルタリングする関数（records.tsxと同じロジック）
  const filterRecordsByPeriod = (
    records: RecordItem[],
    period: typeof activeTab
  ) => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "3months":
        startDate = new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);
        break;
      case "6months":
        startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case "all":
        return records; // 全期間の場合はフィルタリングしない
      default:
        return records;
    }

    return records.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate;
    });
  };

  // 期間でフィルタリングした記録を取得
  const getFilteredRecords = (): RecordItem[] => {
    return filterRecordsByPeriod(records, activeTab);
  }; // アプリが最初に読み込まれた時に一度だけ実行される処理
  useEffect(() => {
    loadRecords();
  }, []);

  // AsyncStorageからデータを読み込む関数
  const loadRecords = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      // データがあれば、JSON形式からオブジェクト形式に変換してstateにセット
      if (jsonValue !== null) {
        const loadedRecords = JSON.parse(jsonValue);
        // 既存の記録にtimeがない場合、デフォルト値を追加
        const updatedRecords = loadedRecords.map((record: any) => ({
          ...record,
          time: record.time || "",
        }));
        setRecords(updatedRecords);
      }
    } catch (e) {
      console.error("Failed to load records.", e);
    }
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー：タイトルとタブバー */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TabBar tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />
        </View>
        <Text style={styles.periodInfo}>
          {getFilteredRecords().length}件の記録分析を表示
        </Text>
      </View>

      <AnalysisReport
        records={expandRecordsForAnalysis(getFilteredRecords())}
        originalRecordCount={getFilteredRecords().length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    backgroundColor: "#e6f3ff", // 薄い落ち着いた青
  },
  header: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    paddingBottom: hp(1),
    backgroundColor: "e6f3ff",
    borderTopColor: "#e6f3ff",
    borderTopWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: hp(0.5),
  },
  title: {
    color: "#ffffff",
    fontSize: moderateScale(18),
    fontWeight: "bold",
    flex: 1,
  },
  periodInfo: {
    fontSize: moderateScale(12),
    color: "#ffffff",
    textAlign: "center",
    marginTop: hp(0.5),
  },
});
