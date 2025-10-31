/* eslint-disable import/no-unresolved */
import { useEffect, useRef, useState } from "react";
import { Dimensions, Keyboard, ScrollView } from "react-native";

export const useKeyboardHandling = (showAddInput: boolean) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // キーボード表示時にAddItemFormが表示されている場合のみスクロール
        if (showAddInput && scrollViewRef.current) {
          setTimeout(() => {
            const screenHeight = Dimensions.get("window").height;
            scrollViewRef.current?.scrollTo({
              x: 0,
              y: screenHeight * 0.35, // 画面の35%分スクロール
              animated: false,
            });
          }, 100);
        }
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [showAddInput]);

  return {
    keyboardHeight,
    scrollViewRef,
  };
};
