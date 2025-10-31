/* eslint-disable import/no-unresolved */
import { RecordItem } from "../hooks/useRecordStorage";

export interface DisplayRecord {
  id: string;
  date: string;
  time: string;
  location: string;
  feeling: string;
  action: string;
}

export const convertRecordsForDisplay = (
  records: RecordItem[]
): DisplayRecord[] => {
  return records.map((record) => ({
    ...record,
    feeling: Array.isArray(record.feeling)
      ? record.feeling.join("、")
      : record.feeling,
    action: Array.isArray(record.action)
      ? record.action.join("、")
      : record.action,
  }));
};
