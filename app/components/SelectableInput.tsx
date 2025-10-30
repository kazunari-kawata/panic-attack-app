/* eslint-disable import/no-unresolved */
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
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
  onEditOption?: (oldOption: string, newOption: string) => void;
  onDeleteOption?: (option: string) => void;
  multiSelect?: boolean; // 複数選択フラグ
}

export default function SelectableInput({
  value,
  onValueChange,
  placeholder,
  options,
  onAddOption,
  onEditOption,
  onDeleteOption,
  multiSelect = false, // デフォルトは単一選択
}: SelectableInputProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newOption, setNewOption] = useState("");
  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [editOptionText, setEditOptionText] = useState("");
  const [showKebabMenu, setShowKebabMenu] = useState<string | null>(null);

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

  const handleEditOption = (option: string) => {
    setEditingOption(option);
    setEditOptionText(option);
    setShowKebabMenu(null);
  };

  const handleDeleteOption = (option: string) => {
    if (onDeleteOption) {
      onDeleteOption(option);
      // 削除された項目が選択されている場合は選択を解除
      if (multiSelect && Array.isArray(value)) {
        onValueChange(value.filter((v) => v !== option));
      } else if (value === option) {
        onValueChange(multiSelect ? [] : "");
      }
    }
    setShowKebabMenu(null);
  };

  const saveEditedOption = () => {
    if (editingOption && editOptionText.trim() && onEditOption) {
      onEditOption(editingOption, editOptionText.trim());
      // 編集された項目が選択されている場合は値も更新
      if (multiSelect && Array.isArray(value)) {
        const updatedValues = value.map((v) =>
          v === editingOption ? editOptionText.trim() : v
        );
        onValueChange(updatedValues);
      } else if (value === editingOption) {
        onValueChange(editOptionText.trim());
      }
      setEditingOption(null);
      setEditOptionText("");
    }
  };

  const cancelEdit = () => {
    setEditingOption(null);
    setEditOptionText("");
  };

  const toggleKebabMenu = (option: string) => {
    setShowKebabMenu(showKebabMenu === option ? null : option);
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
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.optionsContainer}>
                  <Text style={styles.modalTitle}>選択してください</Text>

                  <ScrollView
                    style={styles.optionsList}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                  >
                    {options.map((option, index) => {
                      const isSelected = multiSelect
                        ? Array.isArray(value) && value.includes(option)
                        : value === option;

                      // 編集中の項目は編集用のTextInputを表示
                      if (editingOption === option) {
                        return (
                          <View key={index} style={styles.editInputContainer}>
                            <TextInput
                              style={styles.editInput}
                              value={editOptionText}
                              onChangeText={setEditOptionText}
                              autoFocus
                              returnKeyType="done"
                              onSubmitEditing={saveEditedOption}
                            />
                            <View style={styles.editButtonRow}>
                              <TouchableOpacity
                                style={styles.editSaveButton}
                                onPress={saveEditedOption}
                              >
                                <Text style={styles.editSaveButtonText}>
                                  保存
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.editCancelButton}
                                onPress={cancelEdit}
                              >
                                <Text style={styles.editCancelButtonText}>
                                  キャンセル
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      }

                      return (
                        <View
                          key={index}
                          style={[
                            styles.optionItem,
                            isSelected && styles.selectedOption,
                          ]}
                        >
                          <TouchableOpacity
                            style={styles.optionMainArea}
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

                          {(onEditOption || onDeleteOption) && (
                            <TouchableOpacity
                              style={styles.kebabButton}
                              onPress={() => toggleKebabMenu(option)}
                            >
                              <Text
                                style={[
                                  styles.kebabText,
                                  isSelected && styles.selectedOptionText,
                                ]}
                              >
                                ⋯
                              </Text>
                            </TouchableOpacity>
                          )}

                          {showKebabMenu === option && (
                            <View style={styles.kebabMenu}>
                              {onEditOption && (
                                <TouchableOpacity
                                  style={styles.kebabMenuItem}
                                  onPress={() => handleEditOption(option)}
                                >
                                  <Text style={styles.kebabMenuText}>編集</Text>
                                </TouchableOpacity>
                              )}
                              {onDeleteOption && (
                                <TouchableOpacity
                                  style={styles.kebabMenuItem}
                                  onPress={() => handleDeleteOption(option)}
                                >
                                  <Text
                                    style={[
                                      styles.kebabMenuText,
                                      styles.deleteText,
                                    ]}
                                  >
                                    削除
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          )}
                        </View>
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
                        returnKeyType="done"
                        onSubmitEditing={handleAddNewOption}
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
        </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
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
    maxHeight: hp(50), // キーボード用スペースを確保するため少し小さく
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
    maxHeight: hp(30), // キーボード対応のため高さを縮小
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    position: "relative",
  },
  optionMainArea: {
    flex: 1,
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
    paddingBottom: hp(1), // 下部にパディングを追加してキーボードとの間隔を確保
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
  // ケバブメニュー関連のスタイル
  kebabButton: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
  },
  kebabText: {
    fontSize: moderateScale(18),
    color: "#666666",
    fontWeight: "bold",
  },
  kebabMenu: {
    position: "absolute",
    right: wp(3),
    top: hp(4),
    backgroundColor: "white",
    borderRadius: moderateScale(5),
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  kebabMenuItem: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    minWidth: wp(20),
  },
  kebabMenuText: {
    fontSize: moderateScale(16),
    color: "#333333",
  },
  deleteText: {
    color: "#FF3B30",
  },
  // 編集機能関連のスタイル
  editInputContainer: {
    padding: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#f9f9f9",
  },
  editInput: {
    height: hp(4),
    borderColor: "#007AFF",
    borderWidth: 1,
    paddingHorizontal: wp(3),
    borderRadius: moderateScale(5),
    backgroundColor: "white",
    marginBottom: hp(1),
  },
  editButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  editSaveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    borderRadius: moderateScale(5),
    minWidth: wp(15),
    alignItems: "center",
  },
  editSaveButtonText: {
    color: "white",
    fontSize: moderateScale(12),
    fontWeight: "bold",
  },
  editCancelButton: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#cccccc",
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    borderRadius: moderateScale(5),
    minWidth: wp(15),
    alignItems: "center",
  },
  editCancelButtonText: {
    color: "#666666",
    fontSize: moderateScale(12),
  },
});
