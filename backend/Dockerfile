# Etapa 1: Construcción con Java 25
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Instalamos Maven manualmente (o podrías usar el Maven Wrapper ./mvnw si lo tienes)
RUN apt-get update && apt-get install -y maven

COPY . .
# Forzamos a Maven a usar el JDK 25 del sistema
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución con Java 25
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]