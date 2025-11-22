# ドキュメント（簡易版）

現状のサイト構成と運用ポイントをまとめます。アンケートページ（form1〜form3）や生成ページ（/generator 系）は削除済みで、LP をトップに据えたシンプル構成です。

## 1. 画面構成
- `/` : LP（Review GPT のサービス紹介・コンバージョン導線）
- `/admin` : 設定管理。ルータ/AI設定/プロンプト設定などを Netlify Blobs に保存
- `/user` : 店舗・ユーザー情報の入力画面（プロファイル、キーワード、Google マップリンクなど）

## 2. ビルドとデプロイ
```bash
npm install
npm run build   # dist/ を生成
```
Netlify で `publish = "dist"`。GitHub と連携して自動デプロイ想定。

## 3. Netlify Functions
- `config` : 管理画面の設定保存・取得（Blobs 利用）
- `distribute` : ルータ用リンクのローテーション（フォーム削除後も残置）
- `generate` / `prompt-generator` など : プロンプト生成・口コミ生成系。UI は削除済みだが API は残置。
- `survey-submit` / `user-data-submit` / `upload` : 入力データ保存や動作確認用

## 4. 補足
- LP をトップにするため `_redirects` を廃止し、`index.html` 直配置に変更。
- 旧フォーム・生成ページ用のコード/アセットは削除済み。必要になれば別ブランチで復元検討。
