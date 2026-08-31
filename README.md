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

ビルド不要。リポジトリ直下をそのまま配信すれば動作します。

## アフィリエイト（A8.net）

- 広告主: ファルマスタッフ
- リンク: `https://px.a8.net/svt/ejp?a8mat=4BAFPF+711DIA+276A+5ZU2A`
- 設置箇所は 5 か所。各リンクに `data-cta` 属性で位置名を付与済み。

| `data-cta` | 位置 |
| --- | --- |
| `mid_compact` | 記事前半のコンパクトCTA |
| `banner` | A8バナー |
| `service_box` | サービス紹介直後のCTAボックス |
| `final_message` | 記事末CTA |
| `sticky` | 画面下部の追従CTA |

### インプレッション計測ピクセル

`index.html` 末尾に A8 の 1x1 計測ピクセルを設置しています。
**削除するとA8側で表示回数が計測されません。**

```html
<img class="a8Pixel" src="https://www19.a8.net/0.gif?a8mat=4BAFPF+711DIA+276A+5ZU2A" width="1" height="1" alt="">
```

### バナーを公式素材に差し替える場合

`index.html` の `<!-- ▼▼ A8バナー ここから ▼▼ -->` 〜 `<!-- ▲▲ A8バナー ここまで ▲▲ -->`
のブロックごと、A8管理画面で発行したバナータグに置き換えてください。
差し替え後も計測を維持するため、`<a>` に `data-cta="banner"` を残すこと。

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

- 5か所すべてのCTAクリックで `googleadservices.com/pagead/conversion/18146496318/` が
  `label=FSoQCOX6quscEL6e9sxD` 付きで送信されることを確認
- ページ読み込み時に GA4・A8ピクセルが発火することを確認
- コンソールエラーなし
