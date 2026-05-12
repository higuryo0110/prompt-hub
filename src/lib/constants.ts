/**
 * サイト全体で使用する定数
 * カスタムドメイン取得後は SITE_URL のみを書き換えればOK
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://promptshare.jp'
export const SITE_NAME = 'プロンプトシェア'
export const SITE_NAME_EN = 'PromptShare'
export const SITE_DESCRIPTION =
  'プロンプトシェアは、ChatGPT・Claude・Gemini・Midjourneyなど主要AIに対応した、業務委託・アプリ制作・画像生成・ライティング・マーケティング・データ分析・教育の高品質AIプロンプトを無料で共有・発見できる日本最大級のプロンプト共有サービスです。'
export const SITE_KEYWORDS = [
  'プロンプトシェア', 'プロンプト共有', 'AIプロンプト', 'AI プロンプト集',
  'ChatGPT プロンプト', 'Claude プロンプト', 'Gemini プロンプト',
  'Midjourney プロンプト', 'DALL-E プロンプト', 'Stable Diffusion プロンプト',
  '画像生成 プロンプト', 'AI ライティング', 'プロンプトエンジニアリング',
  '業務効率化 AI', 'AI 活用 仕事', 'プロンプト テンプレート',
] as const

/** カテゴリslug → 検索流入を意識したSEOメタデータ */
export const CATEGORY_META: Record<string, {
  title: string
  description: string
  longDescription: string
  keywords: string[]
  emoji: string
}> = {
  'business': {
    emoji: '💼',
    title: '業務委託・ビジネス向け AIプロンプト集',
    description: '営業メール・議事録作成・契約書チェック・提案書作成など、業務委託で即戦力になるAIプロンプトを厳選。ChatGPT・Claudeで業務効率10倍。',
    longDescription: 'リモートワーク・フリーランスの業務効率を劇的に向上させるプロンプト集です。営業メールの即レス、議事録の自動要約、提案書のドラフト作成、契約書のリスクチェック、見積書テンプレートなど、現場で頻出するタスクをワンクリックで完結できるテンプレートを取り揃えています。',
    keywords: ['業務委託 プロンプト', 'ビジネス AI', 'ChatGPT 仕事', 'AI 業務効率化', '営業メール AI', '議事録 AI'],
  },
  'app-dev': {
    emoji: '⚡',
    title: 'アプリ・Web開発向け AIプロンプト集',
    description: 'コードレビュー・リファクタリング・テストコード生成・SQL最適化など、エンジニアの開発生産性を上げるプロンプトを厳選。Claude・GPT-4o対応。',
    longDescription: 'バイブコーディング時代のエンジニアのためのプロンプト集です。コードレビュー、バグ調査、リファクタリング提案、テストケース自動生成、API設計、SQL最適化、エラーログ解析、技術選定の議論など、ソフトウェア開発の全工程をカバーするプロンプトを揃えています。',
    keywords: ['コードレビュー AI', 'プログラミング AI', 'Claude コーディング', 'GPT-4o コード', 'リファクタリング AI', 'AI ペアプロ'],
  },
  'image-gen': {
    emoji: '🎨',
    title: '画像生成AIプロンプト集（Midjourney・DALL-E・SD）',
    description: 'Midjourney・DALL-E 3・Stable Diffusionで写真級リアル画像・イラスト・商品画像を生成するプロンプト集。コピペで即使えるテンプレート多数。',
    longDescription: '画像生成AIで思い通りのビジュアルを作るためのプロンプト集です。Midjourneyのv7パラメータ、DALL-E 3のスタイル指定、Stable Diffusion XLのネガティブプロンプトまで、商品写真・人物ポートレート・イラスト・背景・ロゴ・サムネイル生成に最適化したテンプレートを公開しています。',
    keywords: ['Midjourney プロンプト', 'DALL-E プロンプト', 'Stable Diffusion プロンプト', '画像生成 AI', 'AI イラスト', '商品画像 AI'],
  },
  'writing': {
    emoji: '✍️',
    title: 'ライティング向け AIプロンプト集',
    description: 'ブログ記事・SEO記事・SNS投稿・キャッチコピー・小説執筆など、文章作成を10倍速にするプロンプト集。ChatGPT・Claude対応。',
    longDescription: 'ライターの執筆業務を加速させるプロンプト集です。SEOを意識したブログ記事のアウトライン作成、長文記事の見出し設計、X(Twitter)向けスレッド構成、キャッチコピー生成、小説のプロット作成、推敲・校正、トーン調整まで、執筆の全段階をサポートします。',
    keywords: ['ライティング AI', 'ブログ記事 AI', 'SEO 記事 AI', 'キャッチコピー AI', 'ChatGPT 文章', '小説 AI'],
  },
  'marketing': {
    emoji: '📈',
    title: 'マーケティング向け AIプロンプト集',
    description: '広告コピー・LP構成・ペルソナ設計・競合分析・SNSマーケティングなど、成果を出すマーケターのためのプロンプトを厳選。',
    longDescription: 'デジタルマーケティングの成果を最大化するプロンプト集です。広告コピーのABテストパターン生成、LP構成案、ペルソナ・カスタマージャーニーマップ、競合分析、SNSキャンペーン企画、メルマガ件名最適化、コンテンツカレンダー作成など、CMO/マーケターが日々使うフレームワークをAIで自動化します。',
    keywords: ['マーケティング AI', '広告コピー AI', 'LP 構成 AI', 'ペルソナ AI', '競合分析 AI', 'SNS マーケ AI'],
  },
  'analysis': {
    emoji: '📊',
    title: 'データ分析向け AIプロンプト集',
    description: 'Excel関数生成・SQLクエリ作成・統計解析・データ可視化・グラフ提案など、データアナリストの業務を効率化するプロンプト集。',
    longDescription: 'データ分析業務の生産性を引き上げるプロンプト集です。Excel/Googleスプレッドシートの関数生成、複雑なSQLクエリの作成・最適化、Pythonによる前処理コード、統計手法の選択、グラフ・ダッシュボード設計、KPIツリー構築、データ品質チェックなど、分析の意思決定プロセスをAIで加速できます。',
    keywords: ['データ分析 AI', 'SQL 自動生成', 'Excel AI', 'Python AI', 'データ可視化 AI', '統計解析 AI'],
  },
  'education': {
    emoji: '📚',
    title: '教育・学習向け AIプロンプト集',
    description: '勉強計画・要約・問題作成・英語学習・資格対策など、学習を効率化するAIプロンプト集。学生・社会人の自己学習に最適。',
    longDescription: '効率的な学習を実現するプロンプト集です。専門書・論文の要約、難解な概念の図解説明、過去問の模擬作成、英語シャドーイング・添削、資格試験の暗記カード生成、学習計画の作成、Feynman Technique実践など、子どもから大人までの「学び」をAIで最適化します。',
    keywords: ['AI 勉強', 'ChatGPT 学習', '英語学習 AI', 'AI 要約', '資格対策 AI', 'Feynman AI'],
  },
  'other': {
    emoji: '✨',
    title: 'その他カテゴリ AIプロンプト集',
    description: 'クリエイティブ・趣味・ライフハック・人間関係・健康など、日常を豊かにする多彩なAIプロンプト集。',
    longDescription: '仕事以外の生活シーンでAIを活用するためのプロンプト集です。料理レシピの提案、旅行プランニング、人間関係の悩み相談、健康相談、ペット相談、ライフハック、創作活動など、日常の「ちょっと困った」を即解決する多彩なテンプレートを揃えています。',
    keywords: ['AI 活用', 'ChatGPT 日常', 'AI ライフハック', 'AI 相談', 'AI 趣味', 'AI クリエイティブ'],
  },
}

