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
  ; 添加询问内容
  MessageBox MB_YESNO|MB_ICONQUESTION \
    "是否设置开机自启动？$\n$\n\
      如果选择'是',应用将在开机时自启动。$\n\
      您后续可以在简易时钟（SimpleClock）的设置中编辑此功能" \
  IDNO skipAutoLaunch
    ; 添加自启动代码
    !insertMacro createAutoLaunch
    MessageBox MB_OK|MB_ICONINFORMATION \
     "自启动设置成功 $\n\
     您可以在简易时钟（SimpleClock）的设置中禁用此功能"
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
  
  ; 可选：删除数据文件夹
  RMDir /r "$LOCALAPPDATA\SimpleClock"
  ; 如果有Roaming数据
  RMDir /r "$APPDATA\SimpleClock"  
SectionEnd