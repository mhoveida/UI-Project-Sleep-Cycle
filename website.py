from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

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

correct_answers = {
    'quiz1_sequence': ['Light Sleep', 'Deeper Light Sleep', 'Deep Sleep', 'REM Sleep'],
    'quiz2_helps': ['Shower', 'Meditation', 'Reading'],
    'quiz2_hurts': ['Screen', 'Stress', 'Caffeine', 'Alcohol', 'Eating', 'Irregular-schedule', 'Exercising-late'],
    'quiz3_matches': {
        'Sufficient N3 Deep Sleep': 'Sport',
        'Insufficient N3 Deep Sleep': 'Sick',
        'Disrupted N3 Deep Sleep': 'Recovery',
        'Complete REM Cycles': 'Solve',
        'N2 Deeper Light Sleep': 'Guitar'
    },
    'quiz4_answer': '6:00 A.M.',
    'quiz5': {
        'q1': 'Deeper light Sleep',
        'q2': 'Meditation',
        'q3': 'REM Sleep'
    }
}

@app.route('/quiz_results', methods=['POST', 'GET'])
def quiz_results():
    if request.method == 'POST':
        data = request.get_json()

        quiz1_answer = data.get('quiz1_answer', [])
        quiz2_helps = data.get('quiz2_helps', [])
        quiz2_hurts = data.get('quiz2_hurts', [])
        quiz3_matches = data.get('quiz3_matches', {})
        quiz4_answer = data.get('quiz4_answer', '')
        quiz5_answers = data.get('quiz5_answers', {})

        quiz1_correct = quiz1_answer == correct_answers['quiz1_sequence']
        quiz2_correct = (
            set(quiz2_helps) == set(correct_answers['quiz2_helps']) and
            set(quiz2_hurts) == set(correct_answers['quiz2_hurts'])
        )
        quiz3_correct = dict(sorted(quiz3_matches.items())) == dict(sorted(correct_answers['quiz3_matches'].items()))
        quiz4_correct = quiz4_answer == correct_answers['quiz4_answer']

        quiz5_score = sum(
            1 for key in correct_answers['quiz5']
            if quiz5_answers.get(key) == correct_answers['quiz5'][key]
        )

        total_score = round(int(quiz1_correct) + int(quiz2_correct) + int(quiz3_correct) + int(quiz4_correct) + (quiz5_score / 3), 1)

        return jsonify({
            'total_score': total_score,
            'quiz1_correct': quiz1_correct,
            'quiz2_correct': quiz2_correct,
            'quiz3_correct': quiz3_correct,
            'quiz4_correct': quiz4_correct,
            'quiz5_score': quiz5_score
        })

    return render_template('quiz_results.html', active_page="quiz", total_score=None)

if __name__ == '__main__':
    app.run(debug=True, port=5001)