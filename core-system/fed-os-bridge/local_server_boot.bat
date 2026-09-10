@echo off
REM ====================================================================
REM  FED-EDU Local Server Boot — Windows edition (the scrap-PC majority)
REM  Plain terms: double-click this file and a mini-internet fires up on
REM  YOUR machine. Test the block's sites exactly like they'll run live —
REM  no internet needed, no installing anything. The classic
REM  "python3 -m http.server" from BUILD.md, wrapped for double-click life.
REM
REM  Part of the fed-os-bridge: connecting FED-EDU (knowledge) to FED-OS
REM  (the founder's operating system). Lives in the repo root for easy
REM  access; works on any Windows 7+ box with Python installed.
REM ====================================================================

title FED-EDU Local Server - The Block On Your Machine
color 0A

echo.
echo  ============================================================
echo    FED-EDU LOCAL SERVER BOOT
echo    The block, running on YOUR machine - no internet needed
echo  ============================================================
echo.

REM ---- Find a Python (py launcher first, then PATH, then honest help) ----
where py >nul 2>nul
if %errorlevel%==0 (
    set PYCMD=py -3
    goto :found
)

where python >nul 2>nul
if %errorlevel%==0 (
    set PYCMD=python
    goto :found
)

where python3 >nul 2>nul
if %errorlevel%==0 (
    set PYCMD=python3
    goto :found
)

REM ---- No Python? The honest redirect (Windows machines on this block often lack it) ----
echo  [!] No Python found on this machine.
echo.
echo      TWO WAYS FORWARD - pick your fighter:
echo.
echo      A) Install Python (free, ~5 min, one time):
echo           https://www.python.org/downloads/
echo           CHECK "Add Python to PATH" during install - that box matters.
echo           Then run this file again.
echo.
echo      B) No-install route (works TODAY on any Windows):
echo           Your block sites run fine opened straight from the folder -
echo           double-click any index.html. Local server is for testing
echo           the PWA/service-worker features (see BUILD.md).
echo.
echo      Either way you're building today. The block has no
echo      hardware disqualifiers. Welcome. - FED-EDU
echo.
pause
exit /b 0

:found
echo  [+] Python found. Lighting the local server...
echo.
echo  ------------------------------------------------------------
echo   WHEN IT STARTS:
echo     - Browser opens to http://localhost:8080
echo     - This window MUST STAY OPEN - it IS the server
echo     - Close the window = close the server (that's normal)
echo  ------------------------------------------------------------
echo.

REM 2-second pause so brothers actually read the "keep this window open" part
timeout /t 2 /nobreak >nul

REM Boot the server from the repo root (this file's parent's parent)
cd /d "%~dp0..\.."

REM Fire the server + open the browser to the core app
start "" http://localhost:8080/core-system/index.html
%PYCMD% -m http.server 8080

REM If the server stops (window closed or crash), land gracefully
echo.
echo  [i] Server stopped. Everything you saved is still on disk -
echo      commits made offline push later with "git push".
echo      The block waits for you. - FED-EDU
echo.
pause
