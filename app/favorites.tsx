import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale } from "./utils/responsive";

interface FavoriteItem {
  id: string;
  title: string;
  url: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const initialFavoriteItems: FavoriteItem[] = [
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
    useState<FavoriteItem[]>(initialFavoriteItems);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const [keyboardHeight, setKeyboardHeight] = useState(0);

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
              (item: FavoriteItem) =>
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

  // キーボードの表示/非表示を監視
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // キーボード表示時に編集モードなら画面の50%までスクロール
        if (isEditMode && scrollViewRef.current) {
          setTimeout(() => {
            const screenHeight = Dimensions.get("window").height;
            scrollViewRef.current?.scrollTo({
              x: 0,
              y: screenHeight * 0.35, // 画面の35%分スクロール
              animated: true,
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
  }, [isEditMode]); // isEditModeの依存を復活

  // データを保存
  const saveFavorites = async (items: FavoriteItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setFavoriteItems(items);
    } catch (error) {
      console.error("お気に入りデータの保存に失敗:", error);
      Alert.alert("エラー", "データの保存に失敗しました");
    }
  };

  // URLをプラットフォーム固有のアプリURLに変換する関数
  const convertToAppUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);

      // YouTube
      if (
        urlObj.hostname.includes("youtube.com") ||
        urlObj.hostname.includes("youtu.be")
      ) {
        if (urlObj.pathname.includes("/watch")) {
          const videoId = urlObj.searchParams.get("v");
          if (videoId) return `youtube://watch?v=${videoId}`;
        } else if (urlObj.pathname.includes("/playlist")) {
          const listId = urlObj.searchParams.get("list");
          if (listId) return `youtube://playlist?list=${listId}`;
        } else if (urlObj.pathname.includes("/channel/")) {
          const channelId = urlObj.pathname.split("/channel/")[1];
          if (channelId) return `youtube://channel/${channelId}`;
        }
      }

      // Twitter/X
      if (
        urlObj.hostname.includes("twitter.com") ||
        urlObj.hostname.includes("x.com")
      ) {
        const pathParts = urlObj.pathname.split("/");
        if (pathParts[1] && !pathParts[1].startsWith("@")) {
          return `twitter://user?screen_name=${pathParts[1]}`;
        }
      }

      // Instagram
      if (urlObj.hostname.includes("instagram.com")) {
        const pathParts = urlObj.pathname.split("/");
        if (pathParts[1] === "p") {
          return `instagram://media?id=${pathParts[2]}`;
        } else if (pathParts[1]) {
          return `instagram://user?username=${pathParts[1]}`;
        }
      }

      // TikTok
      if (urlObj.hostname.includes("tiktok.com")) {
        const pathParts = urlObj.pathname.split("/");
        if (pathParts[1] === "@") {
          return `tiktok://user?username=${pathParts[2]}`;
        }
      }

      // Spotify
      if (urlObj.hostname.includes("spotify.com")) {
        const pathParts = urlObj.pathname.split("/");
        if (pathParts[1] === "track") {
          return `spotify://track/${pathParts[2]}`;
        } else if (pathParts[1] === "album") {
          return `spotify://album/${pathParts[2]}`;
        } else if (pathParts[1] === "artist") {
          return `spotify://artist/${pathParts[2]}`;
        }
      }

      // 変換できない場合は元のURLを返す
      return url;
    } catch (error) {
      console.error("URL変換エラー:", error);
      return url;
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

    const newItem: FavoriteItem = {
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

  const categories = ["お気に入り"]; // 固定カテゴリ

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      contentInset={{ bottom: keyboardHeight }}
      automaticallyAdjustKeyboardInsets={true}
    >
      <View style={styles.header}>
        <Text style={styles.title}>お気に入りコンテンツ</Text>
        <Text style={styles.subtitle}>
          発作時に心を落ち着かせるためのコンテンツ集
        </Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditMode(!isEditMode)}
        >
          <Ionicons
            name={isEditMode ? "checkmark-outline" : "create-outline"}
            size={moderateScale(20)}
            color="#5D866C"
          />
          <Text style={styles.editButtonText}>
            {isEditMode ? "完了" : "編集"}
          </Text>
        </TouchableOpacity>
      </View>

      {categories.map((category) => (
        <View key={category} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{category}</Text>
          {favoriteItems.map((item) => (
            <View key={item.id} style={styles.itemWrapper}>
              <TouchableOpacity
                style={styles.favoriteItem}
                onPress={() => !isEditMode && openLink(item.url)}
                onLongPress={() => isEditMode && deleteItem(item.id)}
              >
                <View style={styles.itemContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={item.icon}
                      size={moderateScale(24)}
                      color="#5D866C"
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                  </View>
                  {!isEditMode && (
                    <Ionicons
                      name="open-outline"
                      size={moderateScale(20)}
                      color="#C2A68C"
                    />
                  )}
                </View>
              </TouchableOpacity>
              {isEditMode && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteItem(item.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={moderateScale(20)}
                    color="#fff"
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      ))}

      {isEditMode && (
        <View style={styles.addForm}>
          <Text style={styles.formTitle}>新しいお気に入りを追加</Text>

          <TextInput
            style={styles.input}
            placeholder="タイトル"
            value={newTitle}
            onChangeText={setNewTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="URL"
            value={newUrl}
            onChangeText={setNewUrl}
            keyboardType="url"
          />

          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Text style={styles.addButtonText}>追加</Text>
          </TouchableOpacity>
        </View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F0",
  },
  header: {
    padding: moderateScale(20),
    backgroundColor: "#E6D8C3",
    alignItems: "center",
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#5D866C",
    marginBottom: moderateScale(8),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: "#C2A68C",
    textAlign: "center",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F0",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(15),
    marginTop: moderateScale(10),
  },
  editButtonText: {
    fontSize: moderateScale(14),
    color: "#5D866C",
    marginLeft: moderateScale(4),
  },
  categorySection: {
    marginBottom: moderateScale(20),
    paddingHorizontal: moderateScale(15),
  },
  categoryTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#5D866C",
    marginBottom: moderateScale(10),
    marginTop: moderateScale(10),
  },
  itemWrapper: {
    position: "relative",
  },
  favoriteItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(15),
  },
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "#F5F5F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(15),
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#333",
  },
  deleteButton: {
    position: "absolute",
    top: moderateScale(5),
    right: moderateScale(5),
    backgroundColor: "#C2A68C",
    borderRadius: moderateScale(15),
    width: moderateScale(30),
    height: moderateScale(30),
    justifyContent: "center",
    alignItems: "center",
  },
  addForm: {
    backgroundColor: "#FFFFFF",
    margin: moderateScale(15),
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  formTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#5D866C",
    marginBottom: moderateScale(15),
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E6D8C3",
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    marginBottom: moderateScale(10),
    fontSize: moderateScale(14),
    backgroundColor: "#F5F5F0",
  },
  addButton: {
    backgroundColor: "#5D866C",
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: moderateScale(16),
    fontWeight: "bold",
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
