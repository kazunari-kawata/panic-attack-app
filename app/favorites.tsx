import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AddFavoriteForm from "./components/AddFavoriteForm";
import FavoriteItem from "./components/FavoriteItem";
import FavoritesHeader from "./components/FavoritesHeader";
import { moderateScale } from "./utils/responsive";
import { convertToAppUrl } from "./utils/urlConverter";

interface FavoriteItemType {
  id: string;
  title: string;
  url: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const initialFavoriteItems: FavoriteItemType[] = [
  {
    id: "1",
    title: "落ち着く音楽 - 自然の音",
    url: "https://www.youtube.com/results?search_query=relaxing+nature+sounds",
    icon: "musical-notes-outline",
  },
];

const STORAGE_KEY = "@favoriteItems";

export default function FavoritesScreen() {
  const [favoriteItems, setFavoriteItems] =
    useState<FavoriteItemType[]>(initialFavoriteItems);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);

  // AsyncStorageからデータを読み込み
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // 初期データとマージ（新規ユーザーのために）
          const merged = [
            ...initialFavoriteItems,
            ...parsed.filter(
              (item: FavoriteItemType) =>
                !initialFavoriteItems.some((init) => init.id === item.id)
            ),
          ];
          setFavoriteItems(merged);
        }
      } catch (error) {
        console.error("お気に入りデータの読み込みに失敗:", error);
      }
    };
    loadFavorites();
  }, []);

  // データを保存
  const saveFavorites = async (items: FavoriteItemType[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setFavoriteItems(items);
    } catch (error) {
      console.error("お気に入りデータの保存に失敗:", error);
      Alert.alert("エラー", "データの保存に失敗しました");
    }
  };

  const openLink = async (url: string) => {
    try {
      const appUrl = convertToAppUrl(url);
      const supported = await Linking.canOpenURL(appUrl);

      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        // アプリURLがサポートされていない場合は元のURLで開く
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("リンクを開けませんでした:", error);
      Alert.alert("エラー", "リンクを開けませんでした");
    }
  };

  // アイテムを削除
  const deleteItem = (id: string) => {
    Alert.alert("削除確認", "このお気に入りを削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: () => {
          const updated = favoriteItems.filter((item) => item.id !== id);
          saveFavorites(updated);
        },
      },
    ]);
  };

  // 新しいアイテムを追加
  const addItem = () => {
    if (!newTitle.trim() || !newUrl.trim()) {
      Alert.alert("エラー", "タイトルとURLは必須です");
      return;
    }

    const newItem: FavoriteItemType = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      url: newUrl.trim(),
      icon: "link-outline",
    };

    const updated = [...favoriteItems, newItem];
    saveFavorites(updated);

    // フォームをリセット
    setNewTitle("");
    setNewUrl("");

    // 編集モードを完了
    setIsEditMode(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <FavoritesHeader
          isEditMode={isEditMode}
          onEditToggle={() => setIsEditMode(!isEditMode)}
        />

        <View style={styles.itemsContainer}>
          {favoriteItems.map((item) => (
            <FavoriteItem
              key={item.id}
              item={item}
              isEditMode={isEditMode}
              onPress={() => !isEditMode && openLink(item.url)}
              onDelete={() => deleteItem(item.id)}
            />
          ))}
        </View>

        {isEditMode && (
          <AddFavoriteForm
            newTitle={newTitle}
            newUrl={newUrl}
            onTitleChange={setNewTitle}
            onUrlChange={setNewUrl}
            onSubmit={addItem}
          />
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ※ リンクは外部サイト（YouTubeなど）へ移動します
          </Text>
          <Text style={styles.footerText}>
            ※ コンテンツは参考情報です。専門的な治療を優先してください
          </Text>
          {isEditMode && (
            <Text style={styles.footerText}>
              ※ 長押しでアイテムを削除できます
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  flex: {
    flex: 1,
  },
  itemsContainer: {
    paddingHorizontal: moderateScale(15),
    paddingTop: moderateScale(10),
  },
  footer: {
    padding: moderateScale(20),
    alignItems: "center",
  },
  footerText: {
    fontSize: moderateScale(12),
    color: "#999",
    textAlign: "center",
    marginBottom: moderateScale(4),
  },
});
