document.addEventListener('DOMContentLoaded', function () {
    // Define quiz names and icons
    const quizInfo = {
        '1': { name: 'Quiz 1: Sleep Cycle Sequence'},
        '2': { name: 'Quiz 2: Sleep Disruptor Effects'},
        '3': { name: 'Quiz 3: Match Scenarios to Sleep Stages'},
        '4': { name: 'Quiz 4: Best Wake-up Time'},
        '5': { name: 'Quiz 5: Short Questions'}
    };

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
                const resultTitle = document.getElementById('result-title');
                resultTitle.innerText = isPerfectScore 
                    ? "Perfect Score!" 
                    : data.feedback.title;
                
                // Add animation class for perfect score
                if (isPerfectScore) {
                    resultTitle.classList.add('perfect');
                }
                
                // Set message based on score
                document.getElementById('result-message').innerText = isPerfectScore 
                    ? "Congratulations! You understand all sleep concepts perfectly!" 
                    : data.feedback.message;
                
                document.getElementById('result-score').innerText = `Score: ${data.feedback.score}`;
                
                // Create overall stats container
                const statsContainer = document.createElement('div');
                statsContainer.className = 'overall-stats';
                
                // Total score stat box
                const totalScoreBox = document.createElement('div');
                totalScoreBox.className = 'stat-box';
                totalScoreBox.innerHTML = `
                    <p class="label">Total Score</p>
                    <p class="value">${data.total_score}/${data.max_score}</p>
                `;
                statsContainer.appendChild(totalScoreBox);
                
                // Completed quizzes stat box
                if (data.completed_questions) {
                    const completedBox = document.createElement('div');
                    completedBox.className = 'stat-box';
                    completedBox.innerHTML = `
                        <p class="label">Questions Completed</p>
                        <p class="value">${data.completed_questions}/${data.max_score}</p>
                    `;
                    statsContainer.appendChild(completedBox);
                }
                
                // Calculate percentage
                const percentage = Math.round((data.total_score / data.max_score) * 100);
                const percentBox = document.createElement('div');
                percentBox.className = 'stat-box';
                percentBox.innerHTML = `
                    <p class="label">Performance</p>
                    <p class="value">${percentage}%</p>
                `;
                statsContainer.appendChild(percentBox);
                
                // Add stats to the page
                const resultContainer = document.querySelector('.result-container');
                const resultMessage = document.getElementById('result-message');
                resultContainer.insertBefore(statsContainer, resultMessage.nextSibling);
                
                // Add detailed breakdown if the element exists
                const scoreBreakdownElement = document.getElementById('score-breakdown');
                if (scoreBreakdownElement && data.quizGroups) {
                    let breakdownHTML = '<h3>Detailed Score Breakdown</h3>';
                    
                    // Create breakdown by quiz using the quizGroups data
                    for (const [quizNum, quizData] of Object.entries(data.quizGroups)) {
                        // Calculate score percentage for this quiz
                        const quizPercentage = Math.round((quizData.correct / quizData.total) * 100);
                        
                        // Add review link for each quiz
                        const reviewUrl = `/quiz_results/q${quizNum}`;
                        
                        // Add perfect quiz indicator
                        const isPerfectQuiz = quizData.correct === quizData.total;
                        const quizClass = isPerfectQuiz ? 'quiz-breakdown perfect' : 'quiz-breakdown';
                        
                        // Get quiz information
                        const quizName = quizInfo[quizNum] ? quizInfo[quizNum].name : `Quiz ${quizNum}`;                        
                        breakdownHTML += `
                            <div class="${quizClass}" data-quiz-number="${quizNum}">
                                <div class="quiz-breakdown-header">
                                    <h4>${quizName}</h4>
                                    <a href="${reviewUrl}" class="review-link">View Answers</a>
                                </div>
                                <div class="score-details">
                                    <span class="score-number">${quizData.correct}/${quizData.total}</span>
                                    <span class="questions-answered">(${quizData.answered} questions answered)</span>
                                    <span class="score-percentage">${quizPercentage}%</span>
                                    ${isPerfectQuiz ? '<span class="perfect-indicator">Perfect!</span>' : ''}
                                </div>
                                <div class="score-bar-container">
                                    <div class="score-bar" style="width: ${quizPercentage}%"></div>
                                </div>
                            </div>
                        `;
                    }
                    
                    scoreBreakdownElement.innerHTML = breakdownHTML;
                    
                    // Add animation to score bars after they're added to the DOM
                    setTimeout(() => {
                        const scoreBars = document.querySelectorAll('.score-bar');
                        scoreBars.forEach(bar => {
                            const width = bar.style.width;
                            bar.style.width = '0%';
                            setTimeout(() => {
                                bar.style.width = width;
                            }, 100);
                        });
                    }, 500);
                }
                // Fall back to the old method if quizGroups isn't available
                else if (scoreBreakdownElement && data.questions_details) {
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
                        
                        // Calculate score percentage for this quiz
                        const quizPercentage = Math.round((correctCount / totalQuestions) * 100);
                        
                        // Add review link for each quiz
                        const reviewUrl = `/quiz_results/q${quizNum}`;
                        
                        // Add perfect quiz indicator
                        const isPerfectQuiz = correctCount === totalQuestions;
                        const quizClass = isPerfectQuiz ? 'quiz-breakdown perfect' : 'quiz-breakdown';
                        
                        // Get quiz information
                        const quizName = quizInfo[quizNum] ? quizInfo[quizNum].name : `Quiz ${quizNum}`;                        
                        breakdownHTML += `
                            <div class="${quizClass}" data-quiz-number="${quizNum}">
                                <div class="quiz-breakdown-header">
                                    <h4>${quizName}</h4>
                                    <a href="${reviewUrl}" class="review-link">View Answers</a>
                                </div>
                                <div class="score-details">
                                    <span class="score-number">${correctCount}/${totalQuestions}</span>
                                    <span class="score-percentage">${quizPercentage}%</span>
                                    ${isPerfectQuiz ? '<span class="perfect-indicator">Perfect!</span>' : ''}
                                </div>
                                <div class="score-bar-container">
                                    <div class="score-bar" style="width: ${quizPercentage}%"></div>
                                </div>
                            </div>
                        `;
                    }
                    
                    scoreBreakdownElement.innerHTML = breakdownHTML;
                    
                    // Add animation to score bars after they're added to the DOM
                    setTimeout(() => {
                        const scoreBars = document.querySelectorAll('.score-bar');
                        scoreBars.forEach(bar => {
                            const width = bar.style.width;
                            bar.style.width = '0%';
                            setTimeout(() => {
                                bar.style.width = width;
                            }, 100);
                        });
                    }, 500);
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