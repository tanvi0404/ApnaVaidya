# Multi-Stage Production Dockerfile for ApnaVaidya Java 17 Backend
# Stage 1: Build Java 17 Backend
FROM eclipse-temurin:17-jdk-alpine AS backend-builder
WORKDIR /app
COPY server ./server
RUN mkdir -p server/target/classes && \
    javac --release 17 -cp "server/lib/*" -d server/target/classes \
    server/src/main/java/com/apnavaidya/model/*.java \
    server/src/main/java/com/apnavaidya/storage/*.java \
    server/src/main/java/com/apnavaidya/storage/repository/*.java \
    server/src/main/java/com/apnavaidya/service/*.java \
    server/src/main/java/com/apnavaidya/ApnaVaidyaServer.java

# Stage 2: Lightweight Production Runtime Image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy compiled classes, libraries, and initial data directory
COPY --from=backend-builder /app/server/target/classes /app/server/target/classes
COPY --from=backend-builder /app/server/lib /app/server/lib
COPY --from=backend-builder /app/server/data /app/server/data

# Default port configuration (overridden automatically by Render/Cloud PORT env)
ENV PORT=8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/api/health || exit 1

# Launch Java 17 REST API Server with PostgreSQL JDBC driver on classpath
CMD ["sh", "-c", "java -cp 'server/target/classes:server/lib/*' com.apnavaidya.ApnaVaidyaServer"]
