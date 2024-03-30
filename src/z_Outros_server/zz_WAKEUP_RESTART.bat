@chcp 65001 && @echo off && setlocal enabledelayedexpansion
set "letra=%~d0" &&  set "local=%~dp0"
set "letra=%letra:~0,1%" && set "local=%local:~0,-1%" && set "arquivo=%~nx0"
set "usuario=%USERNAME%" && set "argTUDO=%~1 %~2 %~3 %~4 %~5" && set "arg1=%~1" && set "arg2=%~2" && set "arg3=%~3" && set "arg4=%~4"

rem set "start=SIM"
rem set "adm=#" && NET SESSION >nul 2>&1
rem if !errorlevel! neq 0 ( set "adm=NAO" ) else ( set "adm=SIM" )

echo WScript.Echo(new Date().getTime()); > !temp!\time.js & for /f "delims=" %%a in ('cscript //nologo !temp!\time.js') do set "timeNow=%%a"
set "timeNow=!timeNow:~0,-3!" & set "dia=!DATE:~0,2!" & set "mes=!DATE:~3,2!" & set "fileAll=!letra!:\ARQUIVOS\WINDOWS\BAT\z_log\z_MES_!mes!_DIA_!dia!.txt"

rem AVISO PARA USAR O ATALHO COM PARAMENTROS
rem if "!arg1!"=="" ( msg * "[zz_WAKEUP_RESTART.bat] Usar o atalho e nao o executavel !local!" & exit & exit )

rem LER O CONFIG
set "conteudo="
for /f "usebackq delims=" %%a in ("!letra!:\ARQUIVOS\PROJETOS\Chrome_Extension\src\config.json") do ( set "conteudo=!conteudo!%%a" )

rem IDENTIFICAR O DISPOSITIVO (OPSEUA/EC2/AWS/ESTRELAR)
set "devMaster="
set "str=!conteudo!"

rem DEVMASTER 'OPSEUA'
set "search=master": "OPSEUA"
set "resultDevMaster=!str:%search%=!"
if /I "!resultDevMaster!" neq "!str!" (
	set "devMaster=OPSEUA"
	goto ENCONTROU_DEVMASTER[SIM]
)

rem DEVMASTER 'EC2'
set "search=master": "EC2"
set "resultDevMaster=!str:%search%=!"
if /I "!resultDevMaster!" neq "!str!" (
	set "devMaster=EC2"
	goto ENCONTROU_DEVMASTER[SIM]
)

rem DEVMASTER 'AWS'
set "search=master": "AWS"
set "resultDevMaster=!str:%search%=!"
if /I "!resultDevMaster!" neq "!str!" (
	set "devMaster=AWS"
	goto ENCONTROU_DEVMASTER[SIM]
)

rem DEVMASTER 'ESTRELAR'
set "search=master": "ESTRELAR"
set "resultDevMaster=!str:%search%=!"
if /I "!resultDevMaster!" neq "!str!" (
	set "devMaster=ESTRELAR"
	goto ENCONTROU_DEVMASTER[SIM]
)

:ENCONTROU_DEVMASTER[SIM]

rem TESTES!!!
rem msg * "[zz_WAKEUP_RESTART.bat] devMaster: !devMaster!" & exit

rem REGISTRAR QUE O WAKEUP RESTART FOI FEITO
echo !TIME! - [NODEJS FILE] = [### WAKEUP_RESTART ###] >>!fileAll!

rem APAGAR LOGS DO PM2
del /f "C:\Users\!USERNAME!\.pm2\pm2.log" & del /f /s /q "C:\Users\!USERNAME!\.pm2\logs"
echo !TIME! - [NODEJS FILE] = [### LOGS PM2 DELETADOS ###] >>!fileAll!

rem PARAR SCRIPTS
rem WebSocket
"!letra!:\ARQUIVOS\PROJETOS\WebSocket\src\z_Outros_server\OFF.vbs"
ping -n 3 -w 1000 127.0.0.1 >nul
rem WebSocket [Old]
"!letra!:\ARQUIVOS\PROJETOS\WebSocketOld\src\z_Outros_server\OFF.vbs"
ping -n 3 -w 1000 127.0.0.1 >nul
rem Sniffer_Python
"!letra!:\ARQUIVOS\PROJETOS\Sniffer_Python\src\z_Outros_server\OFF.vbs"
ping -n 3 -w 1000 127.0.0.1 >nul
rem URA_Reversa [Telein]
"!letra!:\ARQUIVOS\PROJETOS\URA_Reversa\src\z_Outros_serverTelein\OFF.vbs"
ping -n 3 -w 1000 127.0.0.1 >nul
rem URA_Reversa [JSF]
"!letra!:\ARQUIVOS\PROJETOS\URA_Reversa\src\z_Outros_serverJsf\OFF.vbs"
ping -n 3 -w 1000 127.0.0.1 >nul
rem WebScraper [Jucesp]
"!letra!:\ARQUIVOS\PROJETOS\WebScraper\src\z_Outros_serverJucesp\OFF.vbs"
ping -n 3 -w 1000 127.0.0.1 >nul
rem WebScraper [C6]
"!letra!:\ARQUIVOS\PROJETOS\WebScraper\src\z_Outros_serverC6\OFF.vbs"
ping -n 3 -w 1000 127.0.0.1 >nul

if "!devMaster!"=="OPSEUA" (
	rem → OPSEUA
	rem INICIAR WebSocket (hide)
	rem "!letra!:\ARQUIVOS\PROJETOS\WebSocket\src\z_Outros_server\ON_HIDE.vbs"
	"!letra!:\ARQUIVOS\PROJETOS\WebSocket\src\z_Outros_server\ON_VIEW.vbs"
	
	rem INICIAR WebSocket (hide) [Old]
	rem "!letra!:\ARQUIVOS\PROJETOS\WebSocketOld\src\z_Outros_server\ON_HIDE.vbs"
	"!letra!:\ARQUIVOS\PROJETOS\WebSocketOld\src\z_Outros_server\ON_VIEW.vbs"
) else (
	rem → EC2/AWS/ESTRELAR
	rem INICIAR WebSocket (view)
	"!letra!:\ARQUIVOS\PROJETOS\WebSocket\src\z_Outros_server\ON_VIEW.vbs"
	
	rem INICIAR WebSocket (view) [Old]
	"!letra!:\ARQUIVOS\PROJETOS\WebSocketOld\src\z_Outros_server\ON_VIEW.vbs"
	
	ping -n 30 -w 1000 127.0.0.1 >nul
	
	rem INICIAR URA_Reversa [Telein] (view)
	rem "!letra!:\ARQUIVOS\PROJETOS\URA_Reversa\src\z_Outros_serverJsf\ON_VIEW.vbs"
	
	rem INICIAR URA_Reversa [JSF] (view)
	"!letra!:\ARQUIVOS\PROJETOS\URA_Reversa\src\z_Outros_serverJsf\ON_VIEW.vbs"
)

exit
exit


