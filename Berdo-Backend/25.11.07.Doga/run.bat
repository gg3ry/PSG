@echo off
echo Berdo-Backend 25.11.07.Doga verzió futtatása
npm install
if %errorlevel% neq 0 (
	echo Valami szar az npm packagek telepítése közben. Kilépés...
	exit /b %errorlevel%
)

:: Start the server
echo node server elindítása folyamatban...
npm start
if %errorlevel% neq 0 (
	echo Valami szar a szerver indítása közben. Kilépés...
	exit /b %errorlevel%
)
else (
    echo Szerver sikeresen elindult.
)
pause