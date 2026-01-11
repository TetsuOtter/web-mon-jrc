# JIS BDF to Unicode BDF Converter

JIS X 0208 エンコーディングの BDF フォントファイルを Unicode 対応に変換するスクリプトです。

## 概要

このスクリプトは、JIS X 0208（Shift JIS）のエンコーディング値を使用した BDF ファイルを、JavaScript で直接 CodePoint として使える Unicode エンコーディングの BDF ファイルに変換します。

## 前提条件

- Node.js 24.x 以上（TypeScript 直接実行対応）

## 使用方法

```bash
cd /Users/tetsu/GitHub/web-mon-jrc/dev/tools
npm install
node jis-bdf-to-unicode-bdf.ts <入力ファイル> <出力ファイル>
```

例：

```bash
node jis-bdf-to-unicode-bdf.ts ../app/public/jiskan16.bdf ../app/public/jiskan16-unicode.bdf
```

または npm scripts を使用：

```bash
npm run convert -- ../app/public/jiskan16.bdf ../app/public/jiskan16-unicode.bdf
```

## 変換内容

スクリプトは以下の変換を行います：

1. **ENCODING 値の変換**

   - JIS X 0208 の 2 バイト値 → Shift JIS → Unicode のコードポイント

2. **メタデータの更新**

   - `CHARSET_REGISTRY`: `JISX0208.1983` → `ISO10646`
   - `CHARSET_ENCODING`: そのまま `0`（Unicode に対応）
   - `FONT`: フォント名を更新

3. **DEFAULT_CHAR の更新**
   - デフォルト文字のエンコーディング値も Unicode に変換

## 例

入力（JIS X 0208）:

```
CHARSET_REGISTRY "JISX0208.1983"
CHARSET_ENCODING "0"
ENCODING 8481
```

出力（Unicode）:

```
CHARSET_REGISTRY "ISO10646"
CHARSET_ENCODING "0"
ENCODING 12288
```

## 依存関係

- `encoding-japanese`: JIS ↔ Unicode の文字コード変換に使用

## 出力ファイル

生成された Unicode 対応 BDF ファイルは、`bdfparser`ライブラリで直接使用できます：

```javascript
import { parseBDF } from "bdfparser";
const font = parseBDF(unicodeBdfContent);
// fontオブジェクトのキーがUnicodeコードポイントになっている
```
