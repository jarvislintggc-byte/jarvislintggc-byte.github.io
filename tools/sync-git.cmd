@echo off
setlocal
cd /d "%~dp0.."
set "SITE_GIT=git"
where git >nul 2>nul
if errorlevel 1 set "SITE_GIT=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
echo Synchronizing Git history to the latest fetched origin/main.
echo Current website files and local edits will be preserved.
"%SITE_GIT%" fetch origin main
if errorlevel 1 goto failed
"%SITE_GIT%" cat-file -e "refs/remotes/origin/main^{commit}"
if errorlevel 1 goto failed
"%SITE_GIT%" reset --mixed refs/remotes/origin/main
if errorlevel 1 goto failed
"%SITE_GIT%" rev-parse HEAD
if errorlevel 1 goto failed
echo Git baseline synchronized. Website files were preserved.
set "SITE_PYTHON=%CD%\.local-knowledge\venv\Scripts\python.exe"
if not exist "%SITE_PYTHON%" (
  echo Python environment is missing. Git is synchronized; maintenance checks were not run.
  goto failed
)
"%SITE_PYTHON%" tools\sync_game.py --check
if errorlevel 1 goto failed
"%SITE_PYTHON%" -m unittest discover -s tools -p "test_*.py"
if errorlevel 1 goto failed
echo All maintenance checks passed. Nothing was published.
pause
exit /b 0
:failed
echo Synchronization or verification stopped. Review the error above.
pause
exit /b 1
