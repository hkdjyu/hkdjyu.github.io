# 燈帶控制盒 - 利用 micro:bit, LCD1602 和 EC11 控制 SK6812 燈帶

<!-- ![專案實物圖](請在此處替換為實物圖的相對路徑/URL) -->

## 📖 專案簡介

本專案旨在為香港中學的生物課堂提供一個實用、穩定的植物生長燈控制方案。透過 micro:bit V2 作為核心，搭配具有極佳光譜表現的 SK6812 RGBW 燈帶，教師與學生可以精準控制植物所需的光照顏色與週期。

本專案具備以下三大核心目標：
1. **支援植物生長實驗**：提供不同波長（紅、藍、白）與自訂時間的光照，方便進行光合作用或向光性等變因實驗。
2. **提供穩定培育光源**：利用動態亮度縮放演算法，在長時間運作下提供無損耗、高穩定的生長燈光。
3. **推廣 STEM 程式教育**：作為中學資訊科技或 STEM 課程的進階實例，讓學生了解硬體中斷（Interrupt）、I2C 通訊、狀態機（State Machine）以及動態選單系統的編程技巧。

---

## 🛠️ 硬體需求與接線

*   **主控板**：BBC micro:bit V2 (搭配擴展板)
*   **顯示螢幕**：LCD1602 (帶 I2C 轉接板，位址預設為 39 / 0x27)
*   **輸入模組**：EC11 旋轉編碼器 (帶按鍵功能)
*   **輸出光源**：SK6812 RGBW 燈帶 (建議 60燈/m，冷白/自然白規格)
*   **電源供應**：外部 5V 大電流電源 (供燈帶使用，**請勿直接用 micro:bit 供電給燈帶**)

### 接線圖
<!-- ![硬體接線圖](請在此處替換為接線圖或Fritzing截圖的相對路徑/URL) -->

| 模組 | 腳位 / 說明 | micro:bit 擴展板對應腳位 |
| :--- | :--- | :--- |
| **LCD1602** | SDA / SCL | I2C 專用腳位 |
| **EC11** | SW (按鍵) | P14 |
| **EC11** | EN-A (旋轉A相) | P15 |
| **EC11** | EN-B (旋轉B相) | P16 |
| **SK6812** | DIN (資料輸入) | P13 |

> **⚠️ 注意事項：** SK6812 全亮時電流極大，請務必將外部 5V 電源的 GND 與 micro:bit 的 GND 共地，以確保訊號穩定。

---

## ⚙️ 系統功能與模式

控制盒內建四種主要運行狀態：

1. **Preset (預設模式)**：內建 5 組快速光譜（純白、純紅、純綠、純藍、全暗），適合快速切換基礎光源。
2. **Manual (手動模式)**：允許使用者獨立調整 W, R, G, B 四個通道的數值 (0-9)，精確調配特定波長的光線。
3. **Timer (定時模式)**：支援 4 個階段 (P1~P4) 的自動循環。可設定每個階段的持續時間（小時/分鐘）及對應的 WRGB 光源。適合模擬日出、日落或設定光照週期。
4. **Global Brightness (全局亮度)**：在待機畫面轉動旋鈕，即可在 0-9 之間動態縮放總輸出亮度，且不會改變已設定好的光譜比例。

---

## 🕹️ 操作指南

本控制盒的所有操作皆透過單一 **EC11 旋轉編碼器** 完成：

*   **旋轉 (轉動)**：
    *   在首頁待機畫面：調整全局亮度。
    *   在選單畫面：切換選項或增減數值。
*   **短按 (Short Press)**：
    *   在首頁待機畫面：進入系統選單。
    *   在選單畫面：確認選項、進入下一步或儲存設定。
*   **長按 (Long Press > 0.8秒)**：
    *   任何畫面下：取消當前操作、返回上一層，或強制退回首頁待機畫面。

---

## 💻 完整 MakeCode TypeScript 代碼

您可以將以下代碼直接複製並貼上到 MakeCode 的 JavaScript/TypeScript 編輯頁面中進行燒錄：

