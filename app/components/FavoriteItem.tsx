import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale } from "../utils/responsive";

interface FavoriteItemData {
  id: string;
  title: string;
  url: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface FavoriteItemProps {
  item: FavoriteItemData;
  isEditMode: boolean;
  onPress: () => void;
  onDelete: () => void;
}

export default function FavoriteItem({
  item,
  isEditMode,
  onPress,
  onDelete,
}: FavoriteItemProps) {
  return (
    <View style={styles.itemWrapper}>
      <TouchableOpacity
        style={styles.favoriteItem}
        onPress={onPress}
        onLongPress={() => isEditMode && onDelete()}
      >
        <View style={styles.itemContent}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={item.icon}
              size={moderateScale(24)}
              color="#007AFF"
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
          </View>
          {!isEditMode && (
            <Ionicons
              name="open-outline"
              size={moderateScale(20)}
              color="#5DADE2"
            />
          )}
        </View>
      </TouchableOpacity>
      {isEditMode && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons
            name="trash-outline"
            size={moderateScale(20)}
            color="#fff"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    position: "relative",
  },
  favoriteItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(15),
  },
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(15),
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#333",
  },
  deleteButton: {
    position: "absolute",
    top: moderateScale(5),
    right: moderateScale(5),
    backgroundColor: "#FF6B6B",
    borderRadius: moderateScale(15),
    width: moderateScale(30),
    height: moderateScale(30),
    justifyContent: "center",
    alignItems: "center",
  },
});
