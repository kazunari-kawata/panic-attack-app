import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base dimensions for responsive scaling
const baseWidth = 375; // iPhone X width
const baseHeight = 812; // iPhone X height

/**
 * Width percentage calculation based on screen width
 * @param widthPercent percentage of screen width
 * @returns calculated width value
 */
export const wp = (widthPercent: number): number => {
  const elemWidth =
    typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * elemWidth) / 100);
};

/**
 * Height percentage calculation based on screen height
 * @param heightPercent percentage of screen height
 * @returns calculated height value
 */
export const hp = (heightPercent: number): number => {
  const elemHeight =
    typeof heightPercent === "number"
      ? heightPercent
      : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * elemHeight) / 100);
};

/**
 * Scale font size based on device screen size
 * @param size font size to scale
 * @returns scaled font size
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const scale = SCREEN_WIDTH / baseWidth;
  return Math.round(
    PixelRatio.roundToNearestPixel(size + (scale - 1) * factor)
  );
};

export default {
  wp,
  hp,
  moderateScale,
};
