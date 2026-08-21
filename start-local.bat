@echo off
echo ===================================================
echo 🌿 Launching ApnaVaidya Full-Stack Healthcare App
echo ===================================================
echo 1. Starting Java 17 REST API Server on Port 8080...
start /b java -cp "server/target/classes" com.apnavaidya.ApnaVaidyaServer

echo 2. Launching React Vite Web App on Port 5173...
npm run dev
