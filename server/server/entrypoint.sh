#!/bin/sh
# Build SPRING_DATASOURCE_URL from individual Render database env vars.
# No URL parsing - just plain string concatenation.

echo "INFO [entrypoint] DB_HOST=${DB_HOST} DB_PORT=${DB_PORT} DB_NAME=${DB_NAME}"

if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ] && [ -n "$DB_NAME" ]; then
    export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
    echo "INFO [entrypoint] SPRING_DATASOURCE_URL constructed from DB_HOST/DB_PORT/DB_NAME"
else
    echo "WARN [entrypoint] DB_HOST/DB_PORT/DB_NAME not set - Spring will use DATABASE_URL fallback"
fi

echo "INFO [entrypoint] Starting Spring Boot..."
exec java $JAVA_OPTS -jar app.jar
