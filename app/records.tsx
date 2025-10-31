import React from "react";
import { StyleSheet, Text, View } from "react-native";
import RecordList from "./components/RecordList";
import TabBar from "./components/TabBar";
import { useRecordsPage } from "./hooks/useRecordsPage";
import { PERIOD_TABS } from "./utils/recordsUtils";

export default function RecordsPage() {
  const {
    activeTab,
    setActiveTab,
    getDisplayRecords,
    handleEdit,
    handleDelete,
    showTestDataConfirmation,
  } = useRecordsPage();

  return (
    <View style={[styles.container, styles.background]}>
      {/* テストデータ投入ボタン（一時的） */}
      <View style={styles.testButtonContainer}>
        <Text style={styles.testButton} onPress={showTestDataConfirmation}>
          🧪 テストデータを投入する
        </Text>
      </View>

      {/* ヘッダー：タイトルとタブバー */}
      <View style={styles.header}>
        <TabBar
          tabs={PERIOD_TABS}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
      </View>

      {/* 記録リスト */}
      <RecordList
        records={getDisplayRecords()}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </View>
  );
}

// スタイル定義
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    backgroundColor: "#e6f3ff", // 薄い落ち着いた青
  },
  testButtonContainer: {
    margin: 15,
    padding: 12,
    backgroundColor: "#fff3cd", // 薄い黄色の背景
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  testButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#e6f3ff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
