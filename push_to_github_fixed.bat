@echo off
echo ==========================================
echo GitHub Auto Push Script with User Config
echo ==========================================

REM Set Git identity (change email if needed)
git config --global user.name "Bufuxl"
git config --global user.email "youremail@example.com"

REM Initialize Git and add remote
git init
git remote add origin https://github.com/Bufuxl/financial-analysis-ai-chat.git

REM Add and commit files
git add .
git commit -m "Initial commit from ChatGPT AI project"

REM Create main branch and push
git branch -M main
git push -u origin main

pause