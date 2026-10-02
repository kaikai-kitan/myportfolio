# Kaido Iwata — Portfolio template

IoT・ものづくりを軸にしたポートフォリオの型です。ビルドやnpmのインストールなしで動くHTML / CSS / JavaScriptで構成しています。

- テンプレート確認: https://kaikai-kitan.github.io/myportfolio/preview/?edit=1
- 閲覧用の例: https://kaikai-kitan.github.io/myportfolio/preview/?for=iot
- 従来の公開ページ: https://kaikai-kitan.github.io/myportfolio/

現段階では `preview/` に確認版を配置しています。イラストはレイアウト用の見本です。未確認の制作期間・成果・担当範囲などは記入枠として表示します。

## 編集する場所

| ファイル | 内容 |
| --- | --- |
| `portfolio-data.js` | 自己紹介、作品、スキル、応募先別の構成 |
| `index.html` | ページの構造と検索向け設定 |
| `styles.css` | 色・余白・書体・スマートフォン表示 |
| `app.js` | 応募先別の表示、作品詳細、屋台の演出 |
| `assets/` | 見本イラストと、これから追加する画像 |
| `CONTENT-TEMPLATE.md` | 次に共有してほしい内容の記入用シート |

## 応募先ごとに変える

`portfolio-data.js` の `audiences` に定義します。用意した3種類は `iot`、`web`、`experience`。`defaultAudience` は `iot` です。

- `title` / `lead`: 冒頭の見出しと紹介文
- `projectOrder`: 掲載する作品のID。先頭が大きく表示されます。配列から外した作品は一覧に出ません。
- `skillOrder`: 掲載するスキルのIDと表示順
- `introduction` / `vision`: 任意。応募先専用の自己紹介・展望
- `projectOverrides`: 任意。同じ作品でも強調する概要や担当の説明を変更できます。
- `company`: 編集パネル内の識別用。本文には会社名を出しません。

例として、`audiences` の中に次の設定を追加します（カンマの位置に注意）。`projectOrder` や `skillOrder` は既存のIDを指定してください。

```js
companyA: {
  label: "IoT・試作開発",
  company: "応募先A", // 管理用。実際の会社名でも任意の呼び名でも構いません。
  eyebrow: "PHYSICAL COMPUTING / PROTOTYPING",
  title: ["画面の外まで、", "つくりにいく。"],
  lead: "この応募先に伝えたい、自分の強みを記入します。",
  focus: "試作 × 現場での検証",
  projectOrder: ["physical", "yatai", "web"],
  skillOrder: ["physical", "software", "creative"],
  introduction: "応募先に合わせた自己紹介。省略すると共通の紹介文になります。",
  vision: "その仕事で実現したいこと。",
  projectOverrides: {
    physical: {
      summary: "この会社に伝えたい観点から書いた作品概要。",
      process: "検証や改善など、特に見せたいプロセス。"
    }
  }
}
```

共有URLは `?for=companyA`。編集用は `?for=companyA&edit=1` です。
編集パネルの「表示URLをコピー」は `edit=1` を外したURLをコピーします。設定はファイルに保存されるので、URLを受け取った相手も同じ構成を見られます。存在しないIDは既定のIoT版に戻ります。

これは同じ公開サイト内の見せ方の切り替えです。会社名や非表示にした内容も公開ファイルから閲覧できるので、非公開情報を格納する用途ではありません。屋台の短い人柄紹介は共通セクションとして残ります。

## 作品を追加・更新する

`projects` の項目をコピーして新しいIDを付け、`projectOrder` に追加します。

- `image`: メイン画像の相対パス。例 `assets/work-01.jpg`
- `imageAlt`: 画像が伝えている内容
- `period` / `team` / `role` / `tools`: 期間、体制、担当、技術
- `problem` / `intention` / `process` / `outcome` / `learning`: 課題、意図、過程、成果、学び
- `processImages`: 補助画像。以下の形式で2枚程度

```js
processImages: [
  { src: "assets/sketch.jpg", alt: "初期構想のスケッチ", caption: "検討した案と選択理由" },
  { src: "assets/prototype.jpg", alt: "検証中の試作品", caption: "試して分かったこと" }
]
```

スキルは星による自己評価を置かず、扱った技術と制作の証拠を対応づける構成です。掲載作品は件数を増やすより、応募先に合ったものを3〜5件程度選ぶ想定です。

## ローカル確認

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

http://127.0.0.1:8765/?edit=1 で確認できます。スマートフォン幅ではパネルは最初に折りたたまれます。作品詳細は閉じるボタン・Escキー・背景クリックで閉じられます。

屋台は専用のスペース内でスクロールに合わせて移動します。OSの「視差効果を減らす」などの設定が有効なら静止します。

## 内容完成後の公開

1. 画像と文章を入力し、空欄や見本が残っていないことを確認する。
2. `portfolio-data.js` の `template` を `false` にする。
3. 検索エンジンへの掲載も開始する場合は、`index.html` の `<meta name="robots" content="noindex">` を削除する。
4. HTML・CSS・JavaScript・`assets/` をリポジトリのルートに配置する。GitHub Pages は `main` のルートを公開しているので、自動反映される。

GitHub側ではこのテンプレート一式は現在 `preview/` に置かれています。このワークスペースではルートがテンプレートの編集元です。更新するときは確認版を `preview/` に配置し、完成時にルートへの切り替えを行います。
