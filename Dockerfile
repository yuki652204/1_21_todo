# Apple Siliconに対応した汎用的なJava 17イメージを使用
FROM eclipse-temurin:17-jre

WORKDIR /app

# JARファイルをコピー（先ほどビルドしたものを利用）
COPY target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
