/* eslint-disable import/no-unresolved */
import AsyncStorage from "@react-native-async-storage/async-storage";

// テストデータを追加する関数
const addTestData = async () => {
  const testRecords = [
    {
      id: "1",
      date: "2024-01-15",
      time: "09:30",
      location: "自宅",
      feeling: "息苦しさ",
      action: "深呼吸",
    },
    {
      id: "2",
      date: "2024-01-16",
      time: "14:20",
      location: "職場",
      feeling: "動悸",
      action: "水分補給",
    },
    {
      id: "3",
      date: "2024-01-17",
      time: "18:45",
      location: "電車",
      feeling: "めまい",
      action: "座る",
    },
    {
      id: "4",
      date: "2024-01-18",
      time: "22:10",
      location: "自宅",
      feeling: "息苦しさ",
      action: "深呼吸",
    },
    {
      id: "5",
      date: "2024-01-19",
      time: "07:15",
      location: "自宅",
      feeling: "不安",
      action: "音楽を聴く",
    },
    {
      id: "6",
      date: "2024-01-20",
      time: "12:30",
      location: "職場",
      feeling: "動悸",
      action: "休憩",
    },
    {
      id: "7",
      date: "2024-01-21",
      time: "16:50",
      location: "自宅",
      feeling: "息苦しさ",
      action: "深呼吸",
    },
    {
      id: "8",
      date: "2024-01-22",
      time: "19:25",
      location: "スーパー",
      feeling: "めまい",
      action: "座る",
    },
  ];

  try {
    await AsyncStorage.setItem("@panic_records", JSON.stringify(testRecords));
    console.log("テストデータを追加しました");
  } catch (e) {
    console.error("テストデータの追加に失敗しました", e);
  }
};

addTestData();
