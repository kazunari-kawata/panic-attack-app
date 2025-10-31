/* eslint-disable import/no-unresolved */
import { RecordItem } from "../hooks/useRecordStorage";

export interface MarkedDate {
  marked: boolean;
  selectedColor?: string;
  dotColor: string;
}

export interface MarkedDates {
  [date: string]: MarkedDate;
}

export const getMarkedDates = (
  records: RecordItem[],
  selectedDate: string
): MarkedDates => {
  const markedDates: MarkedDates = {};

  // 記録がある日付をマーク
  records.forEach((record) => {
    markedDates[record.date] = { marked: true, dotColor: "#007AFF" };
  });

  // 今日の日付を青色でマーク
  const today = new Date().toISOString().split("T")[0];
  markedDates[today] = {
    ...markedDates[today],
    selectedColor: "#87CEEB", // 薄い青
    marked: true,
  };

  // 選択した日付をハイライト
  if (selectedDate !== today) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selectedColor: "#87CEEB", // 薄い青
      marked: true,
    };
  }

  return markedDates;
};

export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getCurrentTimeString = (): string => {
  return new Date().toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getTodayDateString = (): string => {
  return new Date().toISOString().split("T")[0];
};
