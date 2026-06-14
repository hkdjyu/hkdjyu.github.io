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