/* eslint-disable import/no-unresolved */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CalendarView from "./components/CalendarView";
import RecordForm from "./components/RecordForm";
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

export default function App() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
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
  const [feeling, setFeeling] = useState<string | string[]>("");
  const [action, setAction] = useState<string | string[]>("");
  const [editingRecord, setEditingRecord] = useState<RecordItem | null>(null);

  // 入力欄へのスムーズスクロール関数
  const scrollToInput = (scrollY: number) => {
    console.log("scrollToInput called with:", scrollY);
    scrollViewRef.current?.scrollTo({
      y: scrollY,
      animated: true,
    });
  };

  // アプリが最初に読み込まれた時に一度だけ実行される処理
  useEffect(() => {
    loadRecords();
    loadEditingRecord();
  }, []);

  // 編集用レコードを読み込む
  const loadEditingRecord = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@editing_record");
      if (jsonValue !== null) {
        const record = JSON.parse(jsonValue);
        setEditingRecord(record);
        setSelectedDate(record.date);
        setTime(record.time);
        setLocation(record.location);
        setFeeling(record.feeling || "");
        setAction(record.action || "");
        // 読み込んだら削除
        await AsyncStorage.removeItem("@editing_record");
      }
    } catch (e) {
      console.error("Failed to load editing record.", e);
    }
  };

  // AsyncStorageからデータを読み込む関数
  const loadRecords = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      // データがあれば、JSON形式からオブジェクト形式に変換してstateにセット
      if (jsonValue !== null) {
        const loadedRecords = JSON.parse(jsonValue);
        // 既存の記録にtimeがない場合、デフォルト値を追加
        // feelingとactionが文字列の場合はそのまま、配列でない場合は互換性を保つ
        const updatedRecords = loadedRecords.map((record: any) => ({
          ...record,
          time: record.time || "",
          feeling: record.feeling || "",
          action: record.action || "",
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

  // 日付選択時の処理（常に新規作成モード）
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);

    // 編集モードを解除して常に新規作成モードに
    setEditingRecord(null);
    setLocation("");
    setFeeling("");
    setAction("");

    // 選択した日付が今日の場合は現在時刻を設定、それ以外は空に
    if (date === new Date().toISOString().split("T")[0]) {
      setTime(
        new Date().toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else {
      setTime(""); // 過去の日付の場合は時間を空に
    }
  };

  // 新しい記録を保存または更新する関数
  const saveRecord = async () => {
    // 簡単な入力チェック
    const locationValue = typeof location === "string" ? location : "";
    const feelingValue = Array.isArray(feeling) ? feeling : [feeling];

    if (
      !locationValue.trim() ||
      feelingValue.length === 0 ||
      (feelingValue.length === 1 && !feelingValue[0].trim())
    ) {
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
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // より確実なユニークID
          date: selectedDate, // 選択した日付を使用
          time,
          location,
          feeling,
          action,
        };
        const newRecords = [...records, newRecord];
        setRecords(newRecords);
        const jsonValue = JSON.stringify(newRecords);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        Alert.alert("成功", `${selectedDate}の記録を保存しました。`);
      }

      // 編集モードを解除し、フォームをクリア（新規作成時のみ）
      setEditingRecord(null);
      if (!editingRecord) {
        setLocation("");
        setFeeling("");
        setAction("");
        setTime(
          new Date().toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }

      // 記録一覧ページに遷移
      router.push("/records");
    } catch (e) {
      console.error("Failed to save record.", e);
      Alert.alert("エラー", "記録の保存に失敗しました。");
    }
  };

  return (
    <View style={[styles.container, styles.background]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? hp(9) : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.contentContainer}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>
              {editingRecord ? "記録（編集）" : `${selectedDate}の記録`}
            </Text>

            <CalendarView
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
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
                if (editingRecord) {
                  // 編集モードの場合は記録一覧に遷移
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
                  router.push("/records");
                } else {
                  // 新規作成の場合はフォームをリセット
                  setEditingRecord(null);
                  // 選択した日付の記録があるかチェックしてフォームをリセット
                  const existingRecord = records.find(
                    (record) => record.date === selectedDate
                  );
                  if (existingRecord) {
                    setTime(existingRecord.time);
                    setLocation(existingRecord.location);
                    setFeeling(existingRecord.feeling || "");
                    setAction(existingRecord.action || "");
                  } else {
                    setLocation("");
                    setFeeling("");
                    setAction("");
                    setTime(
                      new Date().toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    );
                  }
                }
              }}
              scrollToInput={scrollToInput}
              scrollViewRef={scrollViewRef}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(8),
    paddingTop: hp(1.5),
    paddingBottom: hp(2),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: hp(1.5),
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
