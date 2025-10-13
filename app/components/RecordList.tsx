/* eslint-disable import/no-unresolved */
import React from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { hp, moderateScale, wp } from "../utils/responsive";

interface RecordItem {
  id: string;
  date: string;
  time: string;
  location: string;
  feeling: string;
  action: string;
}

interface RecordListProps {
  records: RecordItem[];
  onEdit: (record: RecordItem) => void;
  onDelete: (id: string) => void;
}

export default function RecordList({
  records,
  onEdit,
  onDelete,
}: RecordListProps) {
  const renderItem = ({ item }: { item: RecordItem }) => (
    <View style={styles.recordItem}>
      <Text style={styles.recordDate}>
        {item.date} {item.time}
      </Text>
      <Text>場所: {item.location}</Text>
      <Text>感情: {item.feeling}</Text>
      <Text>対処: {item.action}</Text>
      <View style={styles.buttonContainer}>
        <Button title="編集" onPress={() => onEdit(item)} />
        <Button title="削除" color="red" onPress={() => onDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>記録がありません。</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    marginBottom: hp(1.3),
  },
  recordItem: {
    backgroundColor: "#f9f9f9",
    padding: wp(3.75),
    borderRadius: moderateScale(5),
    marginBottom: hp(1.3),
    borderWidth: 1,
    borderColor: "#eeeeee",
  },
  recordDate: {
    fontWeight: "bold",
    marginBottom: hp(0.6),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(1.3),
  },
});
