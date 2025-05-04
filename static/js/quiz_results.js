document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('result-title')) {
        fetch('/quiz_results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ show_partial_results: true })
        })
        .then(response => response.json())
        .then(data => {
            if (data.feedback) {
                document.getElementById('result-title').innerText = data.feedback.title;
                document.getElementById('result-message').innerText = data.feedback.message;
                document.getElementById('result-score').innerText = `Score: ${data.feedback.score}`;
                
                const totalScoreElement = document.getElementById('total-score');
                if (totalScoreElement) {
                    totalScoreElement.innerText = `Total Score: ${data.total_score}/${data.max_score}`;
                }
                
                const completedElement = document.getElementById('completed-quizzes');
                if (completedElement) {
                    completedElement.innerText = `Completed: ${data.completed_questions || 0} / ${data.max_score}`;
                }
                
                // Add detailed breakdown if the element exists
                const scoreBreakdownElement = document.getElementById('score-breakdown');
                if (scoreBreakdownElement && data.questions_details) {
                    // Group questions by quiz
                    const quizGroups = {};
                    data.questions_details.forEach(detail => {
                        if (!quizGroups[detail.quiz]) {
                            quizGroups[detail.quiz] = [];
                        }
                        quizGroups[detail.quiz].push(detail);
                    });
                    
                    let breakdownHTML = '<h3>Detailed Score Breakdown</h3>';
                    
                    // Create breakdown by quiz
                    for (const [quizNum, questions] of Object.entries(quizGroups)) {
                        const correctCount = questions.filter(q => q.correct).length;
                        const totalQuestions = questions.length;
                        
                        breakdownHTML += `
                            <div class="quiz-breakdown">
                                <h4>Quiz ${quizNum}</h4>
                                <p>Score: ${correctCount}/${totalQuestions}</p>
                            </div>
                        `;
                    }
                    
                    scoreBreakdownElement.innerHTML = breakdownHTML;
                }
            } else {
                document.getElementById('result-title').innerText = "Score Calculation";
                document.getElementById('result-message').innerText = "Here is your score.";
                document.getElementById('result-score').innerText = `Score: ${data.total_score}/${data.max_score}`;
            }
        })
        .catch(error => {
            console.error('Error submitting quiz:', error);
            document.getElementById('result-title').innerText = "Error";
            document.getElementById('result-message').innerText = "An error occurred while loading results.";
        });
    }
});