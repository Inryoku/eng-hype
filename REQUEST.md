# AIアシスタントへの依頼事項まとめ (Engineering Hype Project)

IELTS対策の英単語を「文脈（ストーリー）」で覚えるためのプロジェクト。
AI（Antigravity）は、以下のルールとワークフローに従ってコンテンツを生成・管理する。

## 1. プロジェクト構成

- **単語リスト**: `words/words.md` (未消化の単語置き場)
- **ストーリー**: `script/*.md` (ジャンルごとに分割)
  - `History_Archaeology.md` (歴史・考古学)
  -
- **Webアプリ**: `web/` (Next.jsでストーリーを閲覧)

## 2. ストーリー作成ルール (Must)

### フォーマット

Markdownファイル内で `Chapter` > `Scene` の階層構造を作る。

```markdown
# Story Title

## Chapter 1: [Chapter Name]

[Song Title](https://suno.com/song/xxxx) <!-- BGMリンク -->

### Scene 1: [Scene Name]

_(Target Words: word A, word B, ...)_

![Scene Image](image_url) <!-- 挿絵 -->

English sentence 1.

- 日本語訳文 1。（ターゲット単語は **太字(English)** の形式）

English sentence 2.

- 日本語訳文 2。
  日本語訳文 2。
```

### 文体（Writing Style）の指定

IELTSの各パート対策を兼ねて、ジャンルごとに文体を変える。

1.  **Narrative (物語・三人称ドラマ)**
    - 対象: `History`, `Business`, `Science`, `Technology`
    - 特徴: 「彼は〜した」「事態は急変した」など、客観的かつドラマチックな語り口。
    - 対策: Reading Part 1/3 (物語・歴史記述), Listening Part 2/4 (独白・講義)

2.  **Dialogue (対話・インタビュー)**
    - 対象: `Medical & Ethics`
    - 特徴: 「ジャーナリストと内部告発者」「医師と患者」などの会話形式。
    - 対策: Listening Part 1/3 (日常会話・議論), Speaking Part 3 (議論)

3.  **Essay / Argument (論説・エッセイ)**
    - 対象: `Education & Arts`
    - 特徴: 「ある人々は〜と主張するが、私は〜と考える」という論理的な主張。
    - 対策: Writing Task 2, Reading Part 3 (論説文)

### 執筆の掟

1.  **1文1段落（交互形式）**: 英語の1文、空行、日本語訳の1文、という順で書く。スクロールせずに訳を確認できるようにする。
2.  **ターゲット単語の太字化**:
    - 英語: `**word**`
    - 日本語: `**日本語の意味(word)**` とし、原文の単語を併記する。
    - 例: he had **secured** the map. -> 彼は地図を **手に入れていた(secured)**。
3.  **使用済み単語の処理**: ストーリーに組み込んだ単語は `words/words.md` から削除する。
4.  **単語の取捨選択**: `words/words.md`のすべての単語を使い切る必要はない。ストーリー展開に合わせて、適当にピックアップして使用する。
5.  **Sceneの長さ**: 長すぎると読みにくいため、1 Sceneあたり **5〜8文程度** の短さを目安とする（スマホでスクロールせずに読める分量）。

## 3. ワークフロー

1.  **単語追加**: ユーザーが `words/words.md` に単語を放り込む。
2.  **ジャンル選定**: AIが単語を分析し、既存ジャンルの続きか、新ジャンル作成か提案する。
3.  **ドラフト作成**: AIがストーリーと日本語訳を作成。
4.  **画像・音楽**: ユーザーがこだわりの画像とBGMを作成し、リンクを追加する（AIはプレースホルダーのみ設置）。
5.  **Web反映**: `next build` 不要。Markdownを編集すれば即反映される仕組み。
