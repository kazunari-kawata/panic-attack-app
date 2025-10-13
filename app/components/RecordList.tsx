import React from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";

interface RecordItem {
  id: string;
  date: string;
  time: string;
  location: string;
  feeling: string;
  action: string;
}

interface RecordListProps {
  selectedDate: string;
  records: RecordItem[];
  onEdit: (record: RecordItem) => void;
  onDelete: (id: string) => void;
}

export default function RecordList({
  selectedDate,
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
        <Button
          title="編集"
          onPress={() => onEdit(item)}
        />
        <Button
          title="削除"
          color="red"
          onPress={() => onDelete(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.listContainer}>
      <Text style={styles.title}>選択した日: {selectedDate}</Text>
      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>この日は記録がありません。</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recordItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eeeeee",
  },
  recordDate: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});