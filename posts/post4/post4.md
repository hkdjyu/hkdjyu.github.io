# **智能燈光控制系統 (Smart Lighting System) \- 技術文檔**

## **目錄 (Table of Contents)** 

1. [專案概述 (Project Overview)](#1-專案概述-project-overview)
2. [硬體架構與腳位配置 (Hardware Architecture)](#2-硬體架構與腳位配置-hardware-architecture)
3. [照明模式與功能 (Lighting Modes & Features)](#3-照明模式與功能-lighting-modes--features)
4. [選單系統與操作邏輯 (Menu System & UI Logic)](#4-選單系統與操作邏輯-menu-system--ui-logic)
5. [網頁伺服器與虛擬顯示 (Web Server & Virtual Display)](#5-網頁伺服器與虛擬顯示-web-server--virtual-display) 
6. [軟體代碼設計亮點 (Software Design Highlights)](#6-軟體代碼設計亮點-software-design-highlights)

## **1\. 專案概述 (Project Overview)**

本專案是一個先進的多空間智能燈光控制系統。系統硬體核心由原先的 micro:bit 升級至 **ESP32-S3 Development Module**，以利用其強大的雙核運算能力與原生的 Wi-Fi 網路支援。

系統支援四個獨立的照明空間（Space A, B, C, D），透過實體 4 鍵按鈕 (Push Buttons) 與 I2C LCD1602 顯示器進行本地端設定，並同步提供一個非阻塞 (Non-blocking) 的 Web Dashboard 供使用者透過瀏覽器進行遠端狀態監控。

## **2\. 硬體架構與腳位配置 (Hardware Architecture)**

系統採用 C/C++ (Arduino Framework) 進行開發。所有按鍵均啟用 ESP32 內部上拉電阻 (Internal Pull-up)，以簡化外部電路設計。

| 組件 (Component) | ESP32-S3 腳位 (Pin) | 功能說明 (Description) |
| :---- | :---- | :---- |
| Button P | GPIO 4 | 確認 / 進入下一層選單 (Confirm / Enter) |
| Button Q | GPIO 5 | 全域返回 / 取消 (Global Back / Cancel) |
| Button R | GPIO 6 | 減少數值 / 選單左移 (Decrease / Previous) |
| Button S | GPIO 7 | 增加數值 / 選單右移 (Increase / Next) |
| LCD SDA | GPIO 9 | I2C 資料線 (Data Line) |
| LCD SCL | GPIO 8 | I2C 時脈線 (Clock Line) |

**註：** LCD1602 採用 I2C 介面，預設位址為 0x27。必須使用 5V (VIN) 供電以確保對比度與背光正常顯示。

## **3\. 照明模式與功能 (Lighting Modes & Features)**

每個獨立空間 (Space A\~D) 均可自由配置為以下三種模式之一：

### **3.1 預設模式 (Preset Mode \- "P")**

系統內建 5 組靜態純色設定，將複雜的 RGBW 參數簡化為一鍵套用。數值預設為 0-9 階級，映射至 0-255 亮度。

* **P1:** 白光 `(W:9, R:0, G:0, B:0)`
* **P2:** 紅光 `(W:0, R:9, G:0, B:0)`
* **P3:** 綠光 `(W:0, R:0, G:9, B:0)`
* **P4:** 藍光 `(W:0, R:0, G:0, B:9)`
* **P5:** 全關閉 `(W:0, R:0, G:0, B:0)`

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

## **6\. 代碼片段 (Code Snippets)**

{% raw %}
```cpp
/*
 * 專案：ESP32-S3 多空間智能燈光控制系統 (虛擬網頁版)
 * 硬體：ESP32-S3, I2C LCD1602 (0x27), 4顆 Push Buttons
 * 功能：支援 Web 監控、4區獨立控制、預設/手動/定時(循環跳過0時數)模式
 */

#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// ==========================================
// 1. Wi-Fi 與 Web Server 設定
// ==========================================
// 請在這裡填入你的 Wi-Fi 名稱與密碼
// const char* ssid = "YOUR_WIFI_SSID";
const char* ssid = "gordon";      
// const char* password = "YOUR_WIFI_PASSWORD";  
const char* password = "93499857";

// 建立網頁伺服器物件，監聽 Port 80
WebServer server(80);

// ==========================================
// 2. 硬件腳位與全域變數初始化
// ==========================================
// 定義按鍵的 GPIO 腳位 (對應 P, Q, R, S)
#define BTN_P 4   // 確認 / 進入
#define BTN_Q 5   // 返回 / 取消
#define BTN_R 6   // 減少 / 上一步
#define BTN_S 7  // 增加 / 下一步

// ESP32-S3 的 I2C 腳位設定 (連接 LCD1602)
#define I2C_SCL 9
#define I2C_SDA 8

// 初始化 LCD 物件，0x27 為最常見的 I2C 位址，16行2列
// (若螢幕不亮或無字，請嘗試改為 0x3F)
LiquidCrystal_I2C lcd(0x27, 16, 2);

// 亮度轉換表：將用戶輸入的 0~9 階級，映射到真實 CSS RGB 支援的 0~255
const int BRIGHTNESS_MAP[10] = {0, 28, 56, 85, 113, 141, 170, 198, 226, 255};

// 預設模式定義，陣列格式為 [W, R, G, B]，數值範圍為 0~9
const int PRESETS[5][4] = {
    {9, 0, 0, 0}, // P1: 純白光
    {0, 9, 0, 0}, // P2: 純紅光
    {0, 0, 9, 0}, // P3: 純綠光
    {0, 0, 0, 9}, // P4: 純藍光
    {0, 0, 0, 0}  // P5: 全關
};

// --- 系統核心狀態變數 ---
// 記錄四個空間(A,B,C,D)當前的模式 ('P'=Preset, 'M'=Manual, 'T'=Timer)
char stripMode[4] = {'P', 'P', 'P', 'P'};
// 記錄預設模式下的 Preset ID (1~5)
int stripPresetId[4] = {1, 2, 3, 4};
// 記錄手動模式的顏色設定 [燈條][W, R, G, B]
int stripManualColor[4][4] = {{0,0,0,0}, {0,0,0,0}, {0,0,0,0}, {0,0,0,0}}; 

// Timer 專用變數 
// 三維陣列：[4個燈條] [4個階段Phase] [5個參數: 0:小時, 1:W, 2:R, 3:G, 4:B]
int stripTimerData[4][4][5] = {0}; 
int timerCurrentPhase[4] = {0, 0, 0, 0};       // 記錄各燈條目前執行到哪一個階段
unsigned long timerStartTime[4] = {0, 0, 0, 0}; // 記錄各階段開始的時間戳記 (millis)

// 當前網頁需顯示的顏色 [空間][W, R, G, B]，用於即時預覽與網頁伺服器讀取
int currentColors[4][4] = {{0,0,0,0}, {0,0,0,0}, {0,0,0,0}, {0,0,0,0}};

// --- UI 選單狀態機 ---
enum MenuState { MENU_IDLE, MENU_STRIP, MENU_MODE, MENU_SET_PRESET, MENU_SET_MANUAL, MENU_SET_TIMER, MENU_CONFIRM };
MenuState currentState = MENU_IDLE;

int editTarget = 0;   // 正在編輯的目標：0=All, 1=A, 2=B, 3=C, 4=D
int editMode = 0;     // 正在選擇的模式：0=Preset, 1=Manual, 2=Timer
int editStep = 0;     // 控制設定步驟 (用於 Manual 的 4 個參數，與 Timer 的 20 個參數)
int editVal[5] = {0, 0, 0, 0, 0}; // 暫存正在設定的數值，確認後才會寫入系統變數

// --- 防抖與背景排程變數 ---
char lastBtn = '\0';
unsigned long btnCooldown = 0;         // 避免按鍵連點的冷卻時間
bool isShowingIP = false;              // 標記目前 LCD 是否正在顯示 IP 地址
unsigned long lastIdleToggleTime = 0;  // 記錄上一次切換 LCD 閒置畫面的時間

// ==========================================
// 3. 核心邏輯與顯示函式
// ==========================================

/**
 * @brief 根據系統狀態，更新虛擬顏色陣列供 Web 伺服器與預覽讀取
 */
void updateVirtualLights() {
    for (int i = 0; i < 4; i++) {
        if (stripMode[i] == 'P') {
            for(int j=0; j<4; j++) currentColors[i][j] = PRESETS[stripPresetId[i] - 1][j];
        } else if (stripMode[i] == 'M') {
            for(int j=0; j<4; j++) currentColors[i][j] = stripManualColor[i][j];
        } else if (stripMode[i] == 'T') {
            int phase = timerCurrentPhase[i];
            for(int j=0; j<4; j++) currentColors[i][j] = stripTimerData[i][phase][j+1]; // j+1 跳過時間參數
        }
    }
}

/**
 * @brief 取得單一空間的狀態字串，確保長度固定，方便 LCD 顯示
 */
String getStatusString(int index) {
    char buf[8]; // LCD 每行16字元，分為兩半剛好8個字元
    if (stripMode[index] == 'P') {
        sprintf(buf, "%c-P%d  ", 'A'+index, stripPresetId[index]);
    } else if (stripMode[index] == 'M') {
        sprintf(buf, "%c-M   ", 'A'+index);
    } else if (stripMode[index] == 'T') {
        sprintf(buf, "%c-T%d  ", 'A'+index, timerCurrentPhase[index] + 1);
    }
    return String(buf);
}

/**
 * @brief 負責更新 LCD 畫面的核心函式
 */
void refreshLCD() {
    lcd.clear();
    if (currentState == MENU_IDLE) {
        if (isShowingIP) {
            lcd.setCursor(0, 0); 
            lcd.print("IP Address:     "); // 後方補滿空白覆蓋舊字
            
            lcd.setCursor(0, 1);
            String ipStr = WiFi.localIP().toString();
            while(ipStr.length() < 16) ipStr += " "; // 補齊 16 字元
            lcd.print(ipStr);
        } else {
            lcd.setCursor(0, 0);
            String line1 = getStatusString(0) + getStatusString(1);
            while(line1.length() < 16) line1 += " ";
            lcd.print(line1);
            
            lcd.setCursor(0, 1);
            String line2 = getStatusString(2) + getStatusString(3);
            while(line2.length() < 16) line2 += " ";
            lcd.print(line2);
        }
    } 
    // 進入選單
    else if (currentState == MENU_STRIP) {
        lcd.setCursor(0, 0); lcd.print("Select Strip:");
        const char* targets[] = {"All", "A", "B", "C", "D"};
        lcd.setCursor(0, 1); lcd.print(String("> ") + targets[editTarget]);
    } 
    else if (currentState == MENU_MODE) {
        lcd.setCursor(0, 0); lcd.print("Select Mode:");
        const char* modes[] = {"Preset", "Manual", "Timer"};
        lcd.setCursor(0, 1); lcd.print(String("> ") + modes[editMode]);
    } 
    else if (currentState == MENU_SET_PRESET) {
        lcd.setCursor(0, 0); lcd.print("Preset ID(1-5):");
        lcd.setCursor(0, 1); lcd.print("> P" + String(editVal[0]));
        
        // 即時預覽：支援 All 模式同步變色
        int startIdx = (editTarget == 0) ? 0 : (editTarget - 1);
        int endIdx   = (editTarget == 0) ? 3 : (editTarget - 1);
        for (int i = startIdx; i <= endIdx; i++) {
            for(int j=0; j<4; j++) currentColors[i][j] = PRESETS[editVal[0]-1][j];
        }
    } 
    else if (currentState == MENU_SET_MANUAL) {
        const char* labels[] = {"W:", "R:", "G:", "B:"};
        lcd.setCursor(0, 0); lcd.print(String("Manual ") + labels[editStep]);
        lcd.setCursor(0, 1); lcd.print("Level: " + String(editVal[editStep]));
        
        // 即時預覽：支援 All 模式同步變色
        int startIdx = (editTarget == 0) ? 0 : (editTarget - 1);
        int endIdx   = (editTarget == 0) ? 3 : (editTarget - 1);
        for (int i = startIdx; i <= endIdx; i++) {
            for(int j=0; j<4; j++) currentColors[i][j] = editVal[j];
        }
    } 
    else if (currentState == MENU_SET_TIMER) {
        int phase = editStep / 5;   // 技巧：利用除法求商數得知當前 Phase (0~3)
        int param = editStep % 5;   // 技巧：利用餘數得知當前設定參數 (Hrs, W, R, G, B)
        const char* labels[] = {"Hrs:", "W:", "R:", "G:", "B:"};
        lcd.setCursor(0, 0); lcd.print("P" + String(phase+1) + " " + labels[param]);
        lcd.setCursor(0, 1); lcd.print("Value: " + String(editVal[param]));
        // Timer 模式因為涉及時間設定，通常不在此做即時預覽
    } 
    else if (currentState == MENU_CONFIRM) {
        lcd.setCursor(0, 0); lcd.print("Save Settings?");
        lcd.setCursor(0, 1); lcd.print("S:Yes Q/R:Back");
    }
}

/**
 * @brief 用戶點擊儲存(S)後，將暫存的設定寫入系統變數並生效
 */
void applySettings() {
    int startIdx = (editTarget == 0) ? 0 : (editTarget - 1);
    int endIdx   = (editTarget == 0) ? 3 : (editTarget - 1);
    
    // 根據目標(單一或All)，將設定套用
    for (int i = startIdx; i <= endIdx; i++) {
        if (editMode == 0) {
            stripMode[i] = 'P';
            stripPresetId[i] = editVal[0];
        } else if (editMode == 1) {
            stripMode[i] = 'M';
            for(int j=0; j<4; j++) stripManualColor[i][j] = editVal[j];
        } else if (editMode == 2) {
            stripMode[i] = 'T';
            timerCurrentPhase[i] = 0;
            timerStartTime[i] = millis(); // 確認當下開始計時
        }
    }
    
    // 重置主畫面狀態
    currentState = MENU_IDLE;
    isShowingIP = false;           // 強制切回顯示燈條狀態
    lastIdleToggleTime = millis(); // 重新開始 5 秒計時
    updateVirtualLights();         
    refreshLCD();
}

// ==========================================
// 4. 按鍵狀態機處理
// ==========================================

/**
 * @brief 接收按鍵指令並處理選單層級邏輯
 */
void handleMenuInput(char btn) {
    // 全域返回鍵 (Q) 邏輯處理
    if (btn == 'Q' && currentState != MENU_IDLE) {
        if (currentState == MENU_STRIP) {
            currentState = MENU_IDLE;
            isShowingIP = false;
            lastIdleToggleTime = millis();
            updateVirtualLights(); // 撤銷任何預覽，恢復原本狀態
        } else if (currentState == MENU_MODE) {
            currentState = MENU_STRIP;
        } else if (currentState == MENU_SET_PRESET || currentState == MENU_SET_MANUAL || currentState == MENU_SET_TIMER) {
            if (editStep > 0) editStep--; // 退回上一個設定步驟
            else { 
                currentState = MENU_MODE; 
                updateVirtualLights(); // 撤銷預覽
            }
        } else if (currentState == MENU_CONFIRM) {
            // 退回最後一步的設定畫面
            if (editMode == 0) currentState = MENU_SET_PRESET;
            else if (editMode == 1) currentState = MENU_SET_MANUAL;
            else if (editMode == 2) currentState = MENU_SET_TIMER;
        }
        refreshLCD();
        return;
    }

    // 各層級的按鍵邏輯 (狀態流轉)
    switch (currentState) {
        case MENU_IDLE:
            if (btn == 'P') { currentState = MENU_STRIP; editTarget = 0; }
            break;
            
        case MENU_STRIP:
            if (btn == 'R') editTarget = max(0, editTarget - 1);
            else if (btn == 'S') editTarget = min(4, editTarget + 1);
            else if (btn == 'P') { currentState = MENU_MODE; editMode = 0; }
            break;
            
        case MENU_MODE:
            if (btn == 'R') editMode = max(0, editMode - 1);
            else if (btn == 'S') editMode = min(2, editMode + 1);
            else if (btn == 'P') {
                editStep = 0;
                // 進入細項設定前，清空暫存值
                for(int i=0; i<5; i++) editVal[i] = 0; 
                
                if (editMode == 0) { editVal[0] = 1; currentState = MENU_SET_PRESET; }
                else if (editMode == 1) currentState = MENU_SET_MANUAL;
                else if (editMode == 2) currentState = MENU_SET_TIMER;
            }
            break;
            
        case MENU_SET_PRESET:
            if (btn == 'R') editVal[0] = max(1, editVal[0] - 1);
            else if (btn == 'S') editVal[0] = min(5, editVal[0] + 1);
            else if (btn == 'P') currentState = MENU_CONFIRM;
            break;
            
        case MENU_SET_MANUAL:
            if (btn == 'R') editVal[editStep] = max(0, editVal[editStep] - 1);
            else if (btn == 'S') editVal[editStep] = min(9, editVal[editStep] + 1);
            else if (btn == 'P') {
                if (editStep < 3) editStep++; // 依序設定 W -> R -> G -> B
                else currentState = MENU_CONFIRM;
            }
            break;
            
        case MENU_SET_TIMER: {
            int param = editStep % 5;
            // 只有時間(Hrs)最大值是 24，其餘亮度最大值是 9
            int maxLimit = (param == 0) ? 24 : 9; 
            
            if (btn == 'R') editVal[param] = max(0, editVal[param] - 1);
            else if (btn == 'S') editVal[param] = min(maxLimit, editVal[param] + 1);
            else if (btn == 'P') {
                int phase = editStep / 5;
                int startIdx = (editTarget == 0) ? 0 : (editTarget - 1);
                int endIdx   = (editTarget == 0) ? 3 : (editTarget - 1);
                
                // 將當前步驟的數值，直接寫入背景暫存的 Timer 陣列中
                for (int i = startIdx; i <= endIdx; i++) {
                    stripTimerData[i][phase][param] = editVal[param];
                }
                
                // Timer 共有 4 個 Phase，每個 Phase 有 5 個變數，共 20 步 (0~19)
                if (editStep < 19) {
                    editStep++;
                    // 當進入下一個 Phase 的時候，清空編輯暫存區，避免帶入舊數值
                    if (editStep % 5 == 0) { for(int i=0; i<5; i++) editVal[i] = 0; }
                } else {
                    currentState = MENU_CONFIRM;
                }
            }
            break;
        }
            
        case MENU_CONFIRM:
            if (btn == 'S') applySettings();
            else if (btn == 'R') {
                // 如果按下R減少(返回)，則回到上一層繼續設定
                if (editMode == 0) currentState = MENU_SET_PRESET;
                else if (editMode == 1) currentState = MENU_SET_MANUAL;
                else if (editMode == 2) currentState = MENU_SET_TIMER;
            }
            break;
    }
    refreshLCD();
}

// ==========================================
// 5. Web Server 處理路由 (產生 HTML 網頁)
// ==========================================

/**
 * @brief 將 0~9 階的 WRGB 轉換成網頁 CSS 認識的 rgb() 色碼
 * @note 將白光 (W) 的值平均分配給 RGB，模擬燈條照亮空間的混光效果
 */
String getRGBForWeb(int c_array[4]) {
    int w = BRIGHTNESS_MAP[c_array[0]];
    // 防止混色後數值超過 CSS 支援的 255 上限
    int r = min(255, BRIGHTNESS_MAP[c_array[1]] + w);
    int g = min(255, BRIGHTNESS_MAP[c_array[2]] + w);
    int b = min(255, BRIGHTNESS_MAP[c_array[3]] + w);
    return "rgb(" + String(r) + "," + String(g) + "," + String(b) + ")";
}

/**
 * @brief 當瀏覽器連線時，動態生成 HTML 並發送
 */
void handleRoot() {
    // 網頁開頭：使用 raw string literal 方便排版，並設定每 2 秒自動刷新
    String html = R"rawliteral(
    <!DOCTYPE html>
    <html>
    <head>
        <title>ESP32 Light Control</title>
        <meta http-equiv="refresh" content="2">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { font-family: Arial; text-align: center; background-color: #222; color: white; }
            .container { display: flex; flex-wrap: wrap; justify-content: center; margin-top: 20px; }
            .box { width: 150px; height: 150px; margin: 15px; border-radius: 15px; border: 3px solid #555; 
                   display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; 
                   text-shadow: 1px 1px 3px black; box-shadow: 0 0 15px rgba(255,255,255,0.2); }
        </style>
    </head>
    <body>
        <h2>Space Illumination</h2>
        <div class="container">
    )rawliteral";

    // 動態產生 4 個顯示空間的方塊
    char boxHtml[500];
    for(int i=0; i<4; i++) {
        sprintf(boxHtml, "<div class=\"box\" style=\"background-color: %s\">Space %c<br>%c</div>", 
                getRGBForWeb(currentColors[i]).c_str(), 'A'+i, stripMode[i]);
        html += boxHtml;
    }

    // 網頁結尾
    html += R"rawliteral(
        </div>
        <p>Auto-refreshing every 2s</p>
    </body>
    </html>
    )rawliteral";

    server.send(200, "text/html", html);
}

// ==========================================
// 6. 系統初始化 (Setup) 
// ==========================================
void setup() {
    Serial.begin(115200);
    
    // 初始化按鍵腳位：(使用帶有電阻的按鈕)
    pinMode(BTN_P, INPUT);
    pinMode(BTN_Q, INPUT);
    pinMode(BTN_R, INPUT);
    pinMode(BTN_S, INPUT);

    // 初始化 I2C 通訊與 LCD 螢幕
    Wire.begin(I2C_SDA, I2C_SCL);
    lcd.init();
    lcd.backlight();
    lcd.print("Connecting WiFi");

    // 連線至 Wi-Fi 路由器 (Station 模式)
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    // 連線成功，印出 IP 地址供使用者參考
    Serial.println("\nWiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    // 設定網頁伺服器的根目錄路由，並啟動服務
    server.on("/", handleRoot);
    server.begin();

    // 系統開機初始化顯示
    updateVirtualLights();
    refreshLCD();
}

// ==========================================
// 7. 主迴圈 (Loop) - 處理網路、按鍵與定時器
// ==========================================
void loop() {
    // 處理是否有瀏覽器客戶端連線請求 (Non-blocking)
    server.handleClient();

    // 1. 讀取按鍵狀態
    char currentBtn = '\0';
    if (digitalRead(BTN_P) == HIGH) currentBtn = 'P';
    else if (digitalRead(BTN_Q) == HIGH) currentBtn = 'Q';
    else if (digitalRead(BTN_R) == HIGH) currentBtn = 'R';
    else if (digitalRead(BTN_S) == HIGH) currentBtn = 'S';

    unsigned long currentMillis = millis();
    
    // 2. 按鍵防抖 (Debounce) 與邊緣觸發機制
    // 條件：有按鍵被按下 + 和上一次狀態不同 (防止長按狂跳) + 距離上次觸發超過 250 毫秒
    if (currentBtn != '\0' && currentBtn != lastBtn && currentMillis - btnCooldown > 250) {
        
        // 透過 Serial Monitor 印出，方便測試與除錯
        Serial.print("Button Pressed: ");
        Serial.println(currentBtn);
        
        handleMenuInput(currentBtn);       // 呼叫選單邏輯
        btnCooldown = currentMillis;       // 重置冷卻時間
    }
    lastBtn = currentBtn; // 記錄這次的狀態供下一次迴圈比對

    // 3. 背景定時器 (Timer) 進度檢查
    // 為了不干擾用戶操作選單，只有在系統處於待機畫面 (IDLE) 時才進行時間判定
    if (currentState == MENU_IDLE) {
        
        // --- 閒置畫面：每 5 秒切換顯示 IP 或 狀態 ---
        if (currentMillis - lastIdleToggleTime >= 5000) {
            lastIdleToggleTime = currentMillis;
            isShowingIP = !isShowingIP;
            refreshLCD();
        }

        bool timerUpdated = false;
        
        // 檢查 4 個空間的計時器
        for (int i = 0; i < 4; i++) {
            if (stripMode[i] == 'T') {
                int phase = timerCurrentPhase[i];
                // 測試模式為分鐘 (60000UL)，正式部署時請改為小時 (3600000UL)
                unsigned long duration_ms = stripTimerData[i][phase][0] * 60000UL;
                
                // 安全檢查：確認這個燈條的 4 個 Phase 裡，是否至少有一個時間 > 0
                bool hasValidPhase = false;
                for(int p = 0; p < 4; p++) {
                    if (stripTimerData[i][p][0] > 0) hasValidPhase = true;
                }

                // 只有在有設定有效時間的情況下，才進行階段推進判定
                if (hasValidPhase) {
                    // 觸發條件：若該階段設定為 0 (立刻跳過)，或是倒數計時已結束
                    if (duration_ms == 0 || (currentMillis - timerStartTime[i] >= duration_ms)) {
                        
                        // 先指向下一個階段
                        int nextPhase = (phase + 1) % 4; 
                        
                        // 自動尋找並跳過所有時間設定為 0 的階段
                        while (stripTimerData[i][nextPhase][0] == 0) {
                            nextPhase = (nextPhase + 1) % 4;
                        }
                        
                        timerCurrentPhase[i] = nextPhase;      // 更新為有效的階段
                        timerStartTime[i] = currentMillis;     // 重新開始計時
                        timerUpdated = true;
                    }
                }
            }
        }
        
        // 如果有任何階段發生切換，一次性更新網頁虛擬燈光並刷新 LCD
        if (timerUpdated) {
            updateVirtualLights();
            refreshLCD();
        }
    }
}
```
{% endraw %}