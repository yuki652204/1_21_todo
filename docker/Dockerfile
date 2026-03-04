FROM eclipse-temurin:17-jre
WORKDIR /app
# さっきコピーした JAR を app.jar として取り込む
COPY todo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 7080
ENTRYPOINT ["java", "-jar", "app.jar"]
