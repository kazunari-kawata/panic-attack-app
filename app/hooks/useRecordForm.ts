/* eslint-disable import/no-unresolved */
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { getCurrentTimeString } from "../utils/calendarUtils";
import { RecordItem, useRecordStorage } from "./useRecordStorage";

export const useRecordForm = () => {
  const router = useRouter();
  const {
    records,
    setRecords,
    loadRecords,
    saveRecord,
    updateRecord,
    loadEditingRecord,
  } = useRecordStorage();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [editingRecord, setEditingRecord] = useState<RecordItem | null>(null);
  const [time, setTime] = useState(getCurrentTimeString());
  const [location, setLocation] = useState("");
  const [feeling, setFeeling] = useState<string | string[]>("");
  const [action, setAction] = useState<string | string[]>("");

  const scrollViewRef = useRef<ScrollView>(null);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setEditingRecord(null);

    // 選択した日付の記録があるかチェック（常に新しい記録を作成）
    setLocation("");
    setFeeling("");
    setAction("");
    setTime(getCurrentTimeString());
  };

  const scrollToInput = (inputPosition: number) => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: 0,
          y: inputPosition,
          animated: true,
        });
      }
    }, 100);
  };

  const handleSaveRecord = async () => {
    // バリデーション
    const locationValue = Array.isArray(location)
      ? location.join("")
      : location;
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
        const result = await updateRecord(updatedRecord);
        if (result.success) {
          setRecords(result.records);
          setEditingRecord(null);
          Alert.alert("成功", "記録を更新しました。");
        } else {
          Alert.alert("エラー", "記録の更新に失敗しました。");
          return;
        }
      } else {
        // 新規作成の場合
        const newRecord: RecordItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          date: selectedDate,
          time,
          location,
          feeling,
          action,
        };
        const result = await saveRecord(newRecord);
        if (result.success) {
          setRecords(result.records);
          Alert.alert("成功", `${selectedDate}の記録を保存しました。`);
        } else {
          Alert.alert("エラー", "記録の保存に失敗しました。");
          return;
        }
      }

      // 編集モードを解除し、フォームをクリア（新規作成時のみ）
      setEditingRecord(null);
      if (!editingRecord) {
        resetForm();
      }

      // 記録一覧ページに遷移
      router.push("/records");
    } catch (e) {
      console.error("Failed to save record.", e);
      Alert.alert("エラー", "記録の保存に失敗しました。");
    }
  };

  const resetForm = () => {
    setLocation("");
    setFeeling("");
    setAction("");
    setTime(getCurrentTimeString());
  };

  const handleCancel = () => {
    if (editingRecord) {
      // 編集モードの場合は記録一覧に遷移
      setEditingRecord(null);
      resetForm();
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
        resetForm();
      }
    }
  };

  return {
    // State
    selectedDate,
    setSelectedDate,
    editingRecord,
    setEditingRecord,
    time,
    setTime,
    location,
    setLocation,
    feeling,
    setFeeling,
    action,
    setAction,
    records,
    scrollViewRef,

    // Methods
    handleDateSelect,
    handleSaveRecord,
    handleCancel,
    scrollToInput,
    loadRecords,
    loadEditingRecord,
    resetForm,
  };
};
