/* eslint-disable import/no-unresolved */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "./components/Menu";

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

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>外出前チェックリスト</Text>
        {checklistData.items.map((item) => (
          <CheckBox
            key={item}
            title={item}
            checked={checklistData.checked[item] || false}
            onPress={() => toggleCheck(item)}
          />
        ))}
        <View style={styles.buttonContainer}>
          <Button title="+" onPress={() => setShowAddInput(true)} />
          <Button title="リセット" onPress={resetAllChecks} />
        </View>
        {showAddInput && (
          <View style={styles.addContainer}>
            <TextInput
              style={styles.input}
              value={newItem}
              onChangeText={setNewItem}
              placeholder="新しい項目を入力"
            />
            <Button title="追加" onPress={addItem} />
            <Button title="キャンセル" onPress={() => setShowAddInput(false)} />
          </View>
        )}
      </ScrollView>

      <Menu />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  addContainer: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
