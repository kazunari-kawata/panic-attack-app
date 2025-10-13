/* eslint-disable import/no-unresolved */
import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { hp, moderateScale, wp } from "../utils/responsive";

interface ChecklistItemProps {
  item: string;
  checked: boolean;
  editingItem: string | null;
  editText: string;
  onToggleCheck: (item: string) => void;
  onStartEdit: (item: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDeleteItem: (item: string) => void;
  setEditText: (text: string) => void;
}

export default function ChecklistItem({
  item,
  checked,
  editingItem,
  editText,
  onToggleCheck,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteItem,
  setEditText,
}: ChecklistItemProps) {
  return (
    <View style={styles.itemContainer}>
      {editingItem === item ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={setEditText}
            autoFocus
          />
          <View style={styles.editButtons}>
            <Button title="保存" onPress={onSaveEdit} />
            <Button title="キャンセル" onPress={onCancelEdit} />
          </View>
        </View>
      ) : (
        <>
          <CheckBox
            title={item}
            checked={checked}
            onPress={() => onToggleCheck(item)}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.itemTitle}
          />
          <View style={styles.itemButtons}>
            <TouchableOpacity
              style={[styles.smallButton, styles.editButton]}
              onPress={() => onStartEdit(item)}
            >
              <Text style={[styles.smallButtonText, styles.editButtonText]}>
                編集
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallButton, styles.deleteButton]}
              onPress={() => onDeleteItem(item)}
            >
              <Text style={[styles.smallButtonText, styles.deleteButtonText]}>
                削除
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.3),
    padding: wp(2.5),
    backgroundColor: "white",
    borderRadius: moderateScale(5),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  editContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  editInput: {
    flex: 1,
    height: hp(5),
    borderColor: "gray",
    borderWidth: 1,
    marginRight: wp(2.5),
    paddingHorizontal: wp(2.5),
    borderRadius: moderateScale(5),
  },
  editButtons: {
    flexDirection: "row",
  },
  checkboxContainer: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 0,
    margin: 0,
    padding: 0,
  },
  itemTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#333",
  },
  itemButtons: {
    flexDirection: "row",
  },
  smallButton: {
    paddingVertical: hp(0.6),
    paddingHorizontal: wp(2.5),
    borderRadius: moderateScale(5),
    marginLeft: wp(1.3),
  },
  editButton: {
    backgroundColor: "#007bff",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  smallButtonText: {
    color: "white",
    fontSize: moderateScale(12),
    fontWeight: "bold",
  },
  editButtonText: {
    color: "white",
  },
  deleteButtonText: {
    color: "white",
  },
});
