; electron/autoLaunch.nsh

; 定义宏 - 创建自启动
!macro createAutoLaunch
  ; 写入注册表，设置开机自启动
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "SimpleClock" "$INSTDIR\SimpleClock.exe"
  ; 可选：添加启动参数
  ; WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "SimpleClock" "$INSTDIR\SimpleClock.exe --minimized"，--minimized可以在应用中通过process.argv.includes('--minimized')判断
!macroend

; 定义宏 - 移除自启动
!macro removeAutoLaunch
  ; 删除注册表自启动项
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "SimpleClock"
!macroend

Function .onInstSuccess
  ; 仅首次安装时询问开机自启动，更新版本时不再弹窗（通过注册表标记判断）
  ReadRegStr $0 HKCU "Software\VinkayProjects\SimpleClock" "Installed"
  StrCmp $0 "1" skipAutoLaunch
  ; 首次安装：询问是否开机自启动
  MessageBox MB_YESNO|MB_ICONQUESTION \
    "是否设置开机自启动？$\n$\n\
      如果选择'是',应用将在开机时自启动。$\n\
      您后续可以在简易时钟（SimpleClock）的设置中编辑此功能" \
  IDNO skipWrite
    !insertMacro createAutoLaunch
    MessageBox MB_OK|MB_ICONINFORMATION \
     "自启动设置成功 $\n\
     您可以在简易时钟（SimpleClock）的设置中禁用此功能"
  skipWrite:
  WriteRegStr HKCU "Software\VinkayProjects\SimpleClock" "Installed" "1"
  skipAutoLaunch:
FunctionEnd

Section "" ; 无名段，确保宏被包含，否则自启动添加键和值都不对
SectionEnd

; 卸载时的清理操作
Section "Uninstall"
  ; 移除自启动注册表项
  !insertmacro removeAutoLaunch
  
  ; 可选：删除其他相关注册表项
  DeleteRegKey HKCU "Software\VinkayProjects\SimpleClock"
  
  ; 不删除 $APPDATA\SimpleClock / $LOCALAPPDATA\SimpleClock，避免更新时清空窗口位置、置顶等配置（app-config.json）
  ; 用户若需彻底清除数据，可手动删除 %AppData%\SimpleClock 文件夹
SectionEnd