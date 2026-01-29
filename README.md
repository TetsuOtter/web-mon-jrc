# web-mon-jrc

Web版とデスクトップ版の両方で動作する鉄道運行モニタリングアプリケーションです。

## 開発環境

### 必要なツール

- Node.js 20以降
- Yarn
- Rust (デスクトップ版のビルドに必要)

### Web版の開発

```bash
cd dev/app
yarn install
yarn dev
```

ブラウザで `http://localhost:5173` にアクセスしてください。

### デスクトップ版の開発

#### 初回セットアップ

1. Rustをインストール: https://rustup.rs/
2. 依存関係をインストール:

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

**macOS:**
Xcode Command Line Toolsをインストール:
```bash
xcode-select --install
```

**Windows:**
[Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)をインストール

3. アイコンを生成:

1024x1024以上のPNG画像を用意し、以下のコマンドを実行:
```bash
cd dev/app
yarn tauri icon path/to/your/icon.png
```

#### 開発サーバーの起動

```bash
cd dev/app
yarn tauri:dev
```

#### ビルド

```bash
cd dev/app
yarn tauri:build
```

ビルドされたバイナリは `dev/app/src-tauri/target/release/bundle/` に出力されます。

## プラットフォーム対応

このアプリケーションは以下のプラットフォームでビルド可能です:

- Windows (x64)
- macOS (Intel/Apple Silicon)
- Linux (x64)

## GitHub Actionsによる自動ビルド

プッシュまたはタグの作成時に、GitHub Actionsが自動的に全プラットフォーム向けのバイナリをビルドします。

タグを作成してリリースを行う:
```bash
git tag v1.0.0
git push origin v1.0.0
```

## Web版とデスクトップ版の両立

アプリケーションコードでは `src/utils/platform.ts` のユーティリティ関数を使用して、実行環境を判定できます:

```typescript
import { isTauri, isWeb, getPlatform } from './utils/platform';

if (isTauri()) {
  // デスクトップ版専用の処理
} else {
  // Web版専用の処理
}
```