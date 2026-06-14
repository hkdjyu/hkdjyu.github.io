# 利用Google OR Tools編排時間表實例
## 前言
過去有朋友向我分享，會議排程、房間分配、或者編排時間表這類問題，直接問 AI 往往得不到完美的答案。當時總結的原因很簡單：編排的限制太多，AI 無法主動判定要求的彈性程度與優先次序。最近因為工作需要，我仔細研究了一下，在解決問題的過程中有感而發，決定分享。

## 時間表要求
```
暑期中一銜接課程編排例子：四天時間
基礎背景：
7位老師
5個班級 (ABCDE)
4個上課天(Day1,2,3,4)
節數：首先每天有六節，L1(08:20-08:55)到L3(09:30-10:05)，然後小息(10:05-10:15)，之後L4(10:15-10:50)到L6(11:25-12:00)。
每班目前時間表：
ClassA:
Day1: 開學禮，班主任節，空，空，評估，評估
Day2: 空，活動，活動，空，空，空
Day3: 空，空，測驗，測驗，空，班主任節
Day4: 評估，音樂，空，空，結業禮，結業禮
ClassB:
Day1: 開學禮，班主任節，空，空，評估，評估
Day2: 空，活動，活動，空，空，空
Day3: 空，空，測驗，測驗，空，班主任節
Day4: 評估，音樂，空，空，結業禮，結業禮
ClassC:
Day1: 開學禮，班主任節，空，空，評估，評估
Day2: 空，活動，活動，空，空，空
Day3: 空，空，測驗，測驗，空，班主任節
Day4: 評估，音樂，空，空，結業禮，結業禮
ClassD:
Day1: 開學禮，班主任節，空，空，評估，評估
Day2: 空，空，空，活動，活動，空
Day3: 空，空，測驗，測驗，空，班主任節
Day4: 評估，音樂，空，空，結業禮，結業禮
ClassE:
Day1: 開學禮，班主任節，空，空，評估，評估
Day2: 空，空，空，活動，活動，空
Day3: 空，空，測驗，測驗，空，班主任節
Day4: 評估，音樂，空，空，結業禮，結業禮

老師及節數要求：
中文老師（每班2節）
英文老師（每班2節）
數學老師（每班2節）
生活老師（每班2節）
宗教老師（每班1節）
資源中心老師（每班1節）
校園參觀老師（每班1節）

編排優先考量：
(1) 所有資源中心老師課堂安排在兩天內； 所有校園參觀老師課堂安排在兩天內
(2) 所有宗教堂安排在Day3,Day4
(3) 每班在Day1, Day2參與一節中文及一節英文堂，餘下一節安排在Day3,Day4
(4) 所有生活技能課是兩節連續課堂(可相隔小息)
```

## 解決方法
(1) 向AI描述我們的時間表要求  
(2) 指示AI利用OR TOOLS生成python代碼  
(3) 下載python代碼，例如在下載到Desktop，命名為`run.py`  
(4) 確保電腦已下載python  
(5) 確保電腦已下載OR TOOLS (使用 `pip install ortools`)  
(6) 打開cmd或terminal，前往檔案位置，例如Desktop  
(7) 執行 `python ./run.py` 或 `python3 ./run.py`  
(8) 瀏覽結果

