/* eslint-disable import/no-unresolved */
import React from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { hp, moderateScale, wp } from "../utils/responsive";

interface BreathingCircleProps {
  scaleAnim: Animated.Value;
  phase: string;
  countdown: number;
}

export default function BreathingCircle({
  scaleAnim,
  phase,
  countdown,
}: BreathingCircleProps) {
  return (
    <Animated.View
      style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}
    >
      <Text style={styles.guide}>{phase}</Text>
      <Text style={styles.countdown}>{countdown}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    backgroundColor: "#5DADE2",
    justifyContent: "center",
    alignItems: "center",
  },
  guide: {
    fontSize: moderateScale(10),
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  countdown: {
    fontSize: moderateScale(24),
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: hp(1.3),
  },
});
