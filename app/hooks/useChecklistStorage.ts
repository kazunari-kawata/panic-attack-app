/* eslint-disable import/no-unresolved */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

const CHECKLIST_DATA_KEY = "@checklist_data";

export interface ChecklistData {
  items: string[];
  checked: { [key: string]: boolean };
}

const defaultChecklistData: ChecklistData = {
  items: ["薬", "イヤホン", "財布", "鍵", "ハンカチ"],
  checked: {
    薬: false,
    イヤホン: false,
    財布: false,
    鍵: false,
    ハンカチ: false,
  },
};

export const useChecklistStorage = () => {
  const [checklistData, setChecklistData] =
    useState<ChecklistData>(defaultChecklistData);

  const loadChecklist = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(CHECKLIST_DATA_KEY);
      if (jsonValue !== null) {
        setChecklistData(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Failed to load checklist.", e);
    }
  }, []);

  const saveChecklist = useCallback(async () => {
    try {
      const jsonValue = JSON.stringify(checklistData);
      await AsyncStorage.setItem(CHECKLIST_DATA_KEY, jsonValue);
    } catch (e) {
      console.error("Failed to save checklist.", e);
    }
  }, [checklistData]);

  // checklistDataが変更されたら自動保存
  useEffect(() => {
    saveChecklist();
  }, [saveChecklist]);

  const toggleCheck = useCallback((item: string) => {
    setChecklistData((prev) => ({
      ...prev,
      checked: { ...prev.checked, [item]: !prev.checked[item] },
    }));
  }, []);

  const addItem = useCallback(
    (newItem: string) => {
      if (newItem.trim() && !checklistData.items.includes(newItem.trim())) {
        setChecklistData((prev) => ({
          items: [...prev.items, newItem.trim()],
          checked: { ...prev.checked, [newItem.trim()]: false },
        }));
        return { success: true };
      } else {
        Alert.alert("エラー", "項目名が空か既に存在します。");
        return { success: false };
      }
    },
    [checklistData.items]
  );

  const resetAllChecks = useCallback(() => {
    setChecklistData((prev) => ({
      ...prev,
      checked: Object.fromEntries(prev.items.map((item) => [item, false])),
    }));
  }, []);

  const updateItem = useCallback(
    (oldItem: string, newItem: string) => {
      if (newItem.trim() && newItem.trim() !== oldItem) {
        if (
          checklistData.items.includes(newItem.trim()) &&
          newItem.trim() !== oldItem
        ) {
          Alert.alert("エラー", "同じ名前の項目が既に存在します。");
          return { success: false };
        }

        setChecklistData((prev) => {
          const newItems = prev.items.map((item) =>
            item === oldItem ? newItem.trim() : item
          );
          const newChecked = { ...prev.checked };
          newChecked[newItem.trim()] = newChecked[oldItem];
          delete newChecked[oldItem];

          return {
            items: newItems,
            checked: newChecked,
          };
        });
        return { success: true };
      }
      return { success: false };
    },
    [checklistData.items]
  );

  const deleteItem = useCallback((itemToDelete: string) => {
    Alert.alert("削除確認", `"${itemToDelete}" を削除しますか？`, [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: () => {
          setChecklistData((prev) => {
            const newItems = prev.items.filter((item) => item !== itemToDelete);
            const newChecked = { ...prev.checked };
            delete newChecked[itemToDelete];

            return {
              items: newItems,
              checked: newChecked,
            };
          });
        },
      },
    ]);
  }, []);

  return {
    checklistData,
    loadChecklist,
    toggleCheck,
    addItem,
    resetAllChecks,
    updateItem,
    deleteItem,
  };
};