## AI生成的 OR TOOLS python代碼
```python
from ortools.sat.python import cp_model
def main():
    # ==========================================
    # 1. 基礎資料定義
    # ==========================================
    classes = ['A', 'B', 'C', 'D', 'E']
    num_classes = len(classes)
    num_teachers = 7
    num_days = 4
    num_periods = 6

    # 老師科目對應與每班每週所需節數
    # 0:中文(2), 1:英文(2), 2:數學(2), 3:生活(2), 4:宗教(1), 5:資源(1), 6:參觀(1)
    teacher_requirements = {0: 2, 1: 2, 2: 2, 3: 2, 4: 1, 5: 1, 6: 1}

    # 各班級的固定佔用日程表 (1代表可排課, 0代表已有固定活動不可排課)
    class_available = {}
    for c in range(num_classes):
        for d in range(num_days):
            for p in range(num_periods):
                class_available[(c, d, p)] = 1

    # 設定不可排課的固定活動
    for c in range(num_classes):
        # Day 1
        class_available[(c, 0, 0)] = 0 # 開學禮
        class_available[(c, 0, 1)] = 0 # 班主任
        class_available[(c, 0, 4)] = 0 # 評估
        class_available[(c, 0, 5)] = 0 # 評估
        # Day 3
        class_available[(c, 2, 2)] = 0 # 測驗
        class_available[(c, 2, 3)] = 0 # 測驗
        class_available[(c, 2, 5)] = 0 # 班主任
        # Day 4
        class_available[(c, 3, 0)] = 0 # 評估
        class_available[(c, 3, 1)] = 0 # 音樂
        class_available[(c, 3, 4)] = 0 # 結業禮
        class_available[(c, 3, 5)] = 0 # 結業禮
    # Day 2
    for c in [0, 1, 2]: # Class A, B, C
        class_available[(c, 1, 1)] = 0 # 活動
        class_available[(c, 1, 2)] = 0 # 活動
    for c in [3, 4]:    # Class D, E
        class_available[(c, 1, 3)] = 0 # 活動
        class_available[(c, 1, 4)] = 0 # 活動
    model = cp_model.CpModel()

    # ==========================================
    # 2. 建立主要決策變數
    # ==========================================
    x = {}
    for t in range(num_teachers):
        for c in range(num_classes):
            for d in range(num_days):
                for p in range(num_periods):
                    x[(t, c, d, p)] = model.NewBoolVar(f'x_{t}_{c}_{d}_{p}')

    # ==========================================
    # 3. 基礎約束條件
    # ==========================================
    # (A) 班級有固定活動時，所有老師不排課 (老師此時自然閒置)
    for c in range(num_classes):
        for d in range(num_days):
            for p in range(num_periods):
                if class_available[(c, d, p)] == 0:
                    for t in range(num_teachers):
                        model.Add(x[(t, c, d, p)] == 0)
    # (B) 老師不分身
    for t in range(num_teachers):
        for d in range(num_days):
            for p in range(num_periods):
                model.AddAtMostOne(x[(t, c, d, p)] for c in range(num_classes))
    # (C) 學生不分身
    for c in range(num_classes):
        for d in range(num_days):
            for p in range(num_periods):
                model.AddAtMostOne(x[(t, c, d, p)] for t in range(num_teachers))
    # (D) 滿足每班教學總節數
    for c in range(num_classes):
        for t, req in teacher_requirements.items():
            model.Add(sum(x[(t, c, d, p)] for d in range(num_days) for p in range(num_periods)) == req)

    # ==========================================
    # 4. 進階優先考量
    # ==========================================
    # 優先考量 (1)：資源中心(t=5) 與 校園參觀(t=6) 安排在兩天內
    for t in [5, 6]:
        day_active = [model.NewBoolVar(f'active_t{t}_d{d}') for d in range(num_days)]
        for d in range(num_days):
            model.Add(sum(x[(t, c, d, p)] for c in range(num_classes) for p in range(num_periods)) <= 100 * day_active[d])
            model.Add(sum(x[(t, c, d, p)] for c in range(num_classes) for p in range(num_periods)) >= day_active[d])
        model.Add(sum(day_active) <= 2)
    # 優先考量 (2)：宗教堂(t=4) 安排在 Day3 或 Day4
    for c in range(num_classes):
        for p in range(num_periods):
            model.Add(x[(4, c, 0, p)] == 0) # Day 1 禁止
            model.Add(x[(4, c, 1, p)] == 0) # Day 2 禁止
    # 優先考量 (3) 更新版：每班在 Day1 或 Day2「合計」至少出現一節中文(t=0) 及 英文(t=1)
    for c in range(num_classes):
        for t in [0, 1]:
            # Day 1 (d=0) 和 Day 2 (d=1) 的總和 >= 1
            model.Add(sum(x[(t, c, d, p)] for d in [0, 1] for p in range(num_periods)) >= 1)
    # 優先考量 (4)：所有生活技能課(t=3) 是兩節連續課堂
    for c in range(num_classes):
        for d in range(num_days):
            has_life_lesson = model.NewBoolVar(f'has_life_{c}_{d}')
            day_lessons = sum(x[(3, c, d, p)] for p in range(num_periods))
            model.Add(day_lessons == 2 * has_life_lesson)
            pair_vars = []
            for p in range(num_periods - 1):
                is_pair = model.NewBoolVar(f'pair_{c}_{d}_{p}')
                model.Add(x[(3, c, d, p)] + x[(3, c, d, p+1)] == 2).OnlyEnforceIf(is_pair)
                # 如果不是這個 pair，則該 pair 不能同時為 1
                not_pair = model.NewBoolVar(f'not_pair_{c}_{d}_{p}')
                model.Add(x[(3, c, d, p)] + x[(3, c, d, p+1)] <= 1).OnlyEnforceIf(not_pair)
                model.AddExactlyOne([is_pair, not_pair])
                pair_vars.append(is_pair)
            model.Add(sum(pair_vars) == has_life_lesson)

    # ==========================================
    # 5. 求解與輸出
    # ==========================================
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 60.0
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print("【成功排定課表！】\n")
        teacher_names = {0: "中文", 1: "英文", 2: "數學", 3: "生活", 4: "宗教", 5: "資源", 6: "參觀"}
        for c_idx, c_name in enumerate(classes):
            print(f"================== 班級 {c_name} 課表 ==================")
            for d in range(num_days):
                day_schedule = []
                for p in range(num_periods):
                    if class_available[(c_idx, d, p)] == 0:
                        if d == 0 and p == 0: day_schedule.append("開學禮")
                        elif d == 0 and p == 1: day_schedule.append("班主任")
                        elif d == 0 and p in [4,5]: day_schedule.append("評估")
                        elif d == 1 and c_idx in [0,1,2] and p in [1,2]: day_schedule.append("活動")
                        elif d == 1 and c_idx in [3,4] and p in [3,4]: day_schedule.append("活動")
                        elif d == 2 and p in [2,3]: day_schedule.append("測驗")
                        elif d == 2 and p == 5: day_schedule.append("班主任")
                        elif d == 3 and p == 0: day_schedule.append("評估")
                        elif d == 3 and p == 1: day_schedule.append("音樂")
                        elif d == 3 and p in [4,5]: day_schedule.append("結業禮")
                        else: day_schedule.append("固定")
                    else:
                        assigned = "----" # 由於是零容錯率，理論上不會出現空堂
                        for t in range(num_teachers):
                            if solver.Value(x[(t, c_idx, d, p)]) == 1:
                                assigned = f"[{teacher_names[t]}]"
                        day_schedule.append(assigned)
                print(f"Day {d+1} -> L1-L3: {day_schedule[0:3]} | (小息) | L4-L6: {day_schedule[3:6]}")
            print()
    else:
        print("無法找到滿足所有條件的課表（無解），請檢查約束條件是否相互衝突。")

if __name__ == '__main__':
    main() 
```

