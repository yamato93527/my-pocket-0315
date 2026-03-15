# 要件定義書 — my-pocket

> このドキュメントを読むだけで、AIが同一アプリを再現できるように記述されています。

---

## 1. アプリ概要

**アプリ名:** my-pocket  
**コンセプト:** Pocket / Instapaper のような、個人用の「あとで読む」記事ブックマークアプリ  
**利用者:** 招待制（特定のGoogleアカウントのみログイン可能）  
**デプロイ先:** Vercel

---

## 2. 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 15（App Router） |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS v4 |
| 認証 | Auth.js (NextAuth) v5 beta（Google OAuth） |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| データベース | PostgreSQL（Supabase） |
| HTMLスクレイピング | jsdom（サーバーサイド） |
| バリデーション | Zod v4 |
| アイコン | react-icons v5 |
| フォント | Geist Sans + Geist Mono（`next/font`経由） |

---

## 3. 環境変数（`.env`）

```
DATABASE_URL=         # PostgreSQL接続文字列（Supabaseプーラー）
GOOGLE_CLIENT_ID=     # Google OAuth クライアントID
GOOGLE_CLIENT_SECRET= # Google OAuth クライアントシークレット
AUTH_SECRET=          # NextAuth JWT署名シークレット
ALLOWED_EMAILS=       # ログイン許可メールアドレス（カンマ区切り）
```

---

## 4. ディレクトリ構成

```
section2-end/
├── .env
├── package.json
├── next.config.ts
├── tsconfig.json
├── vercel.json
├── prisma.config.ts
├── auth.ts                              # NextAuth v5 設定
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── lib/
│   ├── prisma.ts                        # Prismaクライアントシングルトン
│   ├── getCurrentUserId.ts              # 認証ユーザーID取得ヘルパー
│   ├── getWhereCondition.ts             # 記事フィルタ条件ビルダー
│   ├── getSearchWhereCondition.ts       # 検索クエリビルダー
│   ├── getPageTitle.ts                  # ページタイトル解決
│   └── validations/
│       ├── urlRegistrationSchema.ts     # URL入力のZodスキーマ
│       └── searchKeywordRegistrationSchema.ts # 検索キーワードのZodスキーマ
│
├── constants/
│   ├── filterItems.ts                   # サイドバーのフィルター定義
│   └── articleData.ts                   # 開発用サンプルデータ
│
├── types/
│   └── next-auth.d.ts                   # セッション型拡張
│
└── app/
    ├── globals.css
    ├── layout.tsx                       # ルートレイアウト（Providers含む）
    ├── page.tsx                         # ルートページ（/articlesへリダイレクト）
    ├── Providers.tsx                    # SessionProviderラッパー
    │
    ├── signin/
    │   └── page.tsx                     # Googleサインインページ
    ├── error/
    │   └── page.tsx                     # 認証エラーページ
    ├── articles/
    │   └── page.tsx                     # メイン記事一覧ページ（要認証）
    │
    ├── api/
    │   ├── auth/[...nextauth]/route.ts  # NextAuthキャッチオールルート
    │   ├── status/route.ts              # GET: 認証状態確認（拡張機能用）
    │   └── save-article/route.ts        # POST: 拡張機能から記事保存
    │
    ├── actions/articles/                # Server Actions
    │   ├── register-article.ts          # フォームアクション（URL登録）
    │   ├── save-article.ts              # DB保存/更新コア
    │   ├── extract-url-data.ts          # URLからメタデータスクレイピング
    │   ├── get-articles.ts              # DB記事取得
    │   ├── toggle-like.ts               # いいねトグル
    │   ├── toggle-archive.ts            # アーカイブトグル
    │   ├── delete-article.ts            # 記事削除
    │   └── checkUrlExists.ts            # URL重複チェック
    │
    └── components/
        ├── MobileLayout.tsx             # クライアントレイアウト（ヘッダー＋サイドバー）
        ├── Header.tsx                   # スティッキーヘッダー
        ├── Sidebar.tsx                  # フィルターサイドバー
        ├── SidebarUserInfo.tsx          # モバイル用ユーザー情報＋ログアウト
        ├── UserIcon.tsx                 # デスクトップ用アバター＋ドロップダウン
        ├── Logo.tsx                     # アプリロゴ＋リンク
        ├── BurgerBtn.tsx                # モバイル用ハンバーガーボタン
        ├── InputFormGroup.tsx           # 検索/URL登録デュアルモード入力
        ├── ToggleSwitch.tsx             # 検索⇔URL登録切り替えスイッチ
        ├── FormMessage.tsx              # インラインエラーメッセージ
        ├── ArticleLists.tsx             # 記事カードグリッド
        ├── LikeButton.tsx               # 楽観的UIのいいねトグル
        ├── ArchiveButton.tsx            # 楽観的UIのアーカイブトグル
        ├── DeleteButton.tsx             # 確認ダイアログ付き削除ボタン
        └── ExtensionSuccess.tsx         # 拡張機能ログイン後の成功ページ
```

