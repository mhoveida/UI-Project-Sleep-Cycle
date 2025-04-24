from flask import Flask, render_template, request, jsonify, session
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
        if user_helps or user_hurts:
            completed_quizzes += 1
            if user_helps == correct_helps and user_hurts == correct_hurts:
                total_score += 1

        # Quiz 3
        correct = {normalize(item['label']): normalize(item['match']).replace('.png', '') for item in quiz_data['questions'][2]['items']}
        user_matches = {normalize(k): normalize(v) for k, v in session.get('quiz3_matches', {}).items()}
        if user_matches:
            completed_quizzes += 1
            if user_matches == correct:
                total_score += 1

        # Quiz 4
        correct = normalize(quiz_data['questions'][3]['correctAnswer'])
        user_answer = normalize(session.get('quiz4_answer', ''))
        print("Quiz 4 correct answer:", correct)
        print("Quiz 4 user answer:", user_answer)
        if user_answer:
            completed_quizzes += 1
            if user_answer == correct:
                print("Quiz 4 correct!")
                total_score += 1
            else:
                print("Quiz 4 incorrect.")

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
        if user_answers['q1'] or user_answers['q2'] or user_answers['q3']:
            completed_quizzes += 1
            quiz5_score = 0
            if user_answers['q1'] == quiz5_correct['q1']:
                quiz5_score += 1
            if user_answers['q2'] == quiz5_correct['q2']:
                quiz5_score += 1
            if user_answers['q3'] == quiz5_correct['q3']:
                quiz5_score += 1
            total_score += quiz5_score / 3
            print("Quiz 5 correct:", quiz5_correct)
            print("Quiz 5 user answers:", user_answers)
            print("Quiz 5 score:", quiz5_score)

        total_score = round(total_score, 1)
        print("Total score:", total_score)
        print("Completed quizzes:", completed_quizzes)

        for r in quiz_data['results']['ranges']:
            if r['min'] <= total_score <= r['max']:
                feedback = r
                break
        else:
            feedback = {
                "title": "Partial Completion",
                "message": "You completed some quizzes. Try more!",
                "score": f"{total_score}/5"
            }

        return jsonify({
            'total_score': total_score,
            'completed_quizzes': completed_quizzes,
            'feedback': feedback
        })

    return render_template('quiz_results.html', active_page="quiz", total_score=None)

if __name__ == '__main__':
    app.run(debug=True, port=5001)