## 結果
```
【成功排定課表！】

================== 班級 A 課表 ==================
Day 1 -> L1-L3: ['開學禮', '班主任', '[資源]'] | (小息) | L4-L6: ['[數學]', '評估', '評估']
Day 2 -> L1-L3: ['[數學]', '活動', '活動'] | (小息) | L4-L6: ['[中文]', '[中文]', '[英文]']
Day 3 -> L1-L3: ['[參觀]', '[宗教]', '測驗'] | (小息) | L4-L6: ['測驗', '[英文]', '班主任']
Day 4 -> L1-L3: ['評估', '音樂', '[生活]'] | (小息) | L4-L6: ['[生活]', '結業禮', '結業禮']

================== 班級 B 課表 ==================
Day 1 -> L1-L3: ['開學禮', '班主任', '[數學]'] | (小息) | L4-L6: ['[資源]', '評估', '評估']
Day 2 -> L1-L3: ['[英文]', '活動', '活動'] | (小息) | L4-L6: ['[生活]', '[生活]', '[中文]']
Day 3 -> L1-L3: ['[英文]', '[參觀]', '測驗'] | (小息) | L4-L6: ['測驗', '[宗教]', '班主任']
Day 4 -> L1-L3: ['評估', '音樂', '[數學]'] | (小息) | L4-L6: ['[中文]', '結業禮', '結業禮']

================== 班級 C 課表 ==================
Day 1 -> L1-L3: ['開學禮', '班主任', '[生活]'] | (小息) | L4-L6: ['[生活]', '評估', '評估']
Day 2 -> L1-L3: ['[中文]', '活動', '活動'] | (小息) | L4-L6: ['[資源]', '[英文]', '[數學]']
Day 3 -> L1-L3: ['[宗教]', '[數學]', '測驗'] | (小息) | L4-L6: ['測驗', '[參觀]', '班主任']
Day 4 -> L1-L3: ['評估', '音樂', '[中文]'] | (小息) | L4-L6: ['[英文]', '結業禮', '結業禮']

================== 班級 D 課表 ==================
Day 1 -> L1-L3: ['開學禮', '班主任', '[中文]'] | (小息) | L4-L6: ['[英文]', '評估', '評估']
Day 2 -> L1-L3: ['[參觀]', '[生活]', '[生活]'] | (小息) | L4-L6: ['活動', '活動', '[資源]']
Day 3 -> L1-L3: ['[中文]', '[英文]', '測驗'] | (小息) | L4-L6: ['測驗', '[數學]', '班主任']
Day 4 -> L1-L3: ['評估', '音樂', '[宗教]'] | (小息) | L4-L6: ['[數學]', '結業禮', '結業禮']

================== 班級 E 課表 ==================
Day 1 -> L1-L3: ['開學禮', '班主任', '[英文]'] | (小息) | L4-L6: ['[中文]', '評估', '評估']
Day 2 -> L1-L3: ['[資源]', '[數學]', '[數學]'] | (小息) | L4-L6: ['活動', '活動', '[參觀]']
Day 3 -> L1-L3: ['[生活]', '[生活]', '測驗'] | (小息) | L4-L6: ['測驗', '[中文]', '班主任']
Day 4 -> L1-L3: ['評估', '音樂', '[英文]'] | (小息) | L4-L6: ['[宗教]', '結業禮', '結業禮']
```

## OR Tools 簡單教學
[點我前往](./posts/post3/tutorial.html)