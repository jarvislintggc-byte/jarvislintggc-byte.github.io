# 作品集維護方式

本機網站已從目前公開版 `8b6a544b2b6cbc3dfde02557d4412c2e54be1ca3` 同步。後續直接維護這個儲存庫；另一個舊專案的建置輸出不作為準版。

## 分享資訊

首頁的 Open Graph 與 Twitter 標籤各保留一套，三種語言各自保留 canonical 網址、介紹與現有分享圖片。

```powershell
python tools/test_maintenance.py
```

## Git 基準

受目前工作環境的 `.git` 寫入限制影響，自動更新 Git 紀錄尚未完成。可在一般 Windows 環境雙擊 `tools/sync-git.cmd`。它會先取得遠端紀錄，再用 mixed reset 對齊最新取得的 `origin/main`，不會固定退回舊提交；保留目前網站檔案及後續修改，最後執行維護測試。整個流程不會發布網站。

## 預覽

雙擊根目錄 `preview-local.cmd`。目前的本機預覽仍受執行環境網路權限影響；未能開啟預覽時，先檢查啟動視窗的錯誤。
