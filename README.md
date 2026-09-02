# 薬剤師キャリア相談室 LP

PPCアフィリエイト用ランディングページ（静的サイト）。
本番: https://pharma-career-note.tommy-momoka.chatgpt.site/

## 構成

| ファイル | 役割 |
| --- | --- |
| `index.html` | LP本体。ビルド不要の静的HTML |
| `styles.css` | スタイル。末尾にA8バナー用CSSを追記 |
| `tracking.js` | Google広告コンバージョン・GA4イベントの発火 |
| `pharmacist-hero.png` | ヒーロー画像（CSSから `/pharmacist-hero.png` で参照） |
| `_headers` | Cloudflare用のキャッシュ・セキュリティヘッダ |
| `wrangler.jsonc` | Cloudflareデプロイ設定 |
| `.assetsignore` | Cloudflareへアップロードしないファイルの指定 |

ビルド不要。リポジトリ直下をそのまま配信すれば動作します。

## デプロイ（Cloudflare）

`lp4`（mikeiken-dojo）と同じ構成。`main` への push で自動デプロイされます。

- プロジェクト名: `pharma-career-note`
- アカウント: `Momotaso0514@gmail.com's Account` (`bedcbd62f6e3aa52ec0625cd09e19d88`)
- ビルドコマンド: なし / 出力ディレクトリ: リポジトリ直下

手動デプロイする場合:

```bash
npx wrangler login     # 初回のみ
npx wrangler deploy
```

`_headers` でHTMLは `max-age=0, must-revalidate` にしています。
計測タグを修正したときに古いHTMLが配信され続けるのを防ぐためです。

### ⚠️ アップロード除外は `.assetsignore` で行う

`wrangler.jsonc` の `assets.exclude` は **Workers Assets では無効なオプション**で、
書いても警告なく無視されます。これに気づかず初回デプロイした際、
`.git/` ディレクトリ一式が公開状態になりました（`.assetsignore` 追加後は404）。

除外は必ず `.assetsignore`（gitignore形式）に書き、デプロイ後に確認すること:

```bash
curl -o /dev/null -w "%{http_code}\n" https://<デプロイ先>/.git/config   # 404であること
```

## アフィリエイト（A8.net）

広告主: ファルマスタッフ。A8管理画面で発行したタグをそのまま使用しています。
`href`・バナー画像URL・インプレッションピクセルは改変しないでください。

| 用途 | a8mat | 設置数 |
| --- | --- | --- |
| テキストリンク | `4BAFPF+711DIA+276A+5ZU2A` | 5か所 |
| バナー 350x240 | `4BAFPF+711DIA+276A+686ZL` | 1か所 |

CTAごとに `data-cta` で位置名を付け、GA4でクリック位置を判別できます。

| `data-cta` | 位置 |
| --- | --- |
| `hero` | ファーストビュー |
| `article_mid_1` | 記事前半 |
| `official_banner` | A8公式バナー |
| `article_mid_2` | サービス紹介後 |
| `article_final` | 記事末 |
| `sticky_footer` | 画面下部の追従CTA |

A8インプレッション計測には、テキスト用 `www15.a8.net / 5ZU2A` とバナー用 `www18.a8.net / 686ZL` のピクセルを使用しています。

## 計測タグ

| 種別 | ID |
| --- | --- |
| GA4 | `G-5M4MMZRL4E` |
| Google広告 | `AW-18146496318` |
| コンバージョンラベル | `FSoQCOX6quscEL6e9sxD` |

### コンバージョンの発火タイミング

**ページ読み込み時ではなく、A8アフィリリンクのクリック時**に発火させています（`tracking.js`）。

成果地点（ファルマスタッフの申込完了ページ）は広告主のドメインにあり、
こちらからタグを設置できません。そのため
「アフィリリンクのクリック = 計測上のコンバージョン」として扱っています。

Google広告が発行するスニペットをそのまま `<head>` に貼ると
**訪問者全員がコンバージョン扱い**になり、入札の最適化が壊れます。

### 実際に成果が出たかの確認

Google広告側で分かるのは「クリックまで」です。
実際の申込（承認額）はA8管理画面と突き合わせて確認してください。

### GA4に送っているイベント

- `affiliate_click` — パラメータ: `cta_position`, `link_url`, `advertiser`
- `scroll_depth` — パラメータ: `percent_scrolled`（25 / 50 / 75 / 90）

## 動作確認済み

- バナー含む5か所すべてのCTAクリックで `googleadservices.com/pagead/conversion/18146496318/` が
  `label=FSoQCOX6quscEL6e9sxD` 付きで送信されることを確認
- ページ読み込み時に GA4・A8バナー画像・A8ピクセル2種が発火することを確認
- バナー画像が 336x280 で正しく表示されることを確認
- コンソールエラーなし
