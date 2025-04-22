// 收集所有 Quiz 答案并提交到服务器
function submitAllQuizzes() {
    const quizData = {
        "quiz1_answer": ["Light Sleep", "Deeper Light Sleep", "Deep Sleep", "REM Sleep"],
        "quiz2_helps": ["Shower", "Meditation", "Reading"],
        "quiz2_hurts": ["Screen", "Stress", "Caffeine", "Alcohol", "Eating", "Irregular-schedule", "Exercising-late"],
        "quiz3_matches": {
            "Sufficient N3 Deep Sleep": "Sport",
            "Insufficient N3 Deep Sleep": "Sick",
            "Disrupted N3 Deep Sleep": "Recovery",
            "Complete REM Cycles": "Solve",
            "N2 Deeper Light Sleep": "Guitar"
        },
        "quiz4_answer": "6:00 A.M.",
        "quiz5_answers": {
            "q1": "Deeper light Sleep",
            "q2": "Meditation",
            "q3": "REM Sleep"
        }
    };

    fetch('/quiz_results', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server Response:", data);
        window.location.href = "/quiz_results";  // 跳转结果页面
    })
    .catch(error => {
        console.error('Error submitting quiz:', error);
    });
}

// 你可以在按钮上绑定这个函数，例如：<button onclick="submitAllQuizzes()">Submit All</button>