---

## 5. データベーススキーマ（Prisma）

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Article {
  id            String   @id @default(cuid())
  title         String
  siteName      String
  description   String?
  siteUpdatedAt String
  thumbnail     String?
  url           String   @unique
  content       String?
  isLiked       Boolean  @default(false)
  isArchived    Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  articles      Article[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

---

## 6. 認証設定（`auth.ts`）

- **プロバイダー:** Google OAuth のみ
- **アダプター:** `@auth/prisma-adapter`（ユーザー/セッションをPostgreSQLに保存）
- **セッション戦略:** JWT
- **`trustHost: true`** — Vercel/プロキシのHostヘッダーを許可
- **メール許可リスト:** `signIn`コールバックで`ALLOWED_EMAILS`環境変数に含まれないメールを拒否
- **JWT/Session:** `jwt`コールバックで`user.id`を`token.sub`に格納、`session`コールバックで`session.user.id`として公開
- **カスタムページ:** サインイン→`/signin`、エラー→`/error`

```typescript
// auth.ts の要点
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/signin", error: "/error" },
  callbacks: {
    signIn: ({ user }) => {
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(",") ?? [];
      return allowedEmails.includes(user.email ?? "");
    },
    jwt: ({ token, user }) => {
      if (user) token.sub = user.id;
      return token;
    },
    session: ({ session, token }) => {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
```

---

## 7. ページ仕様

### 7-1. ルートページ（`app/page.tsx`）
- `/articles`へリダイレクトするだけ

### 7-2. サインインページ（`app/signin/page.tsx`）
- Googleアカウントでサインインボタン（Server Action経由）
- 未認証ユーザーは`/articles`アクセス時にここにリダイレクトされる

### 7-3. エラーページ（`app/error/page.tsx`）
- 認証エラーを表示
- 「サインインページに戻る」リンク

### 7-4. 記事一覧ページ（`app/articles/page.tsx`）
- **要認証**（未認証は`/signin`へリダイレクト）
- クエリパラメータ:
  - `?listtype=` : `all` / `favorite` / `archived`（省略時はホーム=未アーカイブ）
  - `?keyword=` : 検索キーワード
- `ArticleLists`コンポーネントをServer Componentとして呼び出し

---

## 8. コンポーネント仕様

### 8-1. MobileLayout（Client Component）
- サイドバーの開閉状態を管理（`useState`）
- サイドバー開放時はbodyスクロールをロック（`overflow-hidden`）
- `Header`と`Sidebar`を内包

### 8-2. Header
- スティッキー（`sticky top-0`）
- 左：`Logo`
- 中央：`InputFormGroup`
- 右：`UserIcon`（デスクトップのみ）+ `BurgerBtn`（モバイルのみ）

### 8-3. Sidebar
- モバイル：スライドイン（`transform translate-x`制御）
- デスクトップ（`lg:`）：常時表示の左サイドバー
- フィルターリンク一覧（`filterItems`定数から生成）+ `SidebarUserInfo`

### 8-4. InputFormGroup（Client Component）
- **検索モード:** キーワード入力 → `?keyword=`クエリパラメータ付きで`/articles`へリダイレクト
- **URL登録モード:** URL入力 → `register-article` Server Action呼び出し
- `ToggleSwitch`でモード切り替え
- Zodバリデーション（クライアントサイド）
- エラー時は`FormMessage`で表示

### 8-5. ArticleLists（Server Component）
- 記事をカードグリッドで表示
- カード内容: サムネイル画像、タイトル、サイト名、説明文、保存日時
- 各カードに`LikeButton`、`ArchiveButton`、`DeleteButton`

### 8-6. LikeButton / ArchiveButton（Client Component）
- `useTransition` + ローカルstateによる**楽観的UI**更新
- Server Action呼び出し失敗時は状態をロールバック

### 8-7. DeleteButton（Client Component）
- `window.confirm`で確認ダイアログ
- `delete-article` Server Actionをformの`action`propに渡して実行

### 8-8. ExtensionSuccess
- 拡張機能経由ログイン後に表示
- 5秒後にタブを自動クローズ（`window.close()`）

---

## 9. Server Actions仕様

### 9-1. `register-article`
1. フォームデータからURLを取得
2. `urlRegistrationSchema`（Zod）でバリデーション
3. `getCurrentUserId`で認証ユーザーIDを取得（未認証ならエラー）
4. `checkUrlExists`でURL重複チェック（同一ユーザーなら「既に登録済み」エラー）
5. `extract-url-data`でメタデータスクレイピング
6. `save-article`でDB保存
7. `revalidatePath("/articles")`で一覧を再取得

### 9-2. `extract-url-data`
- `fetch`でHTML取得 → `jsdom`でDOMパース
- 取得する情報:
  - `title`: `<title>`タグまたはOG title
  - `siteName`: OG site_name または`location.hostname`
  - `description`: OG description または meta description
  - `thumbnail`: OG image URL
  - `siteUpdatedAt`: OG article:modified_time または article:published_time または現在日時
  - `content`: `<body>`テキストの先頭300文字

### 9-3. `save-article`（upsert）
- `url`をユニークキーとして`upsert`
- 既存URLが別ユーザーのものでも上書き（再帰属）
- `userId`を必ず現在のユーザーIDに更新

### 9-4. `get-articles`
- `userId`でフィルタリング
- `listtype`クエリパラメータで追加フィルタ（`getWhereCondition`ヘルパー使用）:
  - 省略（home）: `isArchived: false`
  - `all`: フィルタなし
  - `favorite`: `isLiked: true`
  - `archived`: `isArchived: true`
- `keyword`がある場合は`getSearchWhereCondition`で`title` / `siteName` / `description` / `content`をOR検索
- `createdAt`降順でソート

### 9-5. `toggle-like` / `toggle-archive`
- 記事IDと現在値を受け取り、`!現在値`で更新
- `revalidatePath("/articles")`

### 9-6. `delete-article`
- 記事IDを受け取り、`prisma.article.delete`
- `revalidatePath("/articles")`

---

## 10. REST API仕様（ブラウザ拡張機能用）

### `GET /api/status`
- **用途:** 拡張機能がログイン状態を確認する
- **CORSヘッダー:** `Access-Control-Allow-Origin: *`
- **レスポンス（認証済み）:**
```json
{ "authenticated": true, "user": { "id": "...", "email": "...", "name": "..." } }
```
- **レスポンス（未認証）:**
```json
{ "authenticated": false }
```
- OPTIONSプリフライトハンドラーあり

### `POST /api/save-article`
- **用途:** 拡張機能から記事を保存する
- **CORSヘッダー:** `Access-Control-Allow-Origin: *`
- **リクエストボディ:**
```json
{ "url": "https://example.com/article" }
```
- 認証チェック → `extract-url-data` → `save-article`の順で処理
- **レスポンス（成功）:**
```json
{ "success": true, "article": { ...articleData } }
```
- **レスポンス（エラー）:**
```json
{ "success": false, "error": "エラーメッセージ" }
```
- OPTIONSプリフライトハンドラーあり

---

## 11. フィルター定数（`constants/filterItems.ts`）

```typescript
export const filterItems = [
  { label: "ホーム",        href: "/articles",                  listtype: null },
  { label: "すべて",        href: "/articles?listtype=all",     listtype: "all" },
  { label: "お気に入り",    href: "/articles?listtype=favorite", listtype: "favorite" },
  { label: "アーカイブ",    href: "/articles?listtype=archived", listtype: "archived" },
];
```

---

## 12. Zodバリデーションスキーマ

```typescript
// lib/validations/urlRegistrationSchema.ts
import { z } from "zod";
export const urlRegistrationSchema = z.object({
  url: z.string().url("有効なURLを入力してください"),
});

// lib/validations/searchKeywordRegistrationSchema.ts
import { z } from "zod";
export const searchKeywordRegistrationSchema = z.object({
  keyword: z.string().min(1, "キーワードを入力してください"),
});
```

---

## 13. レスポンシブデザイン方針

- **モバイル（`lg:`未満）:**
  - ハンバーガーメニューボタンでサイドバー開閉
  - サイドバーはスライドイン表示
  - ユーザー情報・ログアウトはサイドバー内（`SidebarUserInfo`）
- **デスクトップ（`lg:`以上）:**
  - サイドバーは左側に常時表示
  - ユーザーアバターはヘッダー右端（`UserIcon`）
  - ドロップダウンメニューでログアウト

---

## 14. Prismaクライアントシングルトン（`lib/prisma.ts`）

- ビルド時に`DATABASE_URL`が存在しなくてもクラッシュしないよう、JavaScriptの`Proxy`を使った遅延初期化パターンを採用

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new Proxy({} as PrismaClient, {
    get(_, prop) {
      const client = new PrismaClient();
      return client[prop as keyof PrismaClient];
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## 15. ブラウザ拡張機能（別プロジェクト: `udemy-pocket-extension`）

このWebアプリと連携するChrome拡張機能。詳細は別リポジトリを参照。

**主な動作:**
1. 拡張機能アイコンクリック → `/api/status`でログイン確認
2. 未ログインの場合 → アプリのサインインページをタブで開き、ログインを促す
3. ログイン済みの場合 → 現在のタブURLを`/api/save-article`にPOSTして保存
4. 保存結果をポップアップで表示

---

## 16. デプロイ設定（`vercel.json`）

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 17. 実装手順（AIが再現する際の推奨順序）

1. `npx create-next-app@latest my-pocket --typescript --tailwind --app`
2. 必要パッケージをインストール:
   ```bash
   npm install next-auth@beta @auth/prisma-adapter
   npm install prisma @prisma/client @prisma/adapter-pg
   npm install jsdom zod react-icons
   npm install -D @types/jsdom
   ```
3. `.env`ファイルを作成し、環境変数を設定
4. `prisma/schema.prisma`を作成（セクション5参照）
5. `npx prisma migrate dev`でマイグレーション実行
6. `auth.ts`を作成（セクション6参照）
7. `app/api/auth/[...nextauth]/route.ts`を作成
8. `lib/`ファイル群を作成
9. `constants/`ファイルを作成
10. Server Actions（`app/actions/articles/`）を作成
11. UIコンポーネント（`app/components/`）を作成
12. ページ（`app/signin/`, `app/error/`, `app/articles/`）を作成
13. `app/api/status/route.ts`と`app/api/save-article/route.ts`を作成
14. `vercel.json`を作成
15. Vercelにデプロイ、環境変数を設定
