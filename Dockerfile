# Multi-Stage Dockerfile for ApnaVaidya Full-Stack Application
# Stage 1: Build Frontend (Node.js)
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build Java 17 Backend
FROM eclipse-temurin:17-jdk-alpine AS backend-builder
WORKDIR /app
COPY server ./server
RUN mkdir -p server/target/classes && \
    javac --release 17 -d server/target/classes \
    server/src/main/java/com/apnavaidya/model/*.java \
    server/src/main/java/com/apnavaidya/storage/*.java \
    server/src/main/java/com/apnavaidya/storage/repository/*.java \
    server/src/main/java/com/apnavaidya/service/*.java \
    server/src/main/java/com/apnavaidya/ApnaVaidyaServer.java

# Stage 3: Lightweight Production Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Install Node.js for serving frontend static assets
RUN apk add --no-cache nodejs npm

# Copy backend compiled bytecode and data directory
COPY --from=backend-builder /app/server/target/classes /app/server/target/classes
COPY --from=backend-builder /app/server/data /app/server/data
COPY --from=frontend-builder /app/dist /app/dist

# Install ultra-lightweight static server
RUN npm install -g serve

# Expose Java REST API port (8080) and Web UI port (3000 / 5173)
EXPOSE 8080
EXPOSE 3000

# Startup script to run both Java backend and Web frontend
CMD ["sh", "-c", "java -cp 'server/target/classes' com.apnavaidya.ApnaVaidyaServer & serve -s dist -l 3000"]
