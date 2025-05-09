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
                // Check if the user got a perfect score
                const isPerfectScore = data.total_score === data.max_score;
                
                // Set title based on score
                document.getElementById('result-title').innerText = isPerfectScore 
                    ? "Perfect Score!" 
                    : data.feedback.title;
                
                // Set message based on score
                document.getElementById('result-message').innerText = isPerfectScore 
                    ? "Congratulations! You understand all sleep concepts perfectly!" 
                    : data.feedback.message;
                
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
                        // For quiz 5, ensure we count only unique question numbers
                        const uniqueQuestions = new Set();
                        questions.forEach(q => {
                            // Extract the base question number (before any dash)
                            const baseQuestion = String(q.question).split('-')[0];
                            uniqueQuestions.add(baseQuestion);
                        });
                        
                        // Count correctly answered questions
                        const correctQuestions = new Set();
                        questions.filter(q => q.correct).forEach(q => {
                            const baseQuestion = String(q.question).split('-')[0];
                            correctQuestions.add(baseQuestion);
                        });
                        
                        const correctCount = correctQuestions.size;
                        
                        // Special handling for Quiz 5 to always show 3 total questions
                        let totalQuestions = uniqueQuestions.size;
                        if (quizNum === '5') {
                            totalQuestions = 3; // Force Quiz 5 to always show 3 total questions
                        }
                        
                        // Add review link for each quiz
                        const reviewUrl = `/quiz_results/q${quizNum}`;
                        
                        // Add perfect quiz indicator
                        const isPerfectQuiz = correctCount === totalQuestions;
                        const quizClass = isPerfectQuiz ? 'quiz-breakdown perfect' : 'quiz-breakdown';
                        
                        breakdownHTML += `
                            <div class="${quizClass}">
                                <div class="quiz-breakdown-header">
                                    <h4>Quiz ${quizNum}</h4>
                                    <a href="${reviewUrl}" class="review-link">View Answers</a>
                                </div>
                                <p>Score: ${correctCount}/${totalQuestions} ${isPerfectQuiz ? '✓' : ''}</p>
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