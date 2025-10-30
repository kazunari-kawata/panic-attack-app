/* eslint-disable import/no-unresolved */
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { hp, moderateScale, wp } from "../utils/responsive";
import SelectableInput from "./SelectableInput";
import TimePicker from "./TimePicker";

// 事前定義されたオプション
const LOCATION_OPTIONS = [
  "自宅",
  "職場",
  "学校",
  "駅",
  "電車内",
  "バス内",
  "ショッピングモール",
  "レストラン",
  "カフェ",
  "病院",
  "美容院",
  "映画館",
  "公園",
  "友人の家",
];

const FEELING_OPTIONS = [
  "不安",
  "恐怖",
  "緊張",
  "動悸",
  "息苦しさ",
  "めまい",
  "吐き気",
  "震え",
  "汗をかく",
  "胸の圧迫感",
  "のどの詰まり",
  "頭痛",
  "疲労感",
  "集中力の低下",
];

const ACTION_OPTIONS = [
  "深呼吸",
  "数を数える",
  "音楽を聞く",
  "誰かに電話する",
  "水を飲む",
  "散歩する",
  "座る・横になる",
  "薬を飲む",
  "瞑想・マインドフルネス",
  "日記を書く",
  "安全な場所に移動",
  "呼吸法の実践",
  "リラックス音楽",
  "温かい飲み物",
];

interface RecordItem {
  id: string;
  date: string;
  time: string;
  location: string;
  feeling: string | string[];
  action: string | string[];
}

interface RecordFormProps {
  editingRecord: RecordItem | null;
  time: string;
  setTime: (time: string) => void;
  location: string;
  setLocation: (location: string) => void;
  feeling: string | string[];
  setFeeling: (feeling: string | string[]) => void;
  action: string | string[];
  setAction: (action: string | string[]) => void;
  onSave: () => void;
  onCancel: () => void;
  scrollToInput: (scrollY: number) => void;
  scrollViewRef: React.RefObject<ScrollView | null>;
}

export default function RecordForm({
  editingRecord,
  time,
  setTime,
  location,
  setLocation,
  feeling,
  setFeeling,
  action,
  setAction,
  onSave,
  onCancel,
  scrollToInput,
  scrollViewRef,
}: RecordFormProps) {
  // 保存ボタンへのref
  const saveButtonRef = useRef<View>(null);

  // 動的オプション管理
  const [locationOptions, setLocationOptions] = useState(LOCATION_OPTIONS);
  const [feelingOptions, setFeelingOptions] = useState(FEELING_OPTIONS);
  const [actionOptions, setActionOptions] = useState(ACTION_OPTIONS);

  // 新しいオプションを追加する関数
  const addLocationOption = (newOption: string) => {
    if (!locationOptions.includes(newOption)) {
      setLocationOptions([...locationOptions, newOption]);
    }
  };

  const addFeelingOption = (newOption: string) => {
    if (!feelingOptions.includes(newOption)) {
      setFeelingOptions([...feelingOptions, newOption]);
    }
  };

  const addActionOption = (newOption: string) => {
    if (!actionOptions.includes(newOption)) {
      setActionOptions([...actionOptions, newOption]);
    }
  };

  // 型安全な値変更関数
  const handleLocationChange = (value: string | string[]) => {
    if (typeof value === "string") {
      setLocation(value);
    }
  };

  const handleFeelingChange = (value: string | string[]) => {
    setFeeling(value);
  };

  const handleActionChange = (value: string | string[]) => {
    setAction(value);
  };

  // キーボード表示時の処理（選択式入力では不要）
  useEffect(() => {
    // キーボード関連の処理は選択式入力では不要なため削除
  }, []);

  return (
    <View style={styles.formContainer}>
      {/* 時間選択コンポーネント */}
      <TimePicker time={time} onTimeChange={setTime} placeholder="時間を選択" />

      <SelectableInput
        placeholder="どこで？（例: 電車の中）"
        value={location}
        onValueChange={handleLocationChange}
        options={locationOptions}
        onAddOption={addLocationOption}
      />

      <SelectableInput
        placeholder="どう感じたか？（例: 動悸がした）"
        value={feeling}
        onValueChange={handleFeelingChange}
        options={feelingOptions}
        onAddOption={addFeelingOption}
        multiSelect={true}
      />

      <SelectableInput
        placeholder="どう対処したか？（例: 深呼吸をした）"
        value={action}
        onValueChange={handleActionChange}
        options={actionOptions}
        onAddOption={addActionOption}
        multiSelect={true}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          ref={saveButtonRef}
          style={styles.button}
          onPress={onSave}
        >
          <Text style={styles.buttonText}>
            {editingRecord ? "この内容で更新する" : "この内容で保存する"}
          </Text>
        </TouchableOpacity>
        {editingRecord && (
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              キャンセル
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    paddingBottom: hp(2.5),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    marginBottom: hp(1.3),
  },
  input: {
    height: hp(5),
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: hp(1.3),
    paddingHorizontal: wp(2.5),
    borderRadius: moderateScale(5),
    backgroundColor: "white",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: hp(1.3),
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: hp(1.3),
    paddingHorizontal: wp(5),
    borderRadius: moderateScale(5),
    minWidth: wp(25),
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  cancelButtonText: {
    color: "#666666",
  },
});
