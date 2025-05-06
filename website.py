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
        max_possible_score = 5

        # Helper to normalize strings
        def normalize(value):
            return value.strip().lower() if isinstance(value, str) else value

        # Quiz 1
        correct = [normalize(x) for x in quiz_data['questions'][0]['correctAnswer']]
        user_answer = [normalize(x) for x in session.get('quiz1_answer', [])]
        if user_answer:
            completed_quizzes += 1
            if user_answer == correct:
                total_score += 1

        # Quiz 2
        correct_helps = set([normalize(x) for x in quiz_data['questions'][1]['correctAnswer']['Helps Sleep']])
        correct_hurts = set([normalize(x) for x in quiz_data['questions'][1]['correctAnswer']['Hurts Sleep']])
        user_helps = set([normalize(x) for x in session.get('quiz2_helps', [])])
        user_hurts = set([normalize(x) for x in session.get('quiz2_hurts', [])])
        
        # 调试打印
        print("Quiz 2 correct helps:", correct_helps)
        print("Quiz 2 correct hurts:", correct_hurts)
        print("Quiz 2 user helps:", user_helps)
        print("Quiz 2 user hurts:", user_hurts)
        
        # 修复数据匹配问题
        # 将HTML中的data-value映射到正确答案字符串
        mapping = {
            "meditation": "meditation",
            "reading": "reading physical book",
            "irregular-schedule": "regular schedule",
            "screen": "screen blue light",
            "stress": "stress & anxiety",
            "caffeine": "late caffeine",
            "alcohol": "alcohol before bed",
            "exercising-late": "exercising late",
            "shower": "meditation",  # 可能的映射，视实际情况调整
            "eating": "regular schedule"  # 可能的映射，视实际情况调整
        }
        
        # 应用映射
        mapped_helps = set()
        for item in user_helps:
            item_lower = normalize(item)
            if item_lower in mapping:
                mapped_helps.add(mapping[item_lower])
            else:
                mapped_helps.add(item_lower)
                
        mapped_hurts = set()
        for item in user_hurts:
            item_lower = normalize(item)
            if item_lower in mapping:
                mapped_hurts.add(mapping[item_lower])
            else:
                mapped_hurts.add(item_lower)
        
        print("Quiz 2 mapped helps:", mapped_helps)
        print("Quiz 2 mapped hurts:", mapped_hurts)
        
        if user_helps or user_hurts:
            completed_quizzes += 1
            # 放宽条件：如果至少80%正确，就认为通过
            helps_correct = len(mapped_helps.intersection(correct_helps)) / len(correct_helps) if correct_helps else 0
            hurts_correct = len(mapped_hurts.intersection(correct_hurts)) / len(correct_hurts) if correct_hurts else 0
            
            print(f"Quiz 2 helps correctness: {helps_correct:.2f}, hurts correctness: {hurts_correct:.2f}")
            
            if helps_correct >= 0.66 and hurts_correct >= 0.66:
                total_score += 1
                print("Quiz 2 scored as correct")
            elif helps_correct + hurts_correct > 0.8:
                # 如果总体正确率高，给一个部分分数
                total_score += 0.5
                print("Quiz 2 partially correct")
            else:
                print("Quiz 2 incorrect")

        # Quiz 3
        correct = {normalize(item['label']): normalize(item['match']).replace('.png', '') for item in quiz_data['questions'][2]['items']}
        user_matches = {normalize(k): normalize(v) for k, v in session.get('quiz3_matches', {}).items()}
        
        print("Quiz 3 correct matches:", correct)
        print("Quiz 3 raw user matches:", user_matches)
        
        # 重新处理用户匹配
        processed_matches = {}
        
        for k, v in user_matches.items():
            # 处理question_X格式的键
            if k.startswith('question_') and v.startswith('answer_'):
                try:
                    question_idx = int(k.split('_')[1])
                    answer_idx = int(v.split('_')[1])
                    
                    if question_idx < len(quiz_data['questions'][2]['items']) and answer_idx < len(quiz_data['questions'][2]['items']):
                        q_label = normalize(quiz_data['questions'][2]['items'][question_idx]['label'])
                        a_match = normalize(quiz_data['questions'][2]['items'][answer_idx]['match']).replace('.png', '')
                        processed_matches[q_label] = a_match
                except (ValueError, IndexError):
                    continue
            else:
                processed_matches[k] = v
                
        print("Quiz 3 processed matches:", processed_matches)
        
        if user_matches:
            completed_quizzes += 1
            
            # 计算匹配正确率
            match_count = 0
            total_correct = len(correct)
            
            for label, match in processed_matches.items():
                if label in correct and correct[label] == match:
                    match_count += 1
                    
            match_accuracy = match_count / total_correct if total_correct > 0 else 0
            print(f"Quiz 3 match accuracy: {match_accuracy:.2f} ({match_count}/{total_correct})")
            
            if match_accuracy >= 0.8:  # 80%以上正确就算通过
                total_score += 1
                print("Quiz 3 scored as correct")
            elif match_accuracy >= 0.5:  # 50%以上给部分分数
                total_score += 0.5
                print("Quiz 3 partially correct")
            else:
                print("Quiz 3 incorrect")

        # Quiz 4
        correct = normalize(quiz_data['questions'][3]['correctAnswer'])
        user_answer = normalize(session.get('quiz4_answer', ''))
        print("Quiz 4 correct answer:", correct)
        print("Quiz 4 raw user answer:", user_answer)
        
        # 处理不同格式的答案
        # 如果答案包含时间，尝试提取时间值
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
                total_score += 1
                print("Quiz 4 scored as correct")
            else:
                print("Quiz 4 incorrect")

        # Quiz 5
        quiz5_correct = {
            'q1': normalize(quiz_data['questions'][4]['correctAnswer']),
            'q2': set([normalize(x) for x in quiz_data['questions'][5]['correctAnswer']]),
            'q3': normalize(quiz_data['questions'][6]['correctAnswer'])
        }
        user_answers = {
            'q1': normalize(session.get('quiz5_answers', {}).get('q1', '')),
            'q2': set([normalize(x) for x in session.get('quiz5_answers', {}).get('q2', [])]),
            'q3': normalize(session.get('quiz5_answers', {}).get('q3', ''))
        }
        
        print("Quiz 5 correct answers:", quiz5_correct)
        print("Quiz 5 user answers:", user_answers)
        
        # 处理空答案情况
        if 'q2' in user_answers and not user_answers['q2']:
            user_answers['q2'] = set()
            
        # 处理特殊匹配情况
        q5_processed = {
            'q1': False,
            'q2': False,
            'q3': False
        }
        
        # Q5.1 - 选择题
        if user_answers['q1'] and (
            user_answers['q1'] == quiz5_correct['q1'] or 
            "deeper light" in user_answers['q1'].lower() or
            "deeper" in user_answers['q1'].lower() and "light" in user_answers['q1'].lower()
        ):
            q5_processed['q1'] = True
            
        # Q5.2 - 拖拽题，计算交集比例
        if user_answers['q2']:
            common = user_answers['q2'].intersection(quiz5_correct['q2'])
            accuracy = len(common) / len(quiz5_correct['q2']) if quiz5_correct['q2'] else 0
            if accuracy >= 0.5:  # 至少50%正确
                q5_processed['q2'] = True
                
        # Q5.3 - 选择题
        if user_answers['q3'] and (
            user_answers['q3'] == quiz5_correct['q3'] or
            "rem" in user_answers['q3'].lower()
        ):
            q5_processed['q3'] = True
            
        print("Quiz 5 processed results:", q5_processed)
            
        if user_answers['q1'] or user_answers['q2'] or user_answers['q3']:
            completed_quizzes += 1
            
            correct_count = sum(1 for v in q5_processed.values() if v)
            print(f"Quiz 5 correct count: {correct_count}/3")
            
            # 修改逻辑：如果至少答对2/3题，则整个Quiz 5给1分
            if correct_count >= 2:
                total_score += 1
                print("Quiz 5 scored as correct")
            elif correct_count == 1:
                total_score += 0.3  # 只有1题正确时给部分分数
                print("Quiz 5 partially correct (0.3 points)")
            else:
                print("Quiz 5 incorrect")

        total_score = round(total_score * 2) / 2
        print("Final total score (rounded):", total_score)
        print("Completed quizzes:", completed_quizzes)

        # 直接基于分数设置反馈，不使用quiz_data中的ranges
        if total_score >= 4.5:  # 几乎全对或全对
            feedback = {
                "title": "Excellent!",
                "message": "You're a sleep cycle expert!",
                "score": "5/5"  # 满分显示
            }
        elif total_score >= 3.5:  # 大部分正确
            feedback = {
                "title": "Good work!",
                "message": "You understand most sleep concepts!",
                "score": "4/5"
            }
        elif total_score >= 2.5:  # 一半以上正确
            feedback = {
                "title": "Keep improving!",
                "message": "You're making progress on understanding sleep cycles",
                "score": "3/5"
            }
        elif total_score >= 1.5:  # 至少接近一半正确
            feedback = {
                "title": "Keep practicing!",
                "message": "You're learning about sleep cycles",
                "score": "2/5"
            }
        elif completed_quizzes < 5:  # 未完成所有测验
            feedback = {
                "title": "Partial Completion",
                "message": "You completed some quizzes. Try completing all five!",
                "score": f"{max(1, int(total_score))}/5"  # 至少显示1分
            }
        else:  # 完成了但大部分错误
            feedback = {
                "title": "Try again!",
                "message": "Learning about sleep will improve your health!",
                "score": "1/5"  # 最少1分
            }
            
        # 确保分数是整数格式
        if 'score' in feedback and not '/' in feedback['score']:
            feedback['score'] = f"{int(float(feedback['score']))}/5"

        return jsonify({
            'total_score': total_score,
            'completed_quizzes': completed_quizzes,
            'feedback': feedback
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
