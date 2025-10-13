/* eslint-disable import/no-unresolved */
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { hp, moderateScale, wp } from "../utils/responsive";

interface Tab {
  key: "week" | "month" | "3months" | "6months" | "year";
  label: string;
}

interface TabBarProps {
  tabs: readonly Tab[];
  activeTab: "week" | "month" | "3months" | "6months" | "year";
  onTabPress: (tab: "week" | "month" | "3months" | "6months" | "year") => void;
}

export default function TabBar({ tabs, activeTab, onTabPress }: TabBarProps) {
  return (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => onTabPress(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
  },
  tabText: {
    fontSize: moderateScale(16),
    color: "#666",
  },
  activeTabText: {
    color: "#007bff",
    fontWeight: "bold",
  },
});
