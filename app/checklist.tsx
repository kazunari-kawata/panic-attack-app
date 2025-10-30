import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AddItemForm from "./components/AddItemForm";
import ButtonSection from "./components/ButtonSection";
import ChecklistItem from "./components/ChecklistItem";
import { hp, moderateScale, wp } from "./utils/responsive";

const CHECKLIST_DATA_KEY = "@checklist_data";

interface ChecklistData {
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

export default function Checklist() {
  const [checklistData, setChecklistData] =
    useState<ChecklistData>(defaultChecklistData);
  const [newItem, setNewItem] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // 項目追加ボタンを押したときの処理
  const handleShowAddInput = () => {
    setShowAddInput(true);
  };

  // キーボードの表示/非表示を監視
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // キーボード表示時にAddItemFormが表示されている場合のみスクロール
        if (showAddInput && scrollViewRef.current) {
          setTimeout(() => {
            const screenHeight = Dimensions.get("window").height;
            scrollViewRef.current?.scrollTo({
              x: 0,
              y: screenHeight * 0.35, // 画面の35%分スクロール
              animated: false,
            });
          }, 100);
        }
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [showAddInput]);

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(CHECKLIST_DATA_KEY);
      if (jsonValue !== null) {
        setChecklistData(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Failed to load checklist.", e);
    }
  };

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

  const toggleCheck = (item: string) => {
    setChecklistData((prev) => ({
      ...prev,
      checked: { ...prev.checked, [item]: !prev.checked[item] },
    }));
  };

  const addItem = () => {
    if (newItem.trim() && !checklistData.items.includes(newItem.trim())) {
      setChecklistData((prev) => ({
        items: [...prev.items, newItem.trim()],
        checked: { ...prev.checked, [newItem.trim()]: false },
      }));
      setNewItem("");
      setShowAddInput(false);
    } else {
      Alert.alert("エラー", "項目名が空か既に存在します。");
    }
  };

  const resetAllChecks = () => {
    setChecklistData((prev) => ({
      ...prev,
      checked: Object.fromEntries(prev.items.map((item) => [item, false])),
    }));
  };

  const startEdit = (item: string) => {
    setEditingItem(item);
    setEditText(item);
  };

  const saveEdit = () => {
    if (editText.trim() && editText.trim() !== editingItem) {
      if (
        checklistData.items.includes(editText.trim()) &&
        editText.trim() !== editingItem
      ) {
        Alert.alert("エラー", "同じ名前の項目が既に存在します。");
        return;
      }

      setChecklistData((prev) => {
        const newItems = prev.items.map((item) =>
          item === editingItem ? editText.trim() : item
        );
        const newChecked = { ...prev.checked };
        if (editingItem) {
          newChecked[editText.trim()] = newChecked[editingItem];
          delete newChecked[editingItem];
        }

        return {
          items: newItems,
          checked: newChecked,
        };
      });
    }
    setEditingItem(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditText("");
  };

  const deleteItem = (itemToDelete: string) => {
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
  };

  return (
    <View style={[styles.container, styles.background]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: keyboardHeight },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {checklistData.items.map((item) => (
          <ChecklistItem
            key={item}
            item={item}
            checked={checklistData.checked[item] || false}
            editingItem={editingItem}
            editText={editText}
            onToggleCheck={toggleCheck}
            onStartEdit={startEdit}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
            onDeleteItem={deleteItem}
            setEditText={setEditText}
          />
        ))}
        <ButtonSection
          onShowAddInput={handleShowAddInput}
          onResetAllChecks={resetAllChecks}
        />
        {showAddInput && (
          <AddItemForm
            newItem={newItem}
            setNewItem={setNewItem}
            onAddItem={addItem}
            onCancel={() => setShowAddInput(false)}
          />
        )}
      </ScrollView>
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
  scrollContainer: {
    padding: wp(5),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: hp(2.5),
    textAlign: "center",
    color: "#333",
  },
});
