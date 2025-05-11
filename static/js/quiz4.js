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
        const answer = selectedOption ? selectedOption.getAttribute('data-answer') : null;

        // Submit the answer, even if it's null (user skipped)
        fetch('/submit_quiz4', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answer: answer })
        })
        .then(response => response.json())
        .then(data => {
            // Always continue to next quiz
            window.location.href = '/quiz5';
        })
        .catch(error => {
            console.error("Error:", error);
            window.location.href = '/quiz5';  // Continue even if there's a fetch error
        });
    });

});