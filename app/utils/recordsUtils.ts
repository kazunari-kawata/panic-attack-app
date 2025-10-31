/* eslint-disable import/no-unresolved */
import { RecordItem } from "../hooks/useRecordStorage";

export type PeriodType =
  | "week"
  | "month"
  | "3months"
  | "6months"
  | "year"
  | "all";

export const PERIOD_TABS = [
  { key: "week" as const, label: "今週" },
  { key: "month" as const, label: "今月" },
  { key: "3months" as const, label: "3ヶ月" },
  { key: "6months" as const, label: "6ヶ月" },
  { key: "year" as const, label: "1年" },
  { key: "all" as const, label: "全期間" },
];

export const filterRecordsByPeriod = (
  records: RecordItem[],
  period: PeriodType
): RecordItem[] => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "3months":
      startDate = new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);
      break;
    case "6months":
      startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
      break;
    case "year":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case "all":
      return records; // 全期間の場合はフィルタリングしない
    default:
      return records;
  }

  return records.filter((record) => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate;
  });
};

export const sortRecords = (records: RecordItem[]): RecordItem[] => {
  return records.sort((a, b) => {
    // 日付を比較
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) {
      return dateCompare; // 日付が異なる場合は日付順
    }

    // 日付が同じ場合は時間を比較
    const timeA = a.time || "00:00";
    const timeB = b.time || "00:00";
    return timeA.localeCompare(timeB);
  });
};

export const getFilteredAndSortedRecords = (
  records: RecordItem[],
  period: PeriodType
): RecordItem[] => {
  const filtered = filterRecordsByPeriod(records, period);
  return sortRecords(filtered);
};
