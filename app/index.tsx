/* eslint-disable import/no-unresolved */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CalendarView from "./components/CalendarView";
import Menu from "./components/Menu";
import RecordForm from "./components/RecordForm";

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

export default function App() {
  const router = useRouter();
  // 状態（State）の定義
  // 記録のリストを管理するためのstate
  const [records, setRecords] = useState<RecordItem[]>([]);
  // 入力フォームの各項目を管理するためのstate
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // 今日の日付を初期値に
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const [location, setLocation] = useState("");
  const [feeling, setFeeling] = useState("");
  const [action, setAction] = useState("");
  const [editingRecord, setEditingRecord] = useState<RecordItem | null>(null);

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
      Alert.alert("エラー", "記録の読み込みに失敗しました。");
    }
  };

  // カレンダーにマークをつけるためのデータを作成
  const getMarkedDates = () => {
    const marked: { [key: string]: { marked: boolean; dotColor: string } } = {};
    records.forEach((record) => {
      marked[record.date] = { marked: true, dotColor: "red" };
    });
    return marked;
  };

  // 新しい記録を保存または更新する関数
  const saveRecord = async () => {
    // 簡単な入力チェック
    if (!location.trim() || !feeling.trim()) {
      Alert.alert("入力エラー", "「どこで」と「どう感じたか」は必須項目です。");
      return;
    }

    try {
      if (editingRecord) {
        // 更新の場合
        const updatedRecord = {
          ...editingRecord,
          time,
          location,
          feeling,
          action,
        };
        const newRecords = records.map((record) =>
          record.id === editingRecord.id ? updatedRecord : record
        );
        setRecords(newRecords);
        const jsonValue = JSON.stringify(newRecords);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        setEditingRecord(null);
        Alert.alert("成功", "記録を更新しました。");
      } else {
        // 新規作成の場合
        const newRecord = {
          id: Date.now().toString(), // ユニークなIDとして現在時刻のタイムスタンプを使用
          date: new Date().toISOString().split("T")[0],
          time,
          location,
          feeling,
          action,
        };
        const newRecords = [...records, newRecord];
        setRecords(newRecords);
        const jsonValue = JSON.stringify(newRecords);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        Alert.alert("成功", "記録を保存しました。");
      }

      // 入力フォームをクリア
      setLocation("");
      setFeeling("");
      setAction("");
      setTime(
        new Date().toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      // 記録一覧ページに遷移
      router.push("/records");
    } catch (e) {
      console.error("Failed to save record.", e);
      Alert.alert("エラー", "記録の保存に失敗しました。");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>
            {editingRecord ? "発作の記録（編集）" : "発作の記録"}
          </Text>

          <CalendarView
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            markedDates={getMarkedDates()}
          />
          <RecordForm
            editingRecord={editingRecord}
            time={time}
            setTime={setTime}
            location={location}
            setLocation={setLocation}
            feeling={feeling}
            setFeeling={setFeeling}
            action={action}
            setAction={setAction}
            onSave={saveRecord}
            onCancel={() => {
              setEditingRecord(null);
              setLocation("");
              setFeeling("");
              setAction("");
              setTime(
                new Date().toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              );
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <Menu />
    </SafeAreaView>
  );
}

// スタイル定義
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
