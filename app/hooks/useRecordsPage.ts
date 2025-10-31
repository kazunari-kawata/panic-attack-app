/* eslint-disable import/no-unresolved */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { generateAndAddTestData } from "../../faker";
import { convertRecordsForDisplay } from "../utils/displayUtils";
import { PeriodType, getFilteredAndSortedRecords } from "../utils/recordsUtils";
import { RecordItem, useRecordStorage } from "./useRecordStorage";

export const useRecordsPage = () => {
  const router = useRouter();
  const { records, setRecords, loadRecords } = useRecordStorage();
  const [activeTab, setActiveTab] = useState<PeriodType>("month");

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

  // 期間でフィルタリングしてソートした記録を取得
  const getFilteredRecords = useCallback((): RecordItem[] => {
    return getFilteredAndSortedRecords(records, activeTab);
  }, [records, activeTab]);

  // 表示用に変換された記録を取得
  const getDisplayRecords = useCallback(() => {
    return convertRecordsForDisplay(getFilteredRecords());
  }, [getFilteredRecords]);

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
            const STORAGE_KEY = "@panic_records";
            const newRecords = records.filter((record) => record.id !== id);
            setRecords(newRecords);
            const jsonValue = JSON.stringify(newRecords);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
          },
        },
      ]
    );
  };

  const showTestDataConfirmation = () => {
    Alert.alert(
      "テストデータ投入",
      "現在のデータを上書きしてテストデータを投入しますか？",
      [
        { text: "キャンセル", style: "cancel" },
        { text: "投入する", onPress: addTestData },
      ]
    );
  };

  return {
    records,
    activeTab,
    setActiveTab,
    getDisplayRecords,
    handleEdit,
    handleDelete,
    addTestData,
    showTestDataConfirmation,
  };
};
