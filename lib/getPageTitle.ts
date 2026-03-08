export function getPageTitle(listtype: string) {
  switch(listtype) {
    case "all":
      return "すべて"; // "all" or "everything"
    case "favorite":
      return "お気に入り"; // "favorites"
    case "archived":
      return "アーカイブ"; // "archive"
    default:
      return "ホーム"; // "home"
  }
}
