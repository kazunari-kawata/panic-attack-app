/* eslint-disable import/no-unresolved */
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { hp, moderateScale, wp } from "../utils/responsive";

interface SelectableInputProps {
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  placeholder: string;
  options: string[];
  onAddOption: (newOption: string) => void;
  multiSelect?: boolean; // 複数選択フラグ
}

export default function SelectableInput({
  value,
  onValueChange,
  placeholder,
  options,
  onAddOption,
  multiSelect = false, // デフォルトは単一選択
}: SelectableInputProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newOption, setNewOption] = useState("");

  const openModal = () => {
    setModalVisible(true);
    setShowAddInput(false);
    setNewOption("");
  };

  const closeModal = () => {
    setModalVisible(false);
    setShowAddInput(false);
    setNewOption("");
  };

  const selectOption = (option: string) => {
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(option)) {
        // 既に選択されている場合は削除
        onValueChange(currentValues.filter((v) => v !== option));
      } else {
        // 選択されていない場合は追加
        onValueChange([...currentValues, option]);
      }
    } else {
      // 単一選択の場合
      onValueChange(option);
      closeModal();
    }
  };

  const handleAddNewOption = () => {
    if (newOption.trim()) {
      onAddOption(newOption.trim());
      if (multiSelect) {
        const currentValues = Array.isArray(value) ? value : [];
        onValueChange([...currentValues, newOption.trim()]);
      } else {
        onValueChange(newOption.trim());
        closeModal();
      }
      setNewOption("");
      setShowAddInput(false);
    }
  };

  const showAddNewOption = () => {
    setShowAddInput(true);
  };

  // 表示用の値を計算
  const getDisplayValue = () => {
    if (multiSelect) {
      const values = Array.isArray(value) ? value : [];
      if (values.length === 0) return placeholder;
      if (values.length === 1) return values[0];
      return `${values.length}項目選択中`;
    }
    return value || placeholder;
  };

  const hasValue = () => {
    if (multiSelect) {
      const values = Array.isArray(value) ? value : [];
      return values.length > 0;
    }
    return !!value;
  };

  return (
    <>
      <TouchableOpacity style={styles.input} onPress={openModal}>
        <Text style={[styles.inputText, !hasValue() && styles.placeholderText]}>
          {getDisplayValue()}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.optionsContainer}>
                <Text style={styles.modalTitle}>選択してください</Text>

                <ScrollView style={styles.optionsList}>
                  {options.map((option, index) => {
                    const isSelected = multiSelect
                      ? Array.isArray(value) && value.includes(option)
                      : value === option;

                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.optionItem,
                          isSelected && styles.selectedOption,
                        ]}
                        onPress={() => selectOption(option)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.selectedOptionText,
                          ]}
                        >
                          {multiSelect && isSelected ? "✓ " : ""}
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity
                    style={styles.addOptionItem}
                    onPress={showAddNewOption}
                  >
                    <Text style={styles.addOptionText}>+ 入力項目を追加</Text>
                  </TouchableOpacity>
                </ScrollView>

                {showAddInput && (
                  <View style={styles.addInputContainer}>
                    <TextInput
                      style={styles.addInput}
                      placeholder="新しい項目を入力"
                      placeholderTextColor="gray"
                      value={newOption}
                      onChangeText={setNewOption}
                      autoFocus
                    />
                    <View style={styles.addButtonRow}>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddNewOption}
                      >
                        <Text style={styles.addButtonText}>追加</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.addButton, styles.cancelButton]}
                        onPress={() => setShowAddInput(false)}
                      >
                        <Text
                          style={[
                            styles.addButtonText,
                            styles.cancelButtonText,
                          ]}
                        >
                          キャンセル
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>
                    {multiSelect ? "完了" : "閉じる"}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    height: hp(5),
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: hp(1.3),
    paddingHorizontal: wp(2.5),
    borderRadius: moderateScale(5),
    backgroundColor: "white",
    justifyContent: "center",
  },
  inputText: {
    fontSize: moderateScale(16),
    color: "#000",
  },
  placeholderText: {
    color: "gray",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    backgroundColor: "white",
    borderRadius: moderateScale(10),
    minWidth: wp(80),
    maxWidth: wp(90),
    maxHeight: hp(70),
    padding: wp(5),
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: hp(2),
    color: "#000",
  },
  optionsList: {
    maxHeight: hp(40),
  },
  optionItem: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedOption: {
    backgroundColor: "#007AFF",
  },
  optionText: {
    fontSize: moderateScale(16),
    color: "#000",
  },
  selectedOptionText: {
    color: "white",
    fontWeight: "bold",
  },
  addOptionItem: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    borderTopWidth: 2,
    borderTopColor: "#007AFF",
    marginTop: hp(1),
  },
  addOptionText: {
    fontSize: moderateScale(16),
    color: "#007AFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  addInputContainer: {
    marginTop: hp(2),
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: hp(2),
  },
  addInput: {
    height: hp(4),
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: wp(3),
    borderRadius: moderateScale(5),
    backgroundColor: "white",
    marginBottom: hp(1),
  },
  addButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: moderateScale(5),
    minWidth: wp(20),
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: moderateScale(14),
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
  closeButton: {
    marginTop: hp(2),
    backgroundColor: "#f0f0f0",
    paddingVertical: hp(1.5),
    borderRadius: moderateScale(5),
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: moderateScale(16),
    color: "#666666",
    fontWeight: "bold",
  },
});
