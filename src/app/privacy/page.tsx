import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'プロンプトシェアのプライバシーポリシー。個人情報の取扱い、Cookie、第三者サービスについて。',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">プライバシーポリシー</h1>
      <p className="text-muted-foreground text-sm mb-8">最終更新日: 2025年5月19日</p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        {/* 1 */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">1. はじめに</h2>
          <p>
            プロンプトシェア（以下「当サービス」、URL: https://promptshare.jp）は、
            ユーザーの個人情報の保護を重要視しています。本プライバシーポリシーは、
            当サービスが収集する情報、その利用目的、およびユーザーの権利について説明します。
          </p>
        </section>

        {/* 2 */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">2. 収集する情報</h2>

          <h3 className="font-semibold text-foreground mt-4 mb-2">2.1 アカウント情報</h3>
          <p>ユーザー登録・ログイン時に以下の情報を収集します。</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>メールアドレス</li>
            <li>表示名（ニックネーム）</li>
            <li>プロフィール画像（Googleアカウント連携時に取得）</li>
            <li>Google アカウントID（Google OAuth 連携時）</li>
          </ul>

          <h3 className="font-semibold text-foreground mt-4 mb-2">2.2 利用データ</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>投稿したプロンプトの内容・タイトル・カテゴリ</li>
            <li>お気に入り・ブックマーク情報</li>
            <li>いいね・閲覧履歴</li>
          </ul>

          <h3 className="font-semibold text-foreground mt-4 mb-2">2.3 自動収集データ</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>IPアドレス</li>
            <li>ブラウザの種類・バージョン</li>
            <li>デバイス情報（OS、画面サイズ等）</li>
            <li>アクセス日時・ページ閲覧履歴</li>
            <li>リファラー（参照元URL）</li>
          </ul>
        </section>

        {/* 3 */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">3. 情報の利用目的</h2>
          <p>収集した情報は以下の目的で利用します。</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>アカウントの作成・認証・管理</li>
            <li>サービスの提供・運営・改善</li>
            <li>ユーザーサポートの提供</li>
            <li>利用状況の分析・統計</li>
            <li>不正利用の防止・セキュリティの確保</li>
            <li>お知らせ・サービスに関する通知の送信</li>
          </ul>
        </section>

        {/* 4 */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">4. Cookie および類似技術</h2>
          <p>当サービスでは以下の目的でCookieおよび類似技術を使用します。</p>

          <h3 className="font-semibold text-foreground mt-4 mb-2">4.1 必須Cookie</h3>
          <p>
            ログイン状態の維持やセッション管理など、サービスの基本機能に必要なCookieです。
            これらはSupabase認証基盤を通じて設定されます。
          </p>

          <h3 className="font-semibold text-foreground mt-4 mb-2">4.2 分析Cookie</h3>
          <p>
            Google Analytics（測定ID: G-Q8EHLWH7BN）を使用して、サービスの利用状況を分析しています。
            Google Analyticsは匿名化されたデータを収集し、ページの閲覧数やユーザーの行動パターンを把握するために使用されます。
            詳細は
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:underline"
            >
              Googleのプライバシーポリシー
            </a>
            をご参照ください。
          </p>

          <h3 className="font-semibold text-foreground mt-4 mb-2">4.3 広告Cookie</h3>
          <p>
            A8.net のアフィリエイトプログラムを利用しており、広告配信およびコンバージョン計測のために
            Cookieが使用される場合があります。
          </p>
        </section>

        {/* 5 */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">5. 第三者サービス</h2>
          <p>当サービスでは以下の第三者サービスを利用しています。</p>

          <div className="mt-3 space-y-3">
            <div>
              <h3 className="font-semibold text-foreground">Supabase</h3>
              <p>認証基盤およびデータベースとして利用。ユーザーデータはSupabaseのインフラ上に保存されます。</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Google OAuth</h3>
              <p>ソーシャルログイン機能の提供。Googleアカウントの基本プロフィール情報を取得します。</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Google Analytics</h3>
              <p>アクセス解析。匿名化されたアクセスデータを収集・分析します。</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Vercel</h3>
              <p>ホスティングサービス。サーバーログにアクセス情報が記録される場合があります。</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">A8.net</h3>
              <p>アフィリエイト広告の配信。広告の表示・クリック・コンバージョンに関するデータが収集される場合があります。</p>
            </div>
          </div>
        </section>

        {/* 6 */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">6. データの共有・第三者提供</h2>
          <p>当サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>ユーザー本人の同意がある場合</li>
            <li>法令に基づく開示要請がある場合</li>
            <li>上記「第三者サービス」セクションに記載されたサービス提供者への委託</li>
            <li>ユーザーが公開設定で投稿したプロンプト等のコンテンツ</li>
          </ul>
        </section>

        {/* 7 */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">7. データの保管・保存期間</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>アカウント情報: アカウント削除のリクエストから30日以内に削除します。</li>
            <li>投稿コンテンツ: アカウント削除時に関連データを削除します。</li>
            <li>アクセスログ: 最大12か月間保存した後、自動的に削除されます。</li>
            <li>分析データ: Google Analyticsの保持期間設定に従います（最大14か月）。</li>
          </ul>
        </section>

        {/* 8 */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">8. データの安全管理</h2>
          <p>
            当サービスは、ユーザーの個人情報を保護するために適切な技術的・組織的措置を講じています。
            通信はSSL/TLSにより暗号化され、データベースへのアクセスは厳格に制限されています。
            ただし、インターネット上の通信について100%の安全性を保証することはできません。
          </p>
        </section>

        {/* 9 */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">9. ユーザーの権利</h2>
          <p>ユーザーは以下の権利を有します。</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong className="text-foreground">アクセス権:</strong> ご自身の個人情報の開示を請求する権利</li>
            <li><strong className="text-foreground">訂正権:</strong> 不正確な個人情報の訂正を請求する権利</li>
            <li><strong className="text-foreground">削除権:</strong> 個人情報の削除を請求する権利（アカウント削除を含む）</li>
            <li><strong className="text-foreground">データポータビリティ:</strong> ご自身のデータを構造化された形式で受け取る権利</li>
            <li><strong className="text-foreground">同意の撤回:</strong> いつでもデータ処理に対する同意を撤回する権利</li>
            <li><strong className="text-foreground">Cookie の管理:</strong> ブラウザの設定からCookieを無効化・削除する権利</li>
          </ul>
          <p className="mt-3">
            上記の権利を行使する場合は、当サービスのお問い合わせ窓口までご連絡ください。
          </p>
        </section>

        {/* 10 */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">10. 未成年者のプライバシー</h2>
          <p>
            当サービスは、13歳未満のお子様を対象としたものではありません。
            13歳未満のお子様から意図的に個人情報を収集することはありません。
            13歳未満のお子様の個人情報が収集されていることが判明した場合は、
            速やかに当該情報を削除する措置を講じます。
          </p>
        </section>

        {/* 11 */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">11. プライバシーポリシーの変更</h2>
          <p>
            当サービスは、必要に応じて本プライバシーポリシーを変更することがあります。
            重要な変更がある場合は、サービス上での通知またはメールにてお知らせします。
            変更後のポリシーは、本ページに掲載した時点で効力を生じるものとします。
          </p>
        </section>

        {/* 12 */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">12. お問い合わせ</h2>
          <p>
            本プライバシーポリシーに関するご質問・ご意見、または個人情報の取扱いに関するお問い合わせは、
            以下までご連絡ください。
          </p>
          <div className="mt-3 space-y-1">
            <p><strong className="text-foreground">サービス名:</strong> プロンプトシェア</p>
            <p>
              <strong className="text-foreground">URL: </strong>
              <a
                href="https://promptshare.jp"
                className="text-violet-400 hover:underline"
              >
                https://promptshare.jp
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
