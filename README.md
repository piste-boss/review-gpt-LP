# oisoya_review

大磯屋さまの口コミ訴求用 LP と管理画面のリポジトリです。  
現状は LP をトップ（`/`）に配置し、運用用に管理画面 `/admin` とユーザー設定 `/user` を残しています。

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

## ページ構成

- `/` : LP（レビューGPTサービス紹介）
- `/admin` : 設定管理ページ（ルータ／AI設定／プロンプト設定など）
- `/user` : ユーザー・店舗情報入力ページ

※ 以前あったアンケート (`form1`〜`form3`) と生成ページ (`/generator` など) は削除済みです。

## Netlify Functions

- `/.netlify/functions/config` : ルータ設定およびAI設定のCRUD。Netlify Blobsに保持します。
- `/.netlify/functions/distribute` : レベルに応じてリンク先をローテーションして返却します。
- `/.netlify/functions/generate` : GASアプリから取得したデータをGemini APIに渡し、口コミ文章を生成します。
- `/.netlify/functions/upload` : Blobs動作確認用のサンプル。

### 環境変数

Netlify 上で以下を設定してください。

- `NETLIFY_SITE_ID`
- `NETLIFY_BLOBS_TOKEN`（もしくは `NETLIFY_AUTH_TOKEN`）

Gemini APIキーは管理画面の「AI設定」から登録します。保存するとサーバ側のBlobsに暗号化されず保存されるため取り扱いにはご注意ください（画面上にはマスクされた形で表示されます）。
