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
                    totalScoreElement.innerText = `Total Score: ${data.total_score}`;
                }
                const completedElement = document.getElementById('completed-quizzes');
                if (completedElement) {
                    completedElement.innerText = `Completed: ${data.completed_quizzes || '?'} / 5`;
                }
            } else {
                document.getElementById('result-title').innerText = "Score Calculation";
                document.getElementById('result-message').innerText = "Here is your score.";
                document.getElementById('result-score').innerText = `Score: ${data.total_score}`;
            }
        })
        .catch(error => {
            console.error('Error submitting quiz:', error);
            document.getElementById('result-title').innerText = "Error";
            document.getElementById('result-message').innerText = "An error occurred while loading results.";
        });
    }
});