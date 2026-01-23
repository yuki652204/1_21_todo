# Todoアプリ

Spring Boot + JPA を使ったシンプルな Todoアプリです。

## 環境

- Java 11
- Spring Boot 3.x
- MySQL 8.0
- Maven

## ディレクトリ構造（テスト含む）


src/
├─ main/
│ └─ java/com/example/todo/
│ ├─ Todo.java
│ └─ TodoController.java
└─ test/
└─ java/com/example/todo/
├─ TodoControllerTest.java ← Unitテスト
└─ TodoIntegrationTest.java ← 結合テスト


## テストについて

### 1. Unitテスト

- ファイル: `TodoControllerTest.java`  
- Controller や Service のメソッド単体で正しく動くか検証  
- Mock を使って依存を切り離して実行

### 2. 結合テスト

- ファイル: `TodoIntegrationTest.java`  
- Controller + Service + Repository を組み合わせて全体の動作を確認  
- データベースや MockMvc を使用して実際のフローをテスト

### テスト実行方法

```bash
mvn test



---

この README と一緒に先ほどの **Unit / Integration テストコード** を Git に追加すれば、  
**「テストを書けるプロジェクト」として GitHub 上でも見える化** できます。  

---

次のステップは、この README を保存して **Git に push** です。  
Mac ターミナルなら以下コマンドで OK：

```bash
git add README.md src/test/java/com/example/todo/TodoControllerTest.java src/test/java/com/example/todo/TodoIntegrationTest.java
git commit -m "Add unit and integration tests, update README"
git push origin main

