/* eslint-disable import/no-unresolved */
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "./components/Menu";

const BreathingScreen = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [phase, setPhase] = useState("息を吸って…");
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const animate = () => {
      // 吸う：4秒で拡大
      setPhase("息を吸って…");
      setCountdown(4);
      let inhaleCount = 4;
      const inhaleInterval = setInterval(() => {
        inhaleCount--;
        setCountdown(inhaleCount);
        if (inhaleCount <= 0) {
          clearInterval(inhaleInterval);
        }
      }, 1000);

      Animated.timing(scaleAnim, {
        toValue: 3,
        duration: 4000,
        useNativeDriver: true,
      }).start(() => {
        // 止める：7秒
        setPhase("息を止めて…");
        setCountdown(7);
        let holdCount = 7;
        const holdInterval = setInterval(() => {
          holdCount--;
          setCountdown(holdCount);
          if (holdCount <= 0) {
            clearInterval(holdInterval);
          }
        }, 1000);

        setTimeout(() => {
          // 吐く：8秒で縮小
          setPhase("息を吐いて…");
          setCountdown(8);
          let exhaleCount = 8;
          const exhaleInterval = setInterval(() => {
            exhaleCount--;
            setCountdown(exhaleCount);
            if (exhaleCount <= 0) {
              clearInterval(exhaleInterval);
            }
          }, 1000);

          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: true,
          }).start(() => {
            animate(); // 繰り返し
          });
        }, 7000);
      });
    };
    animate();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <Animated.View
          style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={styles.guide}>{phase}</Text>
          <Text style={styles.countdown}>{countdown}</Text>
        </Animated.View>
      </View>
      <Menu />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#5DADE2",
    justifyContent: "center",
    alignItems: "center",
  },
  guide: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  countdown: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default BreathingScreen;
