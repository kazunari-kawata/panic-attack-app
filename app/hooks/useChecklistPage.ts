/* eslint-disable import/no-unresolved */
import { useEffect, useState } from "react";
import { useChecklistStorage } from "./useChecklistStorage";
import { useKeyboardHandling } from "./useKeyboardHandling";

export const useChecklistPage = () => {
  const {
    checklistData,
    loadChecklist,
    toggleCheck,
    addItem,
    resetAllChecks,
    updateItem,
    deleteItem,
  } = useChecklistStorage();

  const [newItem, setNewItem] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const { keyboardHeight, scrollViewRef } = useKeyboardHandling(showAddInput);

  useEffect(() => {
    loadChecklist();
  }, [loadChecklist]);

  // 項目追加ボタンを押したときの処理
  const handleShowAddInput = () => {
    setShowAddInput(true);
  };

  const handleAddItem = () => {
    const result = addItem(newItem);
    if (result.success) {
      setNewItem("");
      setShowAddInput(false);
    }
  };

  const startEdit = (item: string) => {
    setEditingItem(item);
    setEditText(item);
  };

  const saveEdit = () => {
    if (editingItem) {
      const result = updateItem(editingItem, editText);
      if (result.success) {
        setEditingItem(null);
        setEditText("");
      }
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditText("");
  };

  return {
    // Data
    checklistData,
    newItem,
    setNewItem,
    showAddInput,
    setShowAddInput,
    editingItem,
    editText,
    setEditText,
    keyboardHeight,
    scrollViewRef,

    // Methods
    handleShowAddInput,
    handleAddItem,
    toggleCheck,
    resetAllChecks,
    startEdit,
    saveEdit,
    cancelEdit,
    deleteItem,
  };
};
