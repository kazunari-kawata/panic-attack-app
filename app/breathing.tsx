/* eslint-disable import/no-unresolved */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import BreathingCircle from "./components/BreathingCircle";
import StartButton from "./components/StartButton";

const BreathingScreen = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [phase, setPhase] = useState("準備完了");
  const [countdown, setCountdown] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalsRef = useRef<number[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  // クリーンアップ関数
  const cleanup = useCallback(() => {
    intervalsRef.current.forEach((id) => clearInterval(id));
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    intervalsRef.current = [];
    timeoutsRef.current = [];
    scaleAnim.stopAnimation();
    scaleAnim.setValue(1);
  }, [scaleAnim]);

  const startAnimation = () => {
    setIsRunning(true);
    animate();
  };

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
    intervalsRef.current.push(inhaleInterval);

    Animated.timing(scaleAnim, {
      toValue: 3,
      duration: 4000,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;

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
      intervalsRef.current.push(holdInterval);

      const holdTimeout = setTimeout(() => {
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
        intervalsRef.current.push(exhaleInterval);

        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            animate(); // 繰り返し
          }
        });
      }, 7000);
      timeoutsRef.current.push(holdTimeout);
    });
  };

  // コンポーネントのアンマウント時にクリーンアップ
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {!isRunning ? (
          <StartButton onPress={startAnimation} />
        ) : (
          <BreathingCircle
            scaleAnim={scaleAnim}
            phase={phase}
            countdown={countdown}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f3ff",
  },
});

export default BreathingScreen;
