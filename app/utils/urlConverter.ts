// URLをプラットフォーム固有のアプリURLに変換する関数
export const convertToAppUrl = (url: string): string => {
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