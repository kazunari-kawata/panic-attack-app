/* eslint-disable import/no-unresolved */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BreathingCircle from "./components/BreathingCircle";
import StartButton from "./components/StartButton";
import { hp, moderateScale, wp } from "./utils/responsive";

// 呼吸法のパターン定義
interface BreathingPattern {
  id: string;
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
}

const breathingPatterns: BreathingPattern[] = [
  {
    id: "4-7-8",
    name: "4-7-8呼吸法",
    inhale: 4,
    hold: 7,
    exhale: 8,
  },
  {
    id: "4-4-8",
    name: "4-4-8呼吸法",
    inhale: 4,
    hold: 4,
    exhale: 8,
  },
  {
    id: "3-2-5",
    name: "3-2-5呼吸法",
    inhale: 3,
    hold: 2,
    exhale: 5,
  },
];

const BreathingScreen = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [phase, setPhase] = useState("準備完了");
  const [countdown, setCountdown] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activePattern, setActivePattern] = useState("4-7-8");
  const intervalsRef = useRef<number[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  // 現在の呼吸法パターンを取得
  const currentPattern =
    breathingPatterns.find((p) => p.id === activePattern) ||
    breathingPatterns[0];

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
    // 吸う：パターンに応じた時間で拡大
    setPhase("息を吸って…");
    setCountdown(currentPattern.inhale);
    let inhaleCount = currentPattern.inhale;
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
      duration: currentPattern.inhale * 1000,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;

      // 止める：パターンに応じた時間
      setPhase("息を止めて…");
      setCountdown(currentPattern.hold);
      let holdCount = currentPattern.hold;
      const holdInterval = setInterval(() => {
        holdCount--;
        setCountdown(holdCount);
        if (holdCount <= 0) {
          clearInterval(holdInterval);
        }
      }, 1000);
      intervalsRef.current.push(holdInterval);

      const holdTimeout = setTimeout(() => {
        // 吐く：パターンに応じた時間で縮小
        setPhase("息を吐いて…");
        setCountdown(currentPattern.exhale);
        let exhaleCount = currentPattern.exhale;
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
          duration: currentPattern.exhale * 1000,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            animate(); // 繰り返し
          }
        });
      }, currentPattern.hold * 1000);
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
      {/* 呼吸法選択タブ */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {breathingPatterns.map((pattern) => (
          <TouchableOpacity
            key={pattern.id}
            style={[
              styles.tab,
              activePattern === pattern.id && styles.activeTab,
            ]}
            onPress={() => {
              setActivePattern(pattern.id);
              if (isRunning) {
                // 実行中の場合は一度停止してから新しいパターンで開始
                cleanup();
                setIsRunning(false);
                setPhase("準備完了");
                setCountdown(0);
              }
            }}
          >
            <Text
              style={[
                styles.tabText,
                activePattern === pattern.id && styles.activeTabText,
              ]}
            >
              {pattern.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
  tabContainer: {
    backgroundColor: "#5DADE2",
    paddingHorizontal: wp(2),
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    maxHeight: hp(6),
  },
  tabContent: {
    alignItems: "center",
    paddingHorizontal: wp(2),
  },
  tab: {
    paddingHorizontal: wp(4),
    marginHorizontal: wp(1),
    minWidth: wp(25),
    alignItems: "center",
    justifyContent: "center",
    height: hp(6),
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#ffffff",
    backgroundColor: "transparent",
  },
  tabText: {
    fontSize: moderateScale(14),
    color: "#666",
    fontWeight: "600",
    textAlign: "center",
  },
  activeTabText: {
    color: "#ffffff",
  },
});

export default BreathingScreen;
