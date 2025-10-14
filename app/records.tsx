import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { generateAndAddTestData } from "../faker";
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

  // AsyncStorageからデータを読み込む関数
  const loadRecords = useCallback(async () => {
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
  }, []);

  // アプリが最初に読み込まれた時に一度だけ実行される処理
  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // ページがフォーカスされたときにデータを再読み込み
  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords])
  );

  // テストデータを追加する関数
  const addTestData = async () => {
    try {
      await generateAndAddTestData();
      // データを再読み込み
      await loadRecords();
    } catch (e) {
      console.error("テストデータの追加に失敗しました", e);
      Alert.alert("エラー", "テストデータの投入に失敗しました。", [
        { text: "OK" },
      ]);
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
    Alert.alert(
      "記録の削除",
      "この記録を削除してもよろしいですか？\nこの操作は取り消すことができません。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除する",
          style: "destructive",
          onPress: async () => {
            // 削除処理（RecordListから呼ばれる）
            const newRecords = records.filter((record) => record.id !== id);
            setRecords(newRecords);
            const jsonValue = JSON.stringify(newRecords);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, styles.background]}>
      {/* テストデータ投入ボタン（一時的） */}
      <View style={styles.testButtonContainer}>
        <Text
          style={styles.testButton}
          onPress={() => {
            Alert.alert(
              "テストデータ投入",
              "現在のデータを上書きしてテストデータを投入しますか？",
              [
                { text: "キャンセル", style: "cancel" },
                { text: "投入する", onPress: addTestData },
              ]
            );
          }}
        >
          🧪 テストデータを投入する
        </Text>
      </View>

      {/* ヘッダー：タイトルとタブバー */}
      <View style={styles.header}>
        <Text style={styles.title}>記録一覧</Text>
        <TabBar tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />
      </View>

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
  testButtonContainer: {
    margin: 15,
    padding: 12,
    backgroundColor: "#fff3cd", // 薄い黄色の背景
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  testButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404", // 濃い黄色
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
