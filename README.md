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

## アフィリエイト（A8.net）

広告主: ファルマスタッフ。A8管理画面で発行したタグを**そのまま**使用しています。
`href` と バナー画像URL は改変しないでください（成果が計測されなくなります）。

### 発行タグは2種類（a8matが別物）

| 用途 | a8mat | 設置数 |
| --- | --- | --- |
| テキストリンク | `4BAFPF+711DIA+276A+5ZU2A` | 4か所 |
| バナー 336x280 | `4BAFPF+711DIA+276A+67JU9` | 1か所 |

各リンクに `data-cta` 属性で位置名を付与しています。

| `data-cta` | 位置 | a8mat |
| --- | --- | --- |
| `mid_compact` | 記事前半のコンパクトCTA | 5ZU2A |
| `banner` | A8公式バナー（336x280） | 67JU9 |
| `service_box` | サービス紹介直後のCTAボックス | 5ZU2A |
| `final_message` | 記事末CTA | 5ZU2A |
| `sticky` | 画面下部の追従CTA | 5ZU2A |

### インプレッション計測ピクセル

a8matごとに1つずつ、計2つ設置しています。
**削除するとA8側で表示回数が計測されません。**

```html
<!-- バナー用（<aside class="a8Banner"> 内） -->
<img class="a8Pixel" border="0" width="1" height="1"
     src="https://www19.a8.net/0.gif?a8mat=4BAFPF+711DIA+276A+67JU9" alt="">

<!-- テキストリンク用（body末尾） -->
<img class="a8Pixel" src="https://www19.a8.net/0.gif?a8mat=4BAFPF+711DIA+276A+5ZU2A"
     width="1" height="1" alt="" aria-hidden="true">
```

`.a8Pixel` クラスで非表示にしているだけで、リクエスト自体は送信されます。

### バナーを別素材に差し替える場合

`index.html` の `<!-- ▼▼ A8バナー ... ここから ▼▼ -->` 〜 `<!-- ▲▲ ... ▲▲ -->`
のブロック内を、新しいバナータグに置き換えてください。その際、

- `<a>` に `data-cta="banner"` を残す（Google広告のCV計測に必要）
- 新しい a8mat のインプレッションピクセルも一緒に差し替える
- `<img>` に `class="a8Pixel"` を付ける（非表示化）

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
