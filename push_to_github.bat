@echo off
echo ============================
echo GitHub Auto Push Script
echo ============================

REM Set your GitHub repository URL
set REPO_URL=https://github.com/Bufuxl/financial-analysis-ai-chat.git

REM Initialize Git
git init

REM Add all files
git add .

REM Commit with default message
git commit -m "Initial commit from ChatGPT AI project"

REM Add GitHub remote
git remote add origin %REPO_URL%

REM Push to GitHub
git push -u origin master

pause