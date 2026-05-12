# カスタムドメイン接続ガイド

## ✅ 推奨ドメイン（空き確認済み 2026-05-12時点）

| ドメイン | 推奨度 | 想定年額 | コメント |
|---|---|---|---|
| **promptshare.jp** | ★★★★★ | 約2,500〜4,000円 | 短く・日本語サービスで最強・ハイフン無し |
| **promptshare.app** | ★★★★☆ | 約2,000円（Cloudflare at-cost: $14程度） | グローバル展開可・新規性 |
| **prompts.jp** | ★★★☆☆ | プレミアム価格（数万円） | 単語価値高・名前としても抜群 |
| **promptshare.dev** | ★★★☆☆ | 約2,000円 | エンジニア向け・短い |
| **prompt-share.app** | ★★☆☆☆ | 約2,000円 | ハイフンが弱点 |

> ⚠️ `prompt-share.com` と `promptshare.io` は既に第三者が取得済み

---

## 取得手順（Cloudflare Registrar 推奨）

### なぜCloudflare?
- **at-cost価格** = 卸価格そのまま。マークアップなし
- DNS、SSL、CDN、DDoS保護がすべて自動・無料
- Vercel との接続が爆速で済む

### 手順
1. https://dash.cloudflare.com/ にログイン（無料）
2. 左メニュー「Registrar」→「Register Domains」
3. 希望ドメイン名を入力 → 検索
4. Add → カート→ Cloudflareアカウント情報で購入
5. 取得後すぐに DNS 編集画面が出る（このまま手順 B へ）

---

## Vercel 接続手順（Cloudflareでドメイン取得後）

### A. Vercel 側で追加
1. https://vercel.com/higuryo0110-3582s-projects/prompt-share/settings/domains
2. 「Add Domain」→ 取得したドメイン名を入力
3. www有り/無し どちらを apex にするか選択（推奨: apex = `promptshare.jp`、`www.promptshare.jp` → リダイレクト）
4. Vercel が必要なDNSレコード（A / AAAA / CNAME）を指示してくる

### B. Cloudflare DNS にレコード追加
Vercel が指示する内容に従って、Cloudflare の「DNS」タブで以下を設定：

```
Type: A      Name: @                   Content: 76.76.21.21        Proxy: 🟧 Proxied
Type: CNAME  Name: www                 Content: cname.vercel-dns.com  Proxy: 🟧 Proxied
```

> ⚠️ Cloudflare の Proxy（オレンジ雲）は **Proxied のままで問題なし**（Vercel公式の最新指針）。SSL/TLSモードは「Full (strict)」を選択。

### C. 反映確認
- 数分〜数十分で `https://promptshare.jp` でアクセス可能になる
- Vercel ダッシュボードのドメイン横に緑色のチェックマーク表示

---

## 接続後に必要な作業（私が一気に対応）

ドメインが繋がったら、以下を一発で更新します（教えてください）：

1. `src/lib/constants.ts` の `SITE_URL` を新ドメインに変更
2. `manifest.json` の `start_url` 更新
3. Vercel 環境変数に `NEXT_PUBLIC_SITE_URL=https://promptshare.jp` 追加
4. Supabase OAuth コールバック URL に新ドメイン追加（**重要**: これをやらないとログインが壊れる）
5. Google Search Console に新プロパティ追加 → sitemap.xml 再送信
6. 旧 vercel.app から新ドメインへの 301 リダイレクト設定
7. Google Analytics プロパティの推奨URL更新

---

## 取得すべきベストドメイン（私の推奨）

**第1候補: `promptshare.jp`**

理由:
1. **覚えやすい**: 短い・カナ読みでそのまま
2. **日本市場特化が明示**: .jp は日本ユーザーの信頼が高い
3. **SEO効果**: 国別TLDは日本検索結果で多少有利
4. **空きあり**: いま押さえないと取られる可能性

**現状から取得まで5〜10分。月額200〜300円。**

決まったら教えてください。取得直後の作業をすぐ走らせます。
