document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });

    // 添加提交处理程序
    document.querySelector('.button.next').addEventListener('click', function(e) {
        e.preventDefault();

        const selectedOption = document.querySelector('.option.selected');
        if (!selectedOption) {
            alert("Please select an option before continuing.");
            return;
        }

        // 获取答案，首选data-answer属性，备选data-value属性或文本内容
        const answer = selectedOption.getAttribute('data-answer') || 
                       selectedOption.getAttribute('data-value') || 
                       selectedOption.querySelector('.time')?.textContent || 
                       selectedOption.textContent.trim();

        fetch('/submit_quiz4', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answer: answer })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/quiz5';
            } else {
                alert("Error submitting answer.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        });
    });
});