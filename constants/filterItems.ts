type FilterItem = {
  id: string;
  name: string;
  href: string;
};

export const filterItems: FilterItem[] = [
  { id: "home", name: "ホーム", href: "/articles" },
  { id: "all", name: "すべて", href: "/articles?listtype=all" },
  { id: "favorite", name: "お気に入り", href: "/articles?listtype=favorite" },
  { id: "archived", name: "アーカイブ", href: "/articles?listtype=archived" },
];
