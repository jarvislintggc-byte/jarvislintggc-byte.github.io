# 作品集維護方式

本機網站已從目前公開版 `8b6a544b2b6cbc3dfde02557d4412c2e54be1ca3` 同步。後續直接維護這個儲存庫；另一個舊專案的建置輸出不作為準版。

## 遊戲只修改根目錄

| 位置 | 用途 |
| --- | --- |
| 根目錄 `journey.js`、`journey-*.mjs` | 遊戲唯一可編輯來源 |
| `runtime/journey.js`、`runtime/journey-*.mjs` | 自動生成的執行版本，勿手動修改 |
| `journey-boot.js` | 網頁載入入口，實際載入 `runtime/` |
| `tools/sync_game.py` | 檢查兩套檔案；同步執行版本與快取版本 |

修改來源後執行：

```powershell
python tools/sync_game.py --write
python tools/sync_game.py --check
```

同步會更新所有遊戲模組的引用、載入入口、三語 My Story 頁面的版本與 `runtime/version.json`。每次寫入前會備份相關檔案到本機忽略目錄。遺失來源或來源引用了不存在的模組時會停止，不會直接覆蓋。不要執行舊專案的 `build.py`。

## 分享資訊

首頁的 Open Graph 與 Twitter 標籤各保留一套，三種語言各自保留 canonical 網址、介紹與現有分享圖片。

```powershell
python tools/test_maintenance.py
```

## Git 基準

受目前工作環境的 `.git` 寫入限制影響，自動更新 Git 紀錄尚未完成。可在一般 Windows 環境雙擊 `tools/sync-git.cmd`。它會先取得遠端紀錄，再用 mixed reset 對齊最新取得的 `origin/main`，不會固定退回舊提交；保留目前網站檔案及後續修改，最後檢查遊戲同步狀態並執行維護測試。整個流程不會發布網站。

## 預覽

雙擊根目錄 `preview-local.cmd`。目前的本機預覽仍受執行環境網路權限影響；未能開啟預覽時，先檢查啟動視窗的錯誤。
