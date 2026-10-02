/* 内容はこのファイルで編集します。?for=iot / web / experience で応募先別の構成を選択。
 * audiences に任意のIDを追加すれば、そのIDの共有URLを作れます。
 * 公開ファイル内の設定は閲覧可能です。非公開情報は記載しないでください。
 */
window.PORTFOLIO = {
  template: true,
  defaultAudience: 'iot',
  entrance: {
    title: ['夜を行く！', '屋台人！'],
    // 自作の暖簾画像があれば相対パスを指定。空欄ならCSSの暖簾を使用します。
    curtainImage: '',
    // 両手を広げた写真に差し替えるパス。空欄ならシルエットの見本を表示します。
    welcomeImage: '',
    welcomeAlt: '両手を広げた岩田快道の写真'
  },
  person: {
    name: '岩田 快道', reading: 'いわた かいど', roman: 'KAIDO IWATA',
    affiliation: '京都産業大学大学院 先端情報学研究科',
    grade: '修士1年',
    introduction: 'ソフトウェア開発、IoT、デジタルファブリケーション、映像制作に取り組んでいます。大学時代の後半には屋台活動も行っています。',
    research: '',
    interests: 'IoT・ハードウェア / ソフトウェア開発',
    email: 'i2686019@cc.kyoto-su.ac.jp',
    github: 'https://github.com/kaikai-kitan',
    // PDFを用意したら assets/resume.pdf などを指定。
    resume: ''
  },
  chapters: [
    { label: '仕込み', title: 'アイデア・設計', caption: 'アイデア出し、ハッカソン、設計の記録', image: '', alt: '', detail: '' },
    { label: '営業', title: '開発・出店', caption: '実装、屋台の出店、プレゼンの記録', image: '', alt: '', detail: '' },
    { label: '笑顔', title: 'チーム・利用者', caption: 'チームでの活動、利用者の反応', image: '', alt: '', detail: '' },
    { label: '帰宅', title: '振り返り・改善', caption: '活動後の振り返り、次の試作への改善', image: '', alt: '', detail: '' }
  ],
  audiences: {
    iot: { label: 'IoT・ものづくり', company: '', interests: 'IoT・ハードウェア / ソフトウェア開発', featuredProject: 'physical', galleryOrder: ['web', 'yatai'], skillOrder: ['physical', 'software', 'creative'] },
    web: { label: 'Web・アプリ開発', company: '', interests: 'Web・アプリケーション開発', featuredProject: 'web', galleryOrder: ['physical', 'yatai'], skillOrder: ['software', 'physical', 'creative'] },
    experience: { label: '企画・体験づくり', company: '', interests: '企画・屋台活動 / 映像制作', featuredProject: 'yatai', galleryOrder: ['web', 'physical'], skillOrder: ['creative', 'physical', 'software'] }
  },
  // 趣味は内容共有後に差し替えます。項目は追加・削除できます。
  hobbies: [
    { title: '趣味 01', description: '', image: '', imageAlt: '' },
    { title: '趣味 02', description: '', image: '', imageAlt: '' }
  ],
  // level: null = 未設定、1 = 学習中、2 = 制作経験あり、3 = 自力で設計・改善できる。
  // evidence は使用した作品や担当の記録。確認できる内容だけを記入します。
  skills: {
    physical: { category: 'ハードウェア', items: [
      { name: 'Arduino', level: null, evidence: '' },
      { name: 'C', level: null, evidence: '' },
      { name: 'デジタル\nファブリケーション', level: null, evidence: '' }
    ] },
    software: { category: 'ソフトウェア', items: [
      { name: 'JavaScript', level: null, evidence: '' },
      { name: 'Python', level: null, evidence: '' },
      { name: 'C# / Unity', level: null, evidence: '' }
    ] },
    creative: { category: 'デザイン・映像', items: [
      { name: 'Figma', level: null, evidence: '' },
      { name: 'After Effects', level: null, evidence: '' },
      { name: 'Premiere Pro', level: null, evidence: '' }
    ] }
  },
  projects: {
    physical: {
      title: 'Electromagnetic Informatics', category: 'ハードウェア',
      image: '', imageAlt: '', imageCaption: '完成品・試作品の写真',
      summary: '', period: '', team: '', role: '', tools: [], outcome: '',
      problem: '', intention: '', process: '', learning: '', processImages: [],
      link: 'https://github.com/kaikai-kitan/Electromagnetic-Informatics', linkLabel: 'GitHubで見る',
      // null にすると裏メニューを非表示。実際に起きた出来事を記入します。
      behindScenes: { title: '', problem: '', solution: '', lesson: '' }
    },
    web: {
      title: 'yarikuri', category: 'Webアプリケーション',
      image: '', imageAlt: '', imageCaption: 'アプリ画面・利用場面の画像',
      summary: '', period: '', team: '', role: '', tools: [], outcome: '',
      problem: '', intention: '', process: '', learning: '', processImages: [],
      link: 'https://github.com/kaikai-kitan/yarikuri', linkLabel: 'GitHubで見る', behindScenes: null
    },
    yatai: {
      title: '屋台活動', category: '企画・運営',
      image: '', imageAlt: '', imageCaption: '屋台・出店当日の写真',
      summary: '大学時代の後半に行った屋台活動。', period: '', team: '', role: '', tools: [], outcome: '',
      problem: '', intention: '', process: '', learning: '', processImages: [],
      link: '', linkLabel: '', behindScenes: null
    }
  }
};
