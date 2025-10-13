/* eslint-disable import/no-unresolved */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import RecordList from "./components/RecordList";
import TabBar from "./components/TabBar";

// 保存するデータのキーを定義します。
const STORAGE_KEY = "@panic_records";

// 記録の型定義
interface RecordItem {
  id: string;
  date: string;
  time: string;
  location: string;
  feeling: string;
  action: string;
}

export default function RecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [activeTab, setActiveTab] = useState<
    "week" | "month" | "3months" | "6months" | "year"
  >("month");

  // タブの定義
  const tabs = [
    { key: "week", label: "今週" },
    { key: "month", label: "今月" },
    { key: "3months", label: "3ヶ月" },
    { key: "6months", label: "6ヶ月" },
    { key: "year", label: "1年" },
  ] as const;

  // アプリが最初に読み込まれた時に一度だけ実行される処理
  useEffect(() => {
    loadRecords();
  }, []);

  // ページがフォーカスされたときにデータを再読み込み
  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [])
  );

  // AsyncStorageからデータを読み込む関数
  const loadRecords = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) {
        const loadedRecords = JSON.parse(jsonValue);
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

  // 期間で記録をフィルタリングする関数
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
      default:
        return records;
    }

    return records.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate;
    });
  };

  // 期間でフィルタリングしてソートした記録を取得
  const getFilteredRecords = (): RecordItem[] => {
    const filtered = filterRecordsByPeriod(records, activeTab);
    return filtered.sort((a, b) => {
      // 日付を比較
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) {
        return dateCompare; // 日付が異なる場合は日付順
      }

      // 日付が同じ場合は時間を比較
      const timeA = a.time || "00:00";
      const timeB = b.time || "00:00";
      return timeA.localeCompare(timeB);
    });
  };

  // 編集ハンドラー（RecordListから呼ばれる）
  const handleEdit = async (record: RecordItem) => {
    // 編集データをAsyncStorageに保存して、indexページに遷移
    try {
      await AsyncStorage.setItem("@editing_record", JSON.stringify(record));
      router.push("/");
    } catch (e) {
      console.error("Failed to set editing record.", e);
    }
  };

  // 削除ハンドラー
  const handleDelete = async (id: string) => {
    // 削除処理（RecordListから呼ばれる）
    const newRecords = records.filter((record) => record.id !== id);
    setRecords(newRecords);
    const jsonValue = JSON.stringify(newRecords);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  };

  return (
    <View style={[styles.container, styles.background]}>
      <TabBar tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />

      {/* 記録リスト */}
      <RecordList
        records={getFilteredRecords()}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </View>
  );
}

// スタイル定義
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    backgroundColor: "#e6f3ff", // 薄い落ち着いた青
  },
});
