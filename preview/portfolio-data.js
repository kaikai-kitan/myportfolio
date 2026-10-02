/*
 * このファイルが内容の編集場所です。HTMLを変更せずに文章と作品を更新できます。
 * 応募先を増やすときは audiences の iot を複製し、会社名の代わりに任意のIDをキーにします。
 * 例: audiences.companyA = { ... } → ?for=companyA
 * URLの切り替えは表示の出し分けです。公開ファイルの内容は誰でも閲覧できます。
 */
window.PORTFOLIO = {
  // 内容を入れ終わったら false にすると「レイアウトプレビュー」表記が消えます。
  template: true,
  defaultAudience: "iot",
  person: {
    name: "岩田 快道", roman: "KAIDO IWATA", initials: "KI",
    affiliation: "京都産業大学大学院 先端情報学研究科",
    introduction: "ソフトウェア開発から、IoT・デジタルファブリケーションまで。領域を横断しながら、現実空間の課題に向き合うモノづくりに取り組んでいます。",
    email: "i2686019@cc.kyoto-su.ac.jp",
    github: "https://github.com/kaikai-kitan",
    // 相対パスの例: assets/portrait.jpg。空欄ならイニシャルを表示します。
    portrait: "",
    vision: "技術を、人の暮らしにつながるかたちに。",
    story: "大学時代の後半には、屋台活動にも取り組んできました。画面の中だけでなく、人が集まる現場での経験も、私のモノづくりを形づくる一つの要素です。"
  },
  audiences: {
    iot: {
      label: "IoT・ものづくり", company: "",
      eyebrow: "PHYSICAL COMPUTING / PROTOTYPING",
      title: ["画面の外まで、", "つくりにいく。"],
      lead: "ソフトウェアとハードウェアのあいだを行き来しながら、アイデアを、触れられる体験へ。",
      focus: "ソフトウェア × ハードウェア",
      projectOrder: ["physical", "web", "yatai"],
      skillOrder: ["physical", "software", "creative"]
    },
    web: {
      label: "Web・アプリ開発", company: "",
      eyebrow: "SOFTWARE / INTERACTION",
      title: ["日々の気づきを、", "使えるかたちに。"],
      lead: "身近な課題を出発点に、使う人を思い浮かべながら、アイデアをソフトウェアへ。",
      focus: "課題発見 × ソフトウェア開発",
      projectOrder: ["web", "physical", "yatai"],
      skillOrder: ["software", "physical", "creative"]
    },
    experience: {
      label: "企画・体験づくり", company: "",
      eyebrow: "EXPERIENCE / COMMUNITY",
      title: ["つくる。その先の、", "出会いまで。"],
      lead: "屋台も、映像も、プロダクトも。人と接する場から考え、体験をつくることに関心があります。",
      focus: "企画 × 現場での体験づくり",
      projectOrder: ["yatai", "web", "physical"],
      skillOrder: ["creative", "physical", "software"]
    }
  },
  // 空欄はプレビュー用の記入枠になります。実績・数値・担当範囲は確認してから記入します。
  projects: {
    physical: {
      title: "Electromagnetic Informatics",
      category: "PHYSICAL COMPUTING", kind: "physical", image: "", imageAlt: "",
      summary: "ハードウェア領域の制作・探究。実物と試作過程を中心に紹介するケーススタディ。",
      tags: ["ハードウェア", "プロトタイピング"],
      period: "", team: "", role: "", tools: [],
      problem: "", intention: "", process: "", outcome: "", learning: "",
      processImages: [],
      link: "https://github.com/kaikai-kitan/Electromagnetic-Informatics", linkLabel: "GitHubで見る"
    },
    web: {
      title: "yarikuri", category: "WEB APPLICATION", kind: "web", image: "", imageAlt: "",
      summary: "Webアプリケーションの制作。課題の発見から、設計・実装までを紹介するケーススタディ。",
      tags: ["Webアプリ", "UI / UX"],
      period: "", team: "", role: "", tools: [],
      problem: "", intention: "", process: "", outcome: "", learning: "",
      processImages: [],
      link: "https://github.com/kaikai-kitan/yarikuri", linkLabel: "GitHubで見る"
    },
    yatai: {
      title: "屋台から、はじまる。", category: "REAL-WORLD EXPERIENCE", kind: "yatai", image: "", imageAlt: "",
      summary: "大学時代の屋台活動。企画や準備、当日の工夫を通して、人と場に向き合った経験を紹介します。",
      tags: ["屋台活動", "体験づくり"],
      period: "", team: "", role: "", tools: [],
      problem: "", intention: "", process: "", outcome: "", learning: "",
      processImages: [], link: "", linkLabel: ""
    }
  },
  skills: {
    physical: { number: "01", title: "現実の世界につなぐ", english: "HARDWARE & MAKING", text: "ハードウェアとソフトウェアを組み合わせるための技術。", tools: ["Arduino", "C", "デジタルファブリケーション"] },
    software: { number: "02", title: "動く仕組みをつくる", english: "SOFTWARE DEVELOPMENT", text: "アイデアを動かし、試しながら改善するための技術。", tools: ["JavaScript", "Python", "C#", "Unity", "GitHub"] },
    creative: { number: "03", title: "伝わるかたちにする", english: "DESIGN & VISUAL", text: "伝えたいことを、画面や映像として表現するための技術。", tools: ["Figma", "After Effects", "Premiere Pro"] }
  }
};
