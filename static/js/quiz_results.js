// 动态收集 Quiz 答案并提交到服务器
document.addEventListener('DOMContentLoaded', function () {
    fetch('/quiz_results', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ submit: true })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server Response:", data);
        // 显示结果反馈
        document.getElementById('result-title').innerText = data.feedback.title;
        document.getElementById('result-message').innerText = data.feedback.message;
        document.getElementById('result-score').innerText = `Score: ${data.feedback.score}`;
    })
    .catch(error => {
        console.error('Error submitting quiz:', error);
    });
});