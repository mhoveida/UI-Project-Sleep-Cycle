from flask import Flask, render_template, request, session, redirect, url_for, jsonify

import json

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

def load_json(filename):
    with open(f'data/{filename}', 'r') as f:
        return json.load(f)

# ROUTES
@app.route("/learn/<int:section_id>")
def learn(section_id):
    section_map = {
        1: ("sleep_cycles.json", "Sleep Cycles", "sleep_cycles"),
        2: ("sleep_disruptors.json", "Sleep Disruptors", "sleep_disruptors"),
    }

    if section_id not in section_map:
        return "Section not found", 404

    filename, title, active_page = section_map[section_id]
    content = load_json(filename)

    if section_id == 1:
        return render_template("sleep_cycle.html", title=title, content=content, active_page=active_page)
    elif section_id == 2:
        return render_template("sleep_disruptors.html", title=title, content=content, active_page=active_page)

@app.route("/learn/2/examples")
def real_world_examples():
    content = load_json("real_world_examples.json")
    return render_template(
        "real_world_examples.html",
        title=content["title"],
        content=content,
        active_page="real_world_examples"
    )

@app.route("/choice")
def choice():
    return render_template(
        "choice.html",
        title="Want to sleep smarter tonight?",
        subtitle="Apply what you've learned to improve your focus and learning tomorrow!",
        active_page=None
    )

@app.route('/')
def home():
   return render_template('home.html', active_page="home")

@app.route('/calculator')
def calculator():
   return render_template('calculator.html', active_page="calculator")

@app.route("/quiz_start")
def quiz_start():
    return render_template('quiz_start.html', active_page="quiz")

@app.route('/quiz1')
def quiz1_sequence():
    return render_template('quiz1_sequence.html', active_page="quiz")

@app.route('/quiz2')
def quiz2_dragdrop():
    return render_template('quiz2_dragdrop.html', active_page="quiz")

@app.route('/quiz3')
def quiz3_matching():
    return render_template('quiz3_matching.html', active_page="quiz")

@app.route('/quiz4')
def quiz4_multiple():
    return render_template('quiz4_multiple.html', active_page="quiz")

@app.route('/quiz5')
def quiz5_combo():
    return render_template('quiz5_combo.html', active_page="quiz")

@app.route('/submit_quiz1', methods=['POST'])
def submit_quiz1():
    data = request.get_json()
    session['quiz1_answer'] = data.get('answer', [])
    return jsonify(success=True)

@app.route('/submit_quiz2', methods=['POST'])
def submit_quiz2():
    data = request.get_json()
    session['quiz2_helps'] = data.get('helps', [])
    session['quiz2_hurts'] = data.get('hurts', [])
    return jsonify(success=True)

@app.route('/submit_quiz3', methods=['POST'])
def submit_quiz3():
    data = request.get_json()
    session['quiz3_matches'] = data.get('matches', {})
    return jsonify(success=True)

@app.route('/submit_quiz4', methods=['POST'])
def submit_quiz4():
    data = request.get_json()
    print("Received Quiz 4 submission:", data)
    session['quiz4_answer'] = data.get('answer', '')
    print("Stored Quiz 4 answer in session:", session['quiz4_answer'])
    return jsonify(success=True)

@app.route('/submit_quiz5', methods=['POST'])
def submit_quiz5():
    data = request.get_json()
    session['quiz5_answers'] = {
        'q1': data.get('q1'),
        'q2': data.get('q2', []),
        'q3': data.get('q3')
    }
    return jsonify(success=True)

# New endpoints to retrieve saved quiz data
@app.route('/get_quiz1_data', methods=['GET'])
def get_quiz1_data():
    return jsonify({
        'success': True,
        'quiz1_answer': session.get('quiz1_answer', [])
    })

@app.route('/get_quiz2_data', methods=['GET'])
def get_quiz2_data():
    return jsonify({
        'success': True,
        'quiz2_helps': session.get('quiz2_helps', []),
        'quiz2_hurts': session.get('quiz2_hurts', [])
    })

@app.route('/get_quiz3_data', methods=['GET'])
def get_quiz3_data():
    return jsonify({
        'success': True,
        'quiz3_matches': session.get('quiz3_matches', {})
    })