```typescript
/**
 * micro:bit V2 + EC11 (單旋鈕 + 音效 + 全局亮度控制)
 * 專為中學生物植物實驗設計之 SK6812 燈帶控制盒
 */
function getStatusStr () {
    if (sysMode == "P") {
        switch (presetId){
            case 1: mStr = "White"; break;
            case 2: mStr = "Red  "; break;
            case 3: mStr = "Green"; break;
            case 4: mStr = "Blue "; break;
            case 5: mStr = "Dark "; break;
        }
    } else if (sysMode == "M") {
        mStr = "Manual"
    } else if (sysMode == "T") {
        mStr = "Timer P" + (currentPhase + 1)
    }
    brStr = "Br:" + globalBrightness
    while (mStr.length + brStr.length < 16) {
        mStr = "" + mStr + " "
    }
    return "" + mStr + brStr
}

function padStr (s: string) {
    while (s.length < 16) {
        s = "" + s + " "
    }
    return s
}

function updateLights () {
    c = [0, 0, 0, 0]
    if (sysMode == "P") {
        c = PRESETS[presetId - 1]
    } else if (sysMode == "M") {
        c = manualColor
    } else if (sysMode == "T") {
        c = [
        timerData[currentPhase][1],
        timerData[currentPhase][2],
        timerData[currentPhase][3],
        timerData[currentPhase][4]
        ]
    }
    showWRGB(c[0], c[1], c[2], c[3])
}

function applySettings () {
    if (editMode == 0) {
        sysMode = "P"
        presetId = editVal[0]
    } else if (editMode == 1) {
        sysMode = "M"
        manualColor = [editVal[0], editVal[1], editVal[2], editVal[3]]
    } else if (editMode == 2) {
        sysMode = "T"
        currentPhase = 0
        startTime = input.runningTime()
    }
    currentState = MENU_IDLE
    updateLights()
    refreshLCD()
}

function processInputLogic (btn: string) {
    success = false // 修正2：每次進入時重置成功狀態
    
    if (btn == "Q") {
        if (currentState != MENU_IDLE) {
            if (currentState == MENU_MODE) {
                currentState = MENU_IDLE
                updateLights()
            } else if (currentState == MENU_SET_PRESET || currentState == MENU_SET_MANUAL || currentState == MENU_SET_TIMER) {
                if (editStep > 0) {
                    if (currentState == MENU_SET_TIMER) {
                        cPhase = Math.idiv(editStep, 5)
                        if (editStep % 5 == 0) {
                            pPhase = cPhase - 1
                            if (timerData[pPhase][0] == 0) {
                                editStep = pPhase * 5
                            } else {
                                editStep += 0 - 1
                            }
                        } else {
                            editStep += 0 - 1
                        }
                        nPhase = Math.idiv(editStep, 5)
                        if (nPhase != cPhase) {
                            for (let l = 0; l <= 4; l++) editVal[l] = timerData[nPhase][l]
                        }
                    } else {
                        editStep += 0 - 1
                    }
                } else {
                    currentState = MENU_MODE
                    updateLights()
                }
            } else if (currentState == MENU_CONFIRM) {
                if (editMode == 0) {
                    currentState = MENU_SET_PRESET
                } else if (editMode == 1) {
                    currentState = MENU_SET_MANUAL
                } else if (editMode == 2) {
                    currentState = MENU_SET_TIMER
                    if (timerData[3][0] == 0) editStep = 15
                    else editStep = 19
                    for (let o = 0; o <= 4; o++) editVal[o] = timerData[3][o]
                }
            }
            success = true
        }
        return success
    }
    if (currentState == MENU_IDLE) {
        if (btn == "P") {
            currentState = MENU_MODE
            editMode = 0
            success = true
        } else if (btn == "S" && globalBrightness < 9) {
            globalBrightness += 1
            updateLights()
            success = true
        } else if (btn == "R" && globalBrightness > 0) {
            globalBrightness += 0 - 1
            updateLights()
            success = true
        }
    } else if (currentState == MENU_MODE) {
        if (btn == "R" && editMode > 0) {
            editMode += 0 - 1
            success = true
        } else if (btn == "S" && editMode < 2) {
            editMode += 1
            success = true
        } else if (btn == "P") {
            editStep = 0
            editVal = [0, 0, 0, 0, 0]
            if (editMode == 0) {
                editVal[0] = 1
                currentState = MENU_SET_PRESET
            } else if (editMode == 1) {
                currentState = MENU_SET_MANUAL
            } else if (editMode == 2) {
                currentState = MENU_SET_TIMER
                for (let q = 0; q <= 4; q++) editVal[q] = timerData[0][q]
            }
            success = true
        }
    } else if (currentState == MENU_SET_PRESET) {
        if (btn == "R" && editVal[0] > 1) { editVal[0] -= 1; success = true } 
        else if (btn == "S" && editVal[0] < 5) { editVal[0] += 1; success = true } 
        else if (btn == "P") { currentState = MENU_CONFIRM; success = true }
    } else if (currentState == MENU_SET_MANUAL) {
        if (btn == "R" && editVal[editStep] > 0) { editVal[editStep] -= 1; success = true } 
        else if (btn == "S" && editVal[editStep] < 9) { editVal[editStep] += 1; success = true } 
        else if (btn == "P") {
            if (editStep < 3) editStep += 1
            else currentState = MENU_CONFIRM
            success = true
        }
    } else if (currentState == MENU_SET_TIMER) {
        p2 = editStep % 5
        let maxLimit = p2 == 0 ? TIME_MAX : 9
        if (btn == "R" && editVal[p2] > 0) { editVal[p2] -= 1; success = true } 
        else if (btn == "S" && editVal[p2] < maxLimit) { editVal[p2] += 1; success = true } 
        else if (btn == "P") {
            ph = Math.idiv(editStep, 5)
            timerData[ph][p2] = editVal[p2]
            if (p2 == 0 && editVal[0] == 0) {
                if (ph < 3) {
                    editStep = (ph + 1) * 5
                    for (let s = 0; s <= 4; s++) editVal[s] = timerData[ph + 1][s]
                } else {
                    currentState = MENU_CONFIRM
                }
            } else {
                if (editStep < 19) {
                    editStep += 1
                    if (editStep % 5 == 0) {
                        for (let t = 0; t <= 4; t++) editVal[t] = timerData[ph + 1][t]
                    }
                } else {
                    currentState = MENU_CONFIRM
                }
            }
            success = true
        }
    } else if (currentState == MENU_CONFIRM) {
        if (btn == "S") { applySettings(); success = true } 
        else if (btn == "R") {
            if (editMode == 0) currentState = MENU_SET_PRESET
            else if (editMode == 1) currentState = MENU_SET_MANUAL
            else if (editMode == 2) {
                currentState = MENU_SET_TIMER
                if (timerData[3][0] == 0) editStep = 15
                else editStep = 19
                for (let u = 0; u <= 4; u++) editVal[u] = timerData[3][u]
            }
            success = true
        }
    }
    return success
}

function showWRGB (w: number, r: number, g: number, b: number) {
    gScale = BRIGHTNESS_MAP[globalBrightness]
    mw = Math.idiv(BRIGHTNESS_MAP[w] * gScale, 255)
    mr = Math.idiv(BRIGHTNESS_MAP[r] * gScale, 255)
    mg = Math.idiv(BRIGHTNESS_MAP[g] * gScale, 255)
    mb = Math.idiv(BRIGHTNESS_MAP[b] * gScale, 255)
    rgbColor = neopixel.rgb(mr, mg, mb)
    for (let i = 0; i <= strip.length() - 1; i++) {
        strip.setPixelColor(i, rgbColor)
        strip.setPixelWhiteLED(i, mw)
    }
    strip.show()
}

function refreshLCD () {
    if (currentState == MENU_IDLE) {
        I2C_LCD1602.ShowString(getStatusStr(), 0, 0)
        I2C_LCD1602.ShowString(padStr(getColorStr()), 0, 1)
    } else if (currentState == MENU_MODE) {
        I2C_LCD1602.ShowString(padStr("Select Mode:"), 0, 0)
        modes = ["Preset", "Manual", "Timer"]
        I2C_LCD1602.ShowString(padStr("> " + modes[editMode]), 0, 1)
    } else if (currentState == MENU_SET_PRESET) {
        I2C_LCD1602.ShowString(padStr("Preset ID(1-5):"), 0, 0)
        description = "White"
        switch (editVal[0]) {
            case 1: description = "White"; break;
            case 2: description = "Red  "; break;
            case 3: description = "Green"; break;
            case 4: description = "Blue "; break;
            case 5: description = "Dark "; break;
        }
        I2C_LCD1602.ShowString(padStr("> P" + editVal[0] + ": " + description), 0, 1)
        pc = PRESETS[editVal[0] - 1]
        showWRGB(pc[0], pc[1], pc[2], pc[3])
    } else if (currentState == MENU_SET_MANUAL) {
        labels = ["W:", "R:", "G:", "B:"]
        I2C_LCD1602.ShowString(padStr("Manual " + labels[editStep]), 0, 0)
        I2C_LCD1602.ShowString(padStr("Level: " + editVal[editStep]), 0, 1)
        showWRGB(editVal[0], editVal[1], editVal[2], editVal[3])
    } else if (currentState == MENU_SET_TIMER) {
        phase = Math.idiv(editStep, 5)
        param = editStep % 5
        labels2 = [TIME_LABEL, "W:", "R:", "G:", "B:"]
        I2C_LCD1602.ShowString(padStr("P" + (phase + 1) + " " + labels2[param]), 0, 0)
        I2C_LCD1602.ShowString(padStr("Value: " + editVal[param]), 0, 1)
    } else if (currentState == MENU_CONFIRM) {
        I2C_LCD1602.ShowString(padStr("Save Settings?"), 0, 0)
        I2C_LCD1602.ShowString(padStr("S:Yes (Hold:Back)"), 0, 1)
    }
}

function getColorStr () {
    if (sysMode == "P") {
        cw = PRESETS[presetId - 1][0]
        cr = PRESETS[presetId - 1][1]
        cg = PRESETS[presetId - 1][2]
        cb = PRESETS[presetId - 1][3]
    } else if (sysMode == "M") {
        cw = manualColor[0]
        cr = manualColor[1]
        cg = manualColor[2]
        cb = manualColor[3]
    } else if (sysMode == "T") {
        cw = timerData[currentPhase][1]
        cr = timerData[currentPhase][2]
        cg = timerData[currentPhase][3]
        cb = timerData[currentPhase][4]
    }
    return "W:" + cw + " R:" + cr + " G:" + cg + " B:" + cb
}

function playBeep (isValid: boolean) {
    control.inBackground(function () {
        if (isValid) {
            music.playTone(1200, 50)
        } else {
            music.playTone(130, 150)
        }
    })
}

let a = 0, lastA = 0, nextP = 0, hasValid = false, durationMs = 0, anySuccess = false
let count = 0, stepsToProcess = 0, encoderSteps = 0, ok2 = false, pressDuration = 0
let needRefresh = false, ok = false, swHandled = false, swPressStartTime = 0, swState = 0
let currentTime = 0, cb = 0, cg = 0, cr = 0, cw = 0
let labels2: string[] = [] // 修正1：確保是字串陣列
let param = 0, phase = 0
let labels: string[] = []
let pc: number[] = [], description = "", modes: string[] = []
let rgbColor = 0, mb = 0, mg = 0, mr = 0, mw = 0, gScale = 0
let ph = 0, p2 = 0, success = false
let nPhase = 0, pPhase = 0, cPhase = 0, startTime = 0, editMode = 0
let c: number[] = [], s = "", brStr = "", currentPhase = 0
let strip: neopixel.Strip = null
let timerData: number[][] = []
let globalBrightness = 0, manualColor: number[] = [], presetId = 0, sysMode = ""
let PRESETS: number[][] = [], BRIGHTNESS_MAP: number[] = []
let MENU_IDLE = 0, currentState = 0, MENU_CONFIRM = 0
let MENU_SET_TIMER = 0, MENU_SET_MANUAL = 0, MENU_SET_PRESET = 0, MENU_MODE = 0
let editVal: number[] = [], editStep = 0, mStr = ""

// ==========================================
// 系統宣告與硬體初始化
// ==========================================
led.enable(false)
let BTN_P = DigitalPin.P14
let ENC_A = DigitalPin.P15
let ENC_B = DigitalPin.P16
pins.setPull(ENC_A, PinPullMode.PullNone)
pins.setPull(ENC_B, PinPullMode.PullNone)
pins.setPull(BTN_P, PinPullMode.PullNone)

let DEBUG_MODE = true
let TIME_MULTIPLIER = DEBUG_MODE ? 60000 : 3600000
let TIME_LABEL = DEBUG_MODE ? "Min:" : "Hr:"
let TIME_MAX = DEBUG_MODE ? 59 : 24

editVal = [0, 0, 0, 0, 0]
MENU_MODE = 1
MENU_SET_PRESET = 2
MENU_SET_MANUAL = 3
MENU_SET_TIMER = 4
MENU_CONFIRM = 5
currentState = MENU_IDLE
BRIGHTNESS_MAP = [0, 28, 56, 85, 113, 141, 170, 198, 226, 255]
PRESETS = [
    [9, 0, 0, 0], [0, 9, 0, 0], [0, 0, 9, 0], [0, 0, 0, 9], [0, 0, 0, 0]
]
sysMode = "P"
presetId = 1
manualColor = [0, 0, 0, 0]
globalBrightness = 9
timerData = [
    [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]
]

music.setVolume(127)
I2C_LCD1602.LcdInit(39)
strip = neopixel.create(DigitalPin.P13, 60, NeoPixelMode.RGBW)
updateLights()
refreshLCD()

// ==========================================
// 主迴圈
// ==========================================
basic.forever(function () {
    currentTime = input.runningTime()
    swState = pins.digitalReadPin(BTN_P)
    
    if (swState == 0) {
        if (swPressStartTime == 0) {
            swPressStartTime = currentTime
            swHandled = false
        } else if (!(swHandled) && currentTime - swPressStartTime > 800) {
            ok = processInputLogic("Q")
            playBeep(ok)
            needRefresh = true
            swHandled = true
        }
    } else {
        if (swPressStartTime > 0) {
            pressDuration = currentTime - swPressStartTime
            if (!(swHandled) && pressDuration > 50 && pressDuration <= 800) {
                ok2 = processInputLogic("P")
                playBeep(ok2)
                needRefresh = true
            }
            swPressStartTime = 0
            swHandled = false
        }
    }
    
    if (encoderSteps != 0) {
        stepsToProcess = encoderSteps
        encoderSteps = 0
        let dir = stepsToProcess > 0 ? "S" : "R"
        count = Math.abs(stepsToProcess)
        for (let index = 0; index < count; index++) {
            if (processInputLogic(dir)) {
                anySuccess = true
            }
        }
        playBeep(anySuccess)
        needRefresh = true
    }
    
    // 修正3：執行完螢幕刷新後，務必將 needRefresh 歸零，避免主迴圈被卡死
    if (needRefresh) {
        refreshLCD()
        needRefresh = false 
    }
    
    if (currentState == MENU_IDLE && sysMode == "T") {
        durationMs = timerData[currentPhase][0] * TIME_MULTIPLIER
        hasValid = false // 修正：每次判斷前先歸零
        for (let w = 0; w <= 3; w++) {
            if (timerData[w][0] > 0) hasValid = true
        }
        if (hasValid) {
            if (durationMs == 0 || currentTime - startTime >= durationMs) {
                nextP = (currentPhase + 1) % 4
                while (timerData[nextP][0] == 0) {
                    nextP = (nextP + 1) % 4
                }
                currentPhase = nextP
                startTime = currentTime
                updateLights()
                refreshLCD()
            }
        }
    }
    basic.pause(20)
})

// ==========================================
// 背景任務：2ms 精確擷取 EC11 脈衝步數
// ==========================================
control.inBackground(function () {
    lastA = pins.digitalReadPin(ENC_A)
    while (true) {
        a = pins.digitalReadPin(ENC_A)
        if (a != lastA) {
            if (a == 0) {
                if (pins.digitalReadPin(ENC_B) == 1) {
                    encoderSteps += 1
                } else {
                    encoderSteps += 0 - 1
                }
            }
            lastA = a
        }
        basic.pause(2)
    }
})
```