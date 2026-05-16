# use-pwa フィードバック

週間1,440ダウンロード、npm上の類似hookの中で実装品質は上位です。単機能ライブラリとして、やるべきことをやっています。

## 良い点

- **モジュールロード時点での`beforeinstallprompt`捕捉（`src/hooks/use-pwa.ts:27-34`）**：これが最大の差別化ポイントです。`beforeinstallprompt`はページロード直後に1回だけ発火する設計で、Reactハイドレーション完了を待つ`useEffect`では取り逃します。これに気づいて対処しているライブラリは少数派
- **PWA判定が3経路カバー**：Android TWA（`android-app://` referrer）、Chrome系（`display-mode: fullscreen/standalone/minimal-ui`）、iOS（`navigator.standalone`）。実運用で必要な分岐を全部押さえている
- **API簡潔さ**：v2の8プロパティから v3の4プロパティへ縮約。`増やすより削った`痕跡は、ライブラリ設計として正しい方向
- **TypeScript型の補強**：`WindowEventMap`に`beforeinstallprompt`を追加、`Navigator.standalone`の型拡張。利用側で`as any`が不要
- **ESM/CJS両対応 + `sideEffects: false`**：Tree-shaking可能なライブラリとして正しくパッケージング

## 改善の余地

### 1. `CLAUDE.md`が古い（最優先）

`CLAUDE.md`に記載されているAPIが、現コード（v3.0.1）と一致していません。

- 記載：`appinstalled` / `canInstallprompt` / `enabledA2hs` / `enabledPwa` / `isLoading` / `isPwa` / `showInstallPrompt` / `userChoice`（8プロパティ）
- 実装：`canInstall` / `install` / `isInstalled` / `isSupported`（4プロパティ）

これは将来の自分が混乱する原因になります。Claude Codeに作業させた時にも、古い情報を元にコードを書こうとする可能性があります。優先度高めで更新してください。

### 2. テストがない

`src/`にテストファイルが見当たりません。単一hookですが、回帰しやすいポイントが3つあります。

- モジュールレベル捕捉のタイミング（hydration前後）
- iOSの`navigator.standalone`分岐
- Android TWAの`document.referrer`分岐

Vitest + happy-domで最低限のスモークテストを書いておくと、安心して触れる状態になります。週間1,440ダウンロードに乗っている以上、リグレッションのコストは個人で書き捨てるツールより高いです。

### 3. READMEに差別化ポイントが書かれていない

`Features`セクションが機能リストになっており、`なぜ他のPWA hookではなくこれを選ぶべきか`が伝わりません。

差別化の核は `モジュールレベル捕捉によるhydration前のイベント取りこぼし回避` ですが、これがREADMEから読み取れない。例えば、

> Other PWA install hooks miss the `beforeinstallprompt` event when it fires before React hydration. `use-pwa` captures the event at module load time, so the install button shows up reliably even on the first paint.

のような1行があるだけで、`既存のPWA hookで詰まった人`に明確に刺さります。npmで類似hookを検索して比較している人にとって、これは決定的な情報です。

### 4. `isSupported`の判定が`BeforeInstallPromptEvent in window`のみ

Chrome / Edge / 一部のAndroidブラウザでは`true`になりますが、iOS SafariはPWAインストールをサポートしていても`BeforeInstallPromptEvent`がないため`isSupported: false`になります。iOSの「ホーム画面に追加」は手動操作なのでこの挙動は正しいですが、READMEで明示しておかないと、利用者が「iOSで動かない」と誤解する可能性があります。

### 5. `install()`後の`capturedEvent = null`タイミング

`outcome === "accepted"`の時だけ`capturedEvent`をリセットしていますが、`dismissed`の場合は再度`install()`を呼べる仕様にしているのか、それともリセットすべきなのか、コメントで意図を残しておくと将来の自分が迷いません。

## 総評

単一目的ライブラリとして、コード品質は週間1,440ダウンロードに見合うレベルです。むしろ、これだけのコード品質と実用性があってこのダウンロード数で止まっているのは、`READMEの差別化文`と`テストの有無による信頼性アピール`の2つで損をしている可能性があります。

週間5,000を狙うなら、まずは`CLAUDE.md`の更新と、READMEの差別化1行追加、Vitestでのスモークテスト追加の3点が現実的な打ち手です。