@app.route('/get_quiz4_data', methods=['GET'])
def get_quiz4_data():
    return jsonify({
        'success': True,
        'quiz4_answer': session.get('quiz4_answer', '')
    })

@app.route('/get_quiz5_data', methods=['GET'])
def get_quiz5_data():
    return jsonify({
        'success': True,
        'quiz5_answers': session.get('quiz5_answers', {})
    })

@app.route('/save_quiz_answer', methods=['POST'])
def save_quiz_answer():
    data = request.get_json()
    quiz_number = data.get('quiz_number')
    
    if quiz_number == 3:
        connections = data.get('answer', [])
        matches = {}
        
        for conn in connections:
            left_index = conn.get('from')
            right_index = conn.get('to')
            
            left_label = f"question_{left_index}"
            right_match = f"answer_{right_index}"
            
            matches[left_label] = right_match
        
        session['quiz3_matches'] = matches
        return jsonify(success=True)
    
    return jsonify(success=False, error="Unsupported quiz number"), 400

@app.route('/quiz_results', methods=['POST', 'GET'])
def quiz_results():
    if request.method == 'POST':
        with open('data/quiz.json') as f:
            quiz_data = json.load(f)

        total_score = 0
        completed_quizzes = 0
        max_possible_score = 24  # 总分为24分

        # Helper to normalize strings
        def normalize(value):
            return value.strip().lower() if isinstance(value, str) else value

        # Quiz 1 (4分)
        quiz1_score = 0
        correct = [normalize(x) for x in quiz_data['questions'][0]['correctAnswer']]
        user_answer = [normalize(x) for x in session.get('quiz1_answer', [])]
        if user_answer:
            completed_quizzes += 1
            if user_answer == correct:
                quiz1_score = 4  # 全对得4分
            else:
                # 计算部分正确的分数
                correct_items = 0
                for i, item in enumerate(user_answer):
                    if i < len(correct) and item == correct[i]:
                        correct_items += 1
                quiz1_score = round(4 * (correct_items / len(correct)))
            total_score += quiz1_score
            print(f"Quiz 1 score: {quiz1_score}/4")

        # Quiz 2 (10分)
        quiz2_score = 0
        correct_helps = set([normalize(x) for x in quiz_data['questions'][1]['correctAnswer']['Helps Sleep']])
        correct_hurts = set([normalize(x) for x in quiz_data['questions'][1]['correctAnswer']['Hurts Sleep']])
        user_helps = set([normalize(x) for x in session.get('quiz2_helps', [])])
        user_hurts = set([normalize(x) for x in session.get('quiz2_hurts', [])])
        
        # 调试打印
        print("Quiz 2 correct helps:", correct_helps)
        print("Quiz 2 correct hurts:", correct_hurts)
        print("Quiz 2 user helps:", user_helps)
        print("Quiz 2 user hurts:", user_hurts)
        
        # 修复数据匹配问题 - 简化明确的映射
        # 只有明确属于帮助睡眠的项目
        helps_mapping = {
            "meditation": "meditation",
            "reading": "reading physical book",
            "shower": "shower",
            "regular-schedule": "regular schedule"  # 添加正则表达式匹配项
        }
        
        # 其他全部属于伤害睡眠的项目
        hurts_mapping = {
            "eating": "eating",
            "caffeine": "late caffeine",
            "screen": "screen blue light",
            "alcohol": "alcohol before bed",
            "irregular-schedule": "irregular schedule",
            "stress": "stress & anxiety",
            "exercising-late": "exercising late",
            "video-game": "video game",
            "social-media": "social media"
        }
        
        # 应用映射 - 直接应用帮助/伤害睡眠的映射
        mapped_helps = set()
        for item in user_helps:
            item_lower = normalize(item)
            if item_lower in helps_mapping:
                mapped_helps.add(helps_mapping[item_lower])
                print(f"Mapped help item: {item_lower} -> {helps_mapping[item_lower]}")
            else:
                mapped_helps.add(item_lower)
                print(f"Unmapped help item: {item_lower}")
                
        mapped_hurts = set()
        for item in user_hurts:
            item_lower = normalize(item)
            if item_lower in hurts_mapping:
                mapped_hurts.add(hurts_mapping[item_lower])
                print(f"Mapped hurt item: {item_lower} -> {hurts_mapping[item_lower]}")
            else:
                mapped_hurts.add(item_lower)
                print(f"Unmapped hurt item: {item_lower}")
        
        print("Quiz 2 mapped helps:", mapped_helps)
        print("Quiz 2 mapped hurts:", mapped_hurts)
        
        # 直接给予用户高分，如果用户放对了所有三个helps项目
        if user_helps or user_hurts:
            completed_quizzes += 1
            
            # 计算正确项目
            helps_correct = mapped_helps.intersection(correct_helps)
            hurts_correct = mapped_hurts.intersection(correct_hurts)
            
            # 额外打印调试信息
            print(f"Helps correct items: {helps_correct} out of {correct_helps}")
            print(f"Hurts correct items: {hurts_correct} out of {correct_hurts}")
            
            # helps得分分配（共5分）- 增加更宽松的得分条件
            if "meditation" in mapped_helps and "reading physical book" in mapped_helps:
                helps_score = 5  # 如果meditation和reading都正确，满分
            elif len(helps_correct) >= 2:  # 至少有两个正确
                helps_score = 4
            elif len(helps_correct) > 0:
                helps_score = 3  # 至少有一个正确
            else:
                helps_score = 0
                
            # hurts得分分配（共5分）- 增加更宽松的得分条件
            if len(hurts_correct) >= 5:  # 至少5个正确
                hurts_score = 5
            elif len(hurts_correct) >= 4:  # 至少4个正确
                hurts_score = 4
            elif len(hurts_correct) >= 3:  # 至少3个正确
                hurts_score = 3
            elif len(hurts_correct) > 0:   # 至少有1个正确
                hurts_score = 1
            else:
                hurts_score = 0
            
            quiz2_score = helps_score + hurts_score
            total_score += quiz2_score
            print(f"Quiz 2 score: {quiz2_score}/10 (helps: {helps_score}/5, hurts: {hurts_score}/5)")

        # Quiz 3 (6分) - 完全修复
        quiz3_score = 0
        
        # 直接映射question和answer键到具体值
        question_mapping = {
            'question_0': 'sufficient n3 deep sleep',
            'question_1': 'complete rem cycles',
            'question_2': 'insufficient n3 deep sleep',
            'question_3': 'multiple rem cycles',
            'question_4': 'n2 deeper light sleep',
            'question_5': 'disrupted n3 deep sleep'
        }
        
        answer_mapping = {
            'answer_0': 'sick',
            'answer_1': 'sport',
            'answer_2': 'forget',
            'answer_3': 'solve',
            'answer_4': 'guitar',
            'answer_5': 'recovery'
        }
        
        # 正确的配对关系
        correct_q3_pairs = {
            'sufficient n3 deep sleep': 'sport',
            'complete rem cycles': 'solve',
            'insufficient n3 deep sleep': 'sick',
            'multiple rem cycles': 'recovery',
            'n2 deeper light sleep': 'guitar',
            'disrupted n3 deep sleep': 'forget'
        }
        
        user_matches = session.get('quiz3_matches', {})
        print("Quiz 3 raw user matches:", user_matches)
        
        # 处理用户匹配
        if user_matches:
            completed_quizzes += 1
            
            # 转换用户匹配到标准格式
            processed_matches = {}
            for q_key, a_key in user_matches.items():
                if q_key in question_mapping and a_key in answer_mapping:
                    q_val = question_mapping[q_key]
                    a_val = answer_mapping[a_key]
                    processed_matches[q_val] = a_val
                    print(f"Processed match: {q_val} -> {a_val}")
            
            print("Quiz 3 processed matches:", processed_matches)
            
            # 计算匹配正确率
            match_count = 0
            for label, match in processed_matches.items():
                if label in correct_q3_pairs and correct_q3_pairs[label] == match:
                    match_count += 1
                    print(f"Correct match: {label} -> {match}")
                else:
                    expected = correct_q3_pairs.get(label, "unknown")
                    print(f"Incorrect match: {label} -> {match}, expected: {expected}")
            
            # 对于未完成的匹配，不计入错误
            incomplete_matches = len(correct_q3_pairs) - len(processed_matches)
            print(f"Incomplete matches: {incomplete_matches}")
            
            # 全部正确得满分 - 宽松处理未完成的匹配
            if match_count == len(processed_matches) and len(processed_matches) >= 4:
                quiz3_score = 6  # 如果用户提交了至少4个匹配并且全部正确，给满分
                print("All submitted matches correct! Full score awarded.")
            elif match_count == len(correct_q3_pairs):
                quiz3_score = 6  # 如果用户提交了所有匹配并且全部正确，给满分
                print("All matches correct! Full score awarded.")
            else:
                # 按正确率计算分数，但对未完成的匹配采取宽松处理
                effective_total = max(len(processed_matches), 1)  # 防止除以零
                quiz3_score = round(6 * (match_count / effective_total))
                # 确保至少1个正确答案得1分
                if match_count > 0 and quiz3_score == 0:
                    quiz3_score = 1
            
            total_score += quiz3_score
            print(f"Quiz 3 score: {quiz3_score}/6 ({match_count}/{len(processed_matches)} correct matches)")

        # Quiz 4 (1分)
        quiz4_score = 0
        correct = normalize(quiz_data['questions'][3]['correctAnswer'])
        user_answer = normalize(session.get('quiz4_answer', ''))
        print("Quiz 4 correct answer:", correct)
        print("Quiz 4 raw user answer:", user_answer)
        
        # 处理不同格式的答案
        processed_answer = user_answer
        if ":" in user_answer:  # 可能是时间格式
            # 尝试提取时间部分
            time_parts = [p for p in user_answer.split() if ":" in p or p.lower().endswith("a.m.") or p.lower().endswith("p.m.")]
            if time_parts:
                processed_answer = time_parts[0]
                
        # 标准化时间格式
        if processed_answer.lower().endswith("a.m."):
            processed_answer = processed_answer.lower().replace("a.m.", "a.m")
        if processed_answer.lower().endswith("p.m."):
            processed_answer = processed_answer.lower().replace("p.m.", "p.m")
                
        print("Quiz 4 processed answer:", processed_answer)
        
        if user_answer:
            completed_quizzes += 1
            # 完全匹配或者包含正确答案
            if processed_answer == correct or correct in processed_answer or processed_answer in correct:
                quiz4_score = 1
                total_score += quiz4_score
                print("Quiz 4 score: 1/1")
            else:
                print("Quiz 4 score: 0/1")

        # Quiz 5 (3分)
        quiz5_score = 0
        quiz5_correct = {
            'q1': normalize(quiz_data['questions'][4]['correctAnswer']),
            'q2': set([normalize(x) for x in quiz_data['questions'][5]['correctAnswer']]),
            'q3': normalize(quiz_data['questions'][6]['correctAnswer'])
        }
        
        # 获取用户答案并规范化
        user_raw_answers = session.get('quiz5_answers', {})
        print(f"Raw Quiz 5 answers from session: {user_raw_answers}")
        
        # 如果是空的或None，初始化一个空字典
        if not user_raw_answers:
            user_raw_answers = {}
            
        user_answers = {
            'q1': normalize(user_raw_answers.get('q1', '')),
            'q2': set([normalize(x) for x in user_raw_answers.get('q2', [])]),
            'q3': normalize(user_raw_answers.get('q3', ''))
        }
        
        # 记录调试信息
        print("Quiz 5 correct answers:", quiz5_correct)
        print("Quiz 5 user answers:", user_answers)
        
        # 处理空答案情况
        if 'q2' in user_answers and not user_answers['q2']:
            user_answers['q2'] = set()
            
        # 当至少有一个答案时算已完成
        if user_answers.get('q1') or user_answers.get('q2') or user_answers.get('q3'):
            completed_quizzes += 1
            
            # 通用的得分检查工具
            def check_answer(user_ans, correct_ans, question_num):
                if not user_ans:
                    print(f"Quiz 5.{question_num}: No answer provided")
                    return False
                
                # 标准化为小写并移除多余空格
                if isinstance(user_ans, str) and isinstance(correct_ans, str):
                    user_lower = user_ans.lower().strip()
                    correct_lower = correct_ans.lower().strip()
                    
                    # 部分匹配检查
                    if user_lower == correct_lower or user_lower in correct_lower or correct_lower in user_lower:
                        print(f"Quiz 5.{question_num}: Correct")
                        return True
                
                print(f"Quiz 5.{question_num}: Incorrect. User answered: {user_ans}, Expected: {correct_ans}")
                return False
            
            # Q5.1 - 选择题 (1分) - 更宽松的匹配
            q1_correct = check_answer(user_answers['q1'], quiz5_correct['q1'], 1) or \
                       user_answers['q1'] and "deeper light" in user_answers['q1'].lower()
            if q1_correct:
                quiz5_score += 1
            
            # Q5.2 - 拖拽题 (1分) - 更新为只接受Meditation作为唯一正确答案
            if user_answers['q2']:
                # 规范化数据
                correct_q2_items = [x.lower().strip() for x in quiz5_correct['q2']]
                user_q2_items = [x.lower().strip() for x in user_answers['q2']]
                
                print(f"Q5.2 normalized items: {user_q2_items}")
                
                # 检查是否包含meditation
                has_meditation = any(item == "meditation" or "meditation" in item for item in user_q2_items)
                
                # 如果包含meditation，给予满分
                if has_meditation:
                    quiz5_score += 1
                    print(f"Quiz 5.2: Correct (1/1 matches) - Selected Meditation")
                else:
                    # 尝试更宽松的匹配
                    has_meditation_loose = any('med' in item for item in user_q2_items)
                    if has_meditation_loose:
                        quiz5_score += 1
                        print(f"Quiz 5.2: Correct with loose matching - Found meditation-like item")
                    else:
                        print(f"Quiz 5.2: Incorrect - Meditation not selected")
            else:
                print("Quiz 5.2: No answer provided")
            
            # Q5.3 - 选择题 (1分) - 更宽松的匹配
            q3_correct = check_answer(user_answers['q3'], quiz5_correct['q3'], 3) or \
                       (user_answers['q3'] and ("rem" in user_answers['q3'].lower() or "r.e.m" in user_answers['q3'].lower()))
            if q3_correct:
                quiz5_score += 1
            
            total_score += quiz5_score
            print(f"Quiz 5 score: {quiz5_score}/3")

        print(f"Final total score: {total_score}/{max_possible_score}")
        print(f"Completed quizzes: {completed_quizzes}/5")

        # 根据24分制设置反馈
        if total_score >= 21:  # 90%+
            feedback = {
                "title": "Excellent!",
                "message": "You're a sleep cycle expert!",
                "score": f"{total_score}/{max_possible_score}"
            }
        elif total_score >= 17:  # 70%+
            feedback = {
                "title": "Good work!",
                "message": "You understand most sleep concepts!",
                "score": f"{total_score}/{max_possible_score}"
            }
        elif total_score >= 12:  # 50%+
            feedback = {
                "title": "Keep improving!",
                "message": "You're making progress on understanding sleep cycles",
                "score": f"{total_score}/{max_possible_score}"
            }
        elif total_score >= 6:  # 25%+
            feedback = {
                "title": "Keep practicing!",
                "message": "You're learning about sleep cycles",
                "score": f"{total_score}/{max_possible_score}"
            }
        elif completed_quizzes < 5:  # 未完成所有测验
            feedback = {
                "title": "Partial Completion",
                "message": "You completed some quizzes. Try completing all five!",
                "score": f"{total_score}/{max_possible_score}"
            }
        else:  # 很少正确
            feedback = {
                "title": "Try again!",
                "message": "Learning about sleep will improve your health!",
                "score": f"{total_score}/{max_possible_score}"
            }

        return jsonify({
            'total_score': total_score,
            'completed_quizzes': completed_quizzes,
            'feedback': feedback,
            'quiz_scores': {
                'quiz1': quiz1_score,
                'quiz2': quiz2_score,
                'quiz3': quiz3_score,
                'quiz4': quiz4_score,
                'quiz5': quiz5_score
            }
        })

    return render_template('quiz_results.html', active_page="quiz", total_score=None)

@app.route('/quiz_results/q<int:num>')
def quiz_results_question(num):
    # Map question number → title/template
    if   num == 1: return render_template('quiz1_result.html', active_page='quiz')
    elif num == 2: return render_template('quiz2_result.html', active_page='quiz')
    elif num == 3: return render_template('quiz3_result.html', active_page='quiz')
    elif num == 4: return render_template('quiz4_result.html', active_page='quiz')
    elif num == 5: return render_template('quiz5_result.html', active_page='quiz')
    else:           return redirect('/quiz_results')

if __name__ == '__main__':
    app.run(debug=True, port=5001)
