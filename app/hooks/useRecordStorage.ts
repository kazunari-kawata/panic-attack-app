/* eslint-disable import/no-unresolved */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";

const STORAGE_KEY = "@panic_records";

export interface RecordItem {
  id: string;
  date: string;
  time: string;
  location: string;
  feeling: string | string[];
  action: string | string[];
}

export const useRecordStorage = () => {
  const [records, setRecords] = useState<RecordItem[]>([]);

  const loadRecords = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) {
        const loadedRecords = JSON.parse(jsonValue);
        setRecords(loadedRecords);
        return loadedRecords;
      }
      return [];
    } catch (e) {
      console.error("Failed to load records.", e);
      return [];
    }
  }, []);

  const saveRecord = useCallback(
    async (record: RecordItem) => {
      try {
        const currentRecords = await loadRecords();
        const newRecords = [...currentRecords, record];
        setRecords(newRecords);
        const jsonValue = JSON.stringify(newRecords);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        return { success: true, records: newRecords };
      } catch (e) {
        console.error("Failed to save record.", e);
        return { success: false, records: [] };
      }
    },
    [loadRecords]
  );

  const updateRecord = useCallback(
    async (updatedRecord: RecordItem) => {
      try {
        const currentRecords = await loadRecords();
        const newRecords = currentRecords.map((record: RecordItem) =>
          record.id === updatedRecord.id ? updatedRecord : record
        );
        setRecords(newRecords);
        const jsonValue = JSON.stringify(newRecords);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        return { success: true, records: newRecords };
      } catch (e) {
        console.error("Failed to update record.", e);
        return { success: false, records: [] };
      }
    },
    [loadRecords]
  );

  const loadEditingRecord = useCallback(
    (recordId: string) => {
      return records.find((record) => record.id === recordId) || null;
    },
    [records]
  );

  return {
    records,
    setRecords,
    loadRecords,
    saveRecord,
    updateRecord,
    loadEditingRecord,
  };
};
