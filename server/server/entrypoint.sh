#!/bin/sh
# Convert DATABASE_URL (postgres:// format from Render) to JDBC format for Spring Boot.
# This runs before Spring starts so no processor is needed.

if [ -n "$DATABASE_URL" ]; then
    RAW="$DATABASE_URL"

    # Strip scheme, leaving: user:pass@host:port/dbname
    WITHOUT_SCHEME=$(echo "$RAW" | sed 's|^postgres[ql]*://||')

    # Split on @ to separate credentials from host
    USERINFO=$(echo "$WITHOUT_SCHEME" | cut -d@ -f1)
    HOSTPART=$(echo "$WITHOUT_SCHEME" | cut -d@ -f2)

    # Extract user and password
    DB_USER=$(echo "$USERINFO" | cut -d: -f1)
    DB_PASS=$(echo "$USERINFO" | cut -d: -f2-)

    # Build JDBC URL; append sslmode=prefer only when not already present
    case "$HOSTPART" in
        *sslmode*) JDBC_URL="jdbc:postgresql://${HOSTPART}" ;;
        *\?*)      JDBC_URL="jdbc:postgresql://${HOSTPART}&sslmode=prefer" ;;
        *)         JDBC_URL="jdbc:postgresql://${HOSTPART}?sslmode=prefer" ;;
    esac

    export SPRING_DATASOURCE_URL="$JDBC_URL"
    export SPRING_DATASOURCE_USERNAME="$DB_USER"
    export SPRING_DATASOURCE_PASSWORD="$DB_PASS"

    echo "INFO  entrypoint - JDBC URL set (credentials hidden)"
fi

exec java $JAVA_OPTS -jar app.jar
