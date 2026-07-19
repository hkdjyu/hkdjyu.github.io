# **智能燈光控制系統 (Smart Lighting System) \- 技術文檔**

## **目錄 (Table of Contents)**

1. [專案概述 (Project Overview)](#bookmark=id.g838r1p6zjt4)  
2. [硬體架構與腳位配置 (Hardware Architecture)](#bookmark=id.th6f24qqfv71)  
3. [照明模式與功能 (Lighting Modes & Features)](#bookmark=id.21iktqmg4j7j)  
4. [選單系統與操作邏輯 (Menu System & UI Logic)](#bookmark=id.ifpie4rjl1qd)  
5. [網頁伺服器與虛擬顯示 (Web Server & Virtual Display)](#bookmark=id.ed3w8wb9pvu5)  
6. [軟體代碼設計亮點 (Software Design Highlights)](#bookmark=id.30lbxbe9jzm1)

## **1\. 專案概述 (Project Overview)**

本專案是一個先進的多空間智能燈光控制系統。系統硬體核心由原先的 micro:bit 升級至 **ESP32-S3 Development Module**，以利用其強大的雙核運算能力與原生的 Wi-Fi 網路支援。

系統支援四個獨立的照明空間（Space A, B, C, D），透過實體 4 鍵按鈕 (Push Buttons) 與 I2C LCD1602 顯示器進行本地端設定，並同步提供一個非阻塞 (Non-blocking) 的 Web Dashboard 供使用者透過瀏覽器進行遠端狀態監控。

## **2\. 硬體架構與腳位配置 (Hardware Architecture)**

系統採用 C/C++ (Arduino Framework) 進行開發。所有按鍵均啟用 ESP32 內部上拉電阻 (Internal Pull-up)，以簡化外部電路設計。

| 組件 (Component) | ESP32-S3 腳位 (Pin) | 功能說明 (Description) |
| :---- | :---- | :---- |
| Button P | GPIO 1 | 確認 / 進入下一層選單 (Confirm / Enter) |
| Button Q | GPIO 2 | 全域返回 / 取消 (Global Back / Cancel) |
| Button R | GPIO 8 | 減少數值 / 選單左移 (Decrease / Previous) |
| Button S | GPIO 12 | 增加數值 / 選單右移 (Increase / Next) |
| LCD SDA | GPIO 20 | I2C 資料線 (Data Line) |
| LCD SCL | GPIO 19 | I2C 時脈線 (Clock Line) |

**註：** LCD1602 採用 I2C 介面，預設位址為 0x27。必須使用 5V (VIN) 供電以確保對比度與背光正常顯示。

## **3\. 照明模式與功能 (Lighting Modes & Features)**

每個獨立空間 (Space A\~D) 均可自由配置為以下三種模式之一：

### **3.1 預設模式 (Preset Mode \- "P")**

系統內建 5 組靜態純色設定，將複雜的 RGBW 參數簡化為一鍵套用。數值預設為 0-9 階級，映射至 0-255 亮度。

* **P1:** 白光 (W:9, R:0, G:0, B:0)  
* **P2:** 紅光 (W:0, R:9, G:0, B:0)  
* **P3:** 綠光 (W:0, R:0, G:9, B:0)  
* **P4:** 藍光 (W:0, R:0, G:0, B:9)  
* **P5:** 全關閉 (W:0, R:0, G:0, B:0)

### **3.2 手動模式 (Manual Mode \- "M")**

允許使用者針對 W (白)、R (紅)、G (綠)、B (藍) 四個通道進行獨立設定。數值範圍限制為 **0 \~ 9 階**，提升使用者的按鍵操作體驗，並由程式底層自動查表 (Lookup Table) 轉換為 0 \~ 255 的實際 PWM 亮度。

### **3.3 定時模式 (Timer Mode \- "T")**

一個高度靈活的 4 階段 (Phase) 異步循環定時器。每個空間具備獨立的計時狀態機。

* **參數：** 每個 Phase 包含 5 個參數（持續時數 Hrs, W, R, G, B）。  
* **零時數跳過機制 (Zero-skip Logic)：** 若某個 Phase 的時數設定為 0，系統會瞬間略過該階段，自動尋找下一個有效階段。這允許使用者彈性建立 1\~4 個階段的自訂循環（例如：僅設定日夜 2 階段循環）。  
* **防呆機制：** 若 4 個 Phase 皆設定為 0 小時，系統會暫停該燈條的計時器，維持靜態燈光以防止無窮迴圈當機。

## **4\. 選單系統與操作邏輯 (Menu System & UI Logic)**

系統採用多層級狀態機 (State Machine) 管理 LCD 顯示與使用者輸入。任何設定在「確認儲存」前，皆為暫存狀態。

**主選單層級 (State Flow):** \[IDLE\] 閒置畫面 \-\> \[STRIP\] 選擇空間 (All, A, B, C, D) \-\> \[MODE\] 選擇模式 (P, M, T) \-\> \[SETTING\] 細項數值設定 \-\> \[CONFIRM\] 確認儲存

* **閒置畫面交替 (Idle Toggle)：** 在未操作的 IDLE 狀態下，LCD 會每 5 秒自動在「各空間狀態 (如 A-P1, B-M)」與「ESP32 本機 IP 地址」之間切換顯示。  
* **即時預覽 (Real-time Preview)：** 在設定 Preset 或 Manual 參數時，網頁端 (虛擬燈光) 會即時反映當前調整的顏色。若選擇 "All"，四個空間會同步預覽。  
* **全域返回 (Global Back)：** 在任何設定步驟按下 Q 鍵，將撤銷預覽並退回上一層；在最頂層按下 Q 鍵將放棄所有修改並退回 IDLE 狀態。

## **5\. 網頁伺服器與虛擬顯示 (Web Server & Virtual Display)**

為了取代實體 SK6812 燈條的部署測試，ESP32-S3 架設了一個 Non-blocking 網頁伺服器 (Port 80)。

* **HTML/CSS 生成：** ESP32 內部以字串形式動態拼接 HTML，並將硬體的 W, R, G, B 數值透過演算法（將白光平均分配至 RGB 通道）轉換為 CSS 支援的 rgb(r,g,b) 語法。  
* **自動刷新：** 網頁頭部加入 \<meta http-equiv="refresh" content="2"\>，使客戶端瀏覽器每 2 秒自動索取最新狀態，無需使用複雜的 WebSocket 即可實現平滑監控。

## **6\. 軟體代碼設計亮點 (Software Design Highlights)**

* **無阻塞架構 (Non-blocking Architecture)：** 核心 loop() 中絕對不使用 delay()。按鍵偵測、定時器推進、以及 Web Server 請求處理均依賴 millis() 進行時間差計算，確保系統在高負載下依然保持極高的按鍵靈敏度。  
* **邊緣觸發與防抖 (Edge-triggered Debounce)：** 按鍵輸入採用 250ms 的冷卻時間與狀態比對，徹底解決按鍵連點 (Bouncing) 問題。  
* **一維化陣列操作：** 在處理 Timer 模式的 20 個設定步驟時，巧妙利用除法求商 (phase \= step / 5) 與餘數 (param \= step % 5)，將複雜的多層級選單扁平化，大幅減少了 if-else 判斷式，節省記憶體並提高可讀性。

© 2026 Smart Lighting System Project. Generated for ESP32-S3 & Arduino Framework.