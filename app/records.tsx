/* eslint-disable import/no-unresolved */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "./components/Menu";
import RecordList from "./components/RecordList";

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
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // アプリが最初に読み込まれた時に一度だけ実行される処理
  useEffect(() => {
    loadRecords();
  }, []);

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

  // 選択した日の記録を取得
  const selectedDayRecords = records.filter(
    (record) => record.date === selectedDate
  );

  // 編集ハンドラー（RecordListから呼ばれる）
  const handleEdit = (record: RecordItem) => {
    // 編集はindexページで行うので、ここでは何もしないか、遷移
    // 今回は編集ボタンを無効化するか、メッセージを表示
    alert("編集は記録作成ページで行ってください。");
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
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <RecordList
        selectedDate={selectedDate}
        records={selectedDayRecords}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Menu />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingTop: 50,
  },
});
