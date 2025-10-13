/* eslint-disable import/no-unresolved */
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp, moderateScale, wp } from "../utils/responsive";

interface StartButtonProps {
  onPress: () => void;
}

export default function StartButton({ onPress }: StartButtonProps) {
  return (
    <View style={styles.startContainer}>
      <TouchableOpacity
        style={styles.startButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.startButtonText}>深呼吸スタート</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  startContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: wp(62.5),
  },
  startButton: {
    backgroundColor: "#5DADE2",
    paddingVertical: hp(2),
    paddingHorizontal: wp(8),
    borderRadius: moderateScale(30),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    color: "white",
    fontSize: moderateScale(18),
    fontWeight: "bold",
    textAlign: "center",
  },
});
