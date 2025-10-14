/* eslint-disable import/no-unresolved */
import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// 画面幅に対するパーセンテージ
export const wp = (percentage: number) => (percentage / 100) * screenWidth;

// 画面高さに対するパーセンテージ
export const hp = (percentage: number) => (percentage / 100) * screenHeight;

// フォントサイズのスケーリング (基準を375pxの幅として)
const guidelineBaseWidth = 375;
export const scale = (size: number) =>
  (screenWidth / guidelineBaseWidth) * size;

// 垂直方向のスケーリング
const guidelineBaseHeight = 812;
export const verticalScale = (size: number) =>
  (screenHeight / guidelineBaseHeight) * size;

// 最小スケールと最大スケールを考慮したスケーリング
export const moderateScale = (size: number, factor: number = 0.5) =>
  size + (scale(size) - size) * factor;
