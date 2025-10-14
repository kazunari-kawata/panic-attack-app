/* eslint-disable import/no-unresolved */
import { faker } from "@faker-js/faker/locale/ja"; // 日本語対応のFaker
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * 2025年のリアルなダミーデータ件生成し、AsyncStorageに保存します。
 */
const generateAndAddTestData = async () => {
  console.log("テストデータの生成を開始します...");

  const locations = [
    "電車",
    "職場",
    "自宅",
    "スーパー",
    "会議室",
    "美容院",
    "歯科医院",
    "カフェ",
  ];
  const feelings = [
    "動悸",
    "息苦しさ",
    "めまい",
    "強い不安感",
    "吐き気",
    "手足の震え",
    "冷や汗",
  ];
  const actions = [
    "深呼吸をする",
    "水を飲む",
    "座って安静にする",
    "お気に入りの音楽を聴く",
    "頓服薬を飲む",
    "誰かに電話する",
  ];

  const testRecords = [];

  for (let i = 0; i < 100; i++) {
    // 2025年のランダムな日付と時刻を生成
    const randomDate = faker.date.between({
      from: "2025-01-01T00:00:00.000Z",
      to: "2025-10-13T23:59:59.999Z",
    });

    const record = {
      id: faker.string.uuid(), // 毎回ユニークなIDを生成
      date: randomDate.toISOString().split("T")[0], // 'YYYY-MM-DD'形式
      time: randomDate.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }), // 'HH:MM'形式
      location: faker.helpers.arrayElement(locations), // 定義済みリストからランダムに選択
      feeling: faker.helpers.arrayElement(feelings),
      action: faker.helpers.arrayElement(actions),
    };
    testRecords.push(record);
  }

  try {
    // 生成したデータをJSON文字列に変換して保存
    await AsyncStorage.setItem("@panic_records", JSON.stringify(testRecords));
    console.log(
      `${testRecords.length}件のテストデータをAsyncStorageに追加しました。`
    );
    alert(
      "100件のテストデータを投入しました！アプリを再読み込みするか、データを表示する画面に移動してください。"
    );
  } catch (e) {
    console.error("テストデータの追加に失敗しました:", e);
    alert("テストデータの投入に失敗しました。");
  }
};

// この関数を、例えばテスト用のボタンから呼び出します。
// 例: <Button title="100件のテストデータを投入" onPress={generateAndAddTestData} />

export { generateAndAddTestData };