/** AIモデル別ページ用メタ */
export const AI_MODEL_META: Record<string, { title: string; description: string }> = {
  'gpt-4o': {
    title: 'GPT-4o プロンプト集',
    description: 'OpenAI GPT-4oで使える厳選プロンプトを集めました。マルチモーダル対応の最強モデルを使い倒すテンプレート。',
  },
  'claude-opus-4-7': {
    title: 'Claude Opus 4.7 プロンプト集',
    description: 'Anthropic Claude Opus 4.7の高度な推論能力を最大限活用するプロンプト集。長文・コード・分析に強い。',
  },
  'claude-3-5-sonnet': {
    title: 'Claude 3.5 Sonnet プロンプト集',
    description: 'Claude 3.5 Sonnetの高速・高品質な応答を引き出すプロンプトテンプレート集。',
  },
  'gemini-1-5-pro': {
    title: 'Gemini 1.5 Pro プロンプト集',
    description: 'Google Gemini 1.5 Proの大容量コンテキストを活かしたプロンプト集。長文解析・要約に最適。',
  },
  'midjourney': {
    title: 'Midjourney プロンプト集',
    description: 'Midjourney v7対応の画像生成プロンプト集。リアル写真・イラスト・アート系のテンプレート。',
  },
  'dall-e-3': {
    title: 'DALL-E 3 プロンプト集',
    description: 'DALL-E 3で高品質な画像を生成するプロンプト集。スタイル指定・構図のテンプレート豊富。',
  },
  'stable-diffusion': {
    title: 'Stable Diffusion プロンプト集',
    description: 'Stable Diffusion XL/SD3対応の画像生成プロンプト集。ネガティブプロンプト込みのテンプレート。',
  },
}
