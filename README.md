# Spring Boot + Kubernetes TODO App

このプロジェクトは、Spring Bootで作られたTODO管理アプリを、Kubernetes (kind) 環境で動作させるためのフルスタック・デモです。
単なる「TODOアプリ」ではなく、「Spring Boot + MySQL + Kubernetes (kind) + Docker + Ingress」 という、モダンなインフラを使ったアプリです。
MySQLのデータ永続化（PVC）と、Ingressによるトラフィック制御を実装しています。

## 技術スタック
- **Java 17 / Spring Boot 3**
- **MySQL 8.0**
- **Kubernetes (kind)**
- **Docker**
- **Nginx Ingress Controller**

## 実行手順

### 1. Javaアプリのビルド (JAR作成)
静的ファイル（app.js）の変更を反映させるため、必ず最初に実行してください。
```bash
mvn clean package -DskipTests
```

### 2. Dockerイメージの作成
```bash
docker build -t todo-app:v1 .
```

### 3. Kubernetes (kind) へのロード
```bash
kind load docker-image todo-app:v1 --name kind
```

### 4. マニフェストの適用
```bash
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/todo-deployment.yaml
kubectl apply -f k8s/todo-service.yaml
kubectl apply -f k8s/todo-ingress.yaml
```

### 5. アクセス方法
```bash
kubectl port-forward svc/todo-service 7080:80
```
アクセス先: [http://localhost:7080](http://localhost:7080)
　　　　　　[http://k8s.biz-data.local:8080]　
