/* eslint-disable import/no-unresolved */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AnalysisReport from "./components/AnalysisReport";

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

export default function AnalysisPage() {
  const [records, setRecords] = useState<RecordItem[]>([]);

  // アプリが最初に読み込まれた時に一度だけ実行される処理
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
    <View style={[styles.container, styles.background]}>
      <AnalysisReport records={records} />
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
});
