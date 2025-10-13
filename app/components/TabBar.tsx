/* eslint-disable import/no-unresolved */
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp, moderateScale, wp } from "../utils/responsive";

interface Tab {
  key: "week" | "month" | "3months" | "6months" | "year" | "all";
  label: string;
}

interface TabBarProps {
  tabs: readonly Tab[];
  activeTab: "week" | "month" | "3months" | "6months" | "year" | "all";
  onTabPress: (
    tab: "week" | "month" | "3months" | "6months" | "year" | "all"
  ) => void;
}

export default function TabBar({ tabs, activeTab, onTabPress }: TabBarProps) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const activeTabLabel =
    tabs.find((tab) => tab.key === activeTab)?.label || "選択";

  const handleTabPress = (tabKey: typeof activeTab) => {
    onTabPress(tabKey);
    setIsDropdownVisible(false);
  };

  return (
    <View style={styles.tabContainer}>
      {/* ドロップダウンボタン */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsDropdownVisible(!isDropdownVisible)}
      >
        <Text style={styles.dropdownButtonText}>{activeTabLabel}</Text>
        <Text style={styles.dropdownArrow}>
          {isDropdownVisible ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {/* ドロップダウンメニュー */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.dropdownItem,
                  activeTab === tab.key && styles.activeDropdownItem,
                ]}
                onPress={() => handleTabPress(tab.key)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    activeTab === tab.key && styles.activeDropdownItemText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderRadius: moderateScale(6),
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: moderateScale(6),
    minWidth: wp(25),
    maxWidth: wp(35),
  },
  dropdownButtonText: {
    fontSize: moderateScale(16),
    color: "#007bff",
    fontWeight: "bold",
  },
  dropdownArrow: {
    fontSize: moderateScale(14),
    color: "#007bff",
    marginLeft: wp(2),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
  },
  dropdownMenu: {
    backgroundColor: "white",
    marginTop: hp(8), // タブバーの下に表示
    marginHorizontal: wp(4),
    borderRadius: moderateScale(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: hp(40),
  },
  dropdownItem: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  activeDropdownItem: {
    backgroundColor: "#f8f9ff",
  },
  dropdownItemText: {
    fontSize: moderateScale(16),
    color: "#333",
  },
  activeDropdownItemText: {
    color: "#007bff",
    fontWeight: "bold",
  },
});
