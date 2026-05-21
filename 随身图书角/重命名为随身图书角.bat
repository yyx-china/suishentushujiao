@echo off
chcp 65001 >nul
cd /d "%USERPROFILE%\Desktop"
if exist "随身图书角\" (
  echo 桌面上已有文件夹「随身图书角」，无需重复重命名。
  pause
  exit /b 0
)
if not exist "毓秀图书角-cursor修改\" (
  echo 未找到「毓秀图书角-cursor修改」。可能已改名，或路径不同。
  pause
  exit /b 1
)
echo 正在将「毓秀图书角-cursor修改」改名为「随身图书角」…
echo 请先关闭 Cursor 中打开的本项目，否则可能改名失败。
timeout /t 3
ren "毓秀图书角-cursor修改" "随身图书角"
if exist "随身图书角\" (
  echo 完成！新路径：%USERPROFILE%\Desktop\随身图书角
) else (
  echo 改名失败。请关闭 Cursor 后，在桌面手动将文件夹重命名为「随身图书角」。
)
pause
