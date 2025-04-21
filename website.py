from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

# ROUTES

@app.route('/')
def home():
   return render_template('home.html')   

@app.route('/sleep_cycle')
def sleep_cycle():
   return render_template('sleep_cycle.html')   

@app.route('/sleep_disruptors')
def sleep_disruptors():
   return render_template('sleep_disruptors.html')   

@app.route('/calculator')
def calculator():
   return render_template('calculator.html')   

@app.route('/quiz_start')
def quiz_start():
   return render_template('quiz_start.html')   

@app.route('/quiz_question')
def quiz_question():
   return render_template('quiz_question.html')   


# AJAX FUNCTIONS
 


if __name__ == '__main__':
   app.run(debug = True, port=5001)




