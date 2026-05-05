# ---------- BUILD STAGE ----------
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app
COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests


# ---------- RUN STAGE ----------
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
COPY entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["sh", "entrypoint.sh"]
