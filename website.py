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
        completed_questions = 0
        max_possible_score = 24  # Updated to 24 total questions
        questions_details = []  # Track individual question scores

        # Helper to normalize strings
        def normalize(value):
            return value.strip().lower() if isinstance(value, str) else value

        # Quiz 1 - Each item in the sequence counts as 1 point (4 points total)
        correct_sequence = [normalize(x) for x in quiz_data['questions'][0]['correctAnswer']]
        user_sequence = [normalize(x) for x in session.get('quiz1_answer', [])]
        
        if user_sequence:
            completed_questions += 4  # 4 positions in the sequence
            for i in range(min(len(correct_sequence), len(user_sequence))):
                if i < len(user_sequence) and i < len(correct_sequence):
                    if user_sequence[i] == correct_sequence[i]:
                        total_score += 1
                        questions_details.append({"quiz": 1, "question": i+1, "correct": True})
                    else:
                        questions_details.append({"quiz": 1, "question": i+1, "correct": False})

        # Quiz 2 - Each item categorization counts as a point
        # Get correct answers
        correct_helps = set([normalize(x) for x in quiz_data['questions'][1]['correctAnswer']['Helps Sleep']])
        correct_hurts = set([normalize(x) for x in quiz_data['questions'][1]['correctAnswer']['Hurts Sleep']])
        
        # Get user answers
        user_helps = set([normalize(x) for x in session.get('quiz2_helps', [])])
        user_hurts = set([normalize(x) for x in session.get('quiz2_hurts', [])])
        
        if user_helps or user_hurts:
            # Count all items to track completion
            all_items = set(correct_helps) | set(correct_hurts)
            completed_questions += len(all_items)
            
            # Check each help item
            for item in correct_helps:
                if item in user_helps:
                    total_score += 1
                    questions_details.append({"quiz": 2, "question": item, "correct": True})
                else:
                    questions_details.append({"quiz": 2, "question": item, "correct": False})
            
            # Check each hurt item
            for item in correct_hurts:
                if item in user_hurts:
                    total_score += 1
                    questions_details.append({"quiz": 2, "question": item, "correct": True})
                else:
                    questions_details.append({"quiz": 2, "question": item, "correct": False})
                    
            # Check for incorrectly categorized items
            for item in user_helps:
                if item not in correct_helps and item in correct_hurts:
                    questions_details.append({"quiz": 2, "question": item, "correct": False})
                    
            for item in user_hurts:
                if item not in correct_hurts and item in correct_helps:
                    questions_details.append({"quiz": 2, "question": item, "correct": False})

        # Quiz 3 - Each correct match counts as 1 point (6 points total)
        print("QUIZ 3 DEBUGGING - Starting quiz 3 scoring")
        
        # Get the correct matches from the quiz data using the explicit indices
        correct_matches = {}
        for item in quiz_data['questions'][2]['items']:
            if 'leftIndex' in item and 'rightIndex' in item:
                correct_matches[f"question_{item['leftIndex']}"] = f"answer_{item['rightIndex']}"
        
        print("Correct matches from data:", correct_matches)
        
        user_matches = session.get('quiz3_matches', {})
        print("User submitted matches:", user_matches)
        
        if user_matches:
            completed_questions += len(correct_matches)
            
            for question_key, correct_answer in correct_matches.items():
                # Find if this question was answered
                base_question_key = None
                for user_key in user_matches.keys():
                    if user_key.startswith(question_key):
                        base_question_key = user_key
                        break
                
                if base_question_key and user_matches[base_question_key] == correct_answer:
                    total_score += 1
                    print(f"Correct! {base_question_key} -> {user_matches[base_question_key]} matches {correct_answer}")
                    # Find the original label using the index from the question key
                    question_index = int(question_key.split('_')[1])
                    original_label = None
                    for item in quiz_data['questions'][2]['items']:
                        if item.get('leftIndex') == question_index:
                            original_label = item['label']
                            break
                    
                    questions_details.append({"quiz": 3, "question": original_label or question_key, "correct": True})
                else:
                    print(f"Incorrect! {base_question_key} -> {user_matches.get(base_question_key, 'Not found')} does not match {correct_answer}")
                    # Find the original label using the index from the question key
                    question_index = int(question_key.split('_')[1])
                    original_label = None
                    for item in quiz_data['questions'][2]['items']:
                        if item.get('leftIndex') == question_index:
                            original_label = item['label']
                            break
                    
                    questions_details.append({"quiz": 3, "question": original_label or question_key, "correct": False})
            
            print(f"Quiz 3 score: {total_score} / 6")

        # Quiz 4 - Single question worth 1 point
        correct_answer = normalize(quiz_data['questions'][3]['correctAnswer'])
        user_answer = normalize(session.get('quiz4_answer', ''))
        
        if user_answer:
            completed_questions += 1
            if user_answer == correct_answer:
                total_score += 1
                questions_details.append({"quiz": 4, "question": 1, "correct": True})
            else:
                questions_details.append({"quiz": 4, "question": 1, "correct": False})

        # Quiz 5 - Three separate questions (3 points total)
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
        
        # Q1 - Single choice - worth 1 point
        if user_answers['q1']:
            completed_questions += 1
            if user_answers['q1'] == quiz5_correct['q1']:
                total_score += 1
                questions_details.append({"quiz": 5, "question": 1, "correct": True})
            else:
                questions_details.append({"quiz": 5, "question": 1, "correct": False})
                    
        # Q2 - Drag and drop activity - worth 1 point total
        if user_answers['q2']:
            completed_questions += 1  # Count as ONE question total
            
            # Check if user dragged the correct item(s)
            all_correct = True
            for item in quiz5_correct['q2']:
                if item not in user_answers['q2']:
                    all_correct = False
                    questions_details.append({"quiz": 5, "question": f"2-{item}", "correct": False})
            
            # Also check if user included any wrong items
            for item in user_answers['q2']:
                if item not in quiz5_correct['q2']:
                    all_correct = False
                    questions_details.append({"quiz": 5, "question": f"2-{item}", "correct": False})
            
            if all_correct:
                total_score += 1
                questions_details.append({"quiz": 5, "question": 2, "correct": True})

        # Q3 - Single choice - worth 1 point
        if user_answers['q3']:
            completed_questions += 1
            if user_answers['q3'] == quiz5_correct['q3']:
                total_score += 1
                questions_details.append({"quiz": 5, "question": 3, "correct": True})
            else:
                questions_details.append({"quiz": 5, "question": 3, "correct": False})

        # Get appropriate feedback range
        percentage_score = (total_score / max_possible_score) * 100
        
        # Adjust the feedback ranges to be based on percentages
        for r in quiz_data['results']['ranges']:
            min_percent = (r['min'] / 5) * 100  # Convert from old 5-point to percentage
            max_percent = (r['max'] / 5) * 100
            
            if min_percent <= percentage_score <= max_percent:
                feedback = r.copy()  # Make a copy to modify
                feedback['score'] = f"{total_score}/{max_possible_score}"
                break
        else:
            feedback = {
                "title": "Partial Completion",
                "message": "You completed some questions. Try more!",
                "score": f"{total_score}/{max_possible_score}"
            }

        return jsonify({
            'total_score': total_score,
            'max_score': max_possible_score,
            'completed_questions': completed_questions,
            'feedback': feedback,
            'questions_details': questions_details
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