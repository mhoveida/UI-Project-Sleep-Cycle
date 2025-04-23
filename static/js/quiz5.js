document.addEventListener('DOMContentLoaded', function() {
    // 单选逻辑
    document.querySelectorAll('.options.single-choice').forEach(group => {
        group.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', () => {
                group.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    });

    // 拖拽逻辑
    const draggables = document.querySelectorAll('.draggable');
    const dropZone = document.querySelector('.drop-zone');

    draggables.forEach(item => {
        item.addEventListener('dragstart', () => {
            item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
    });

    dropZone.addEventListener('dragover', e => {
        e.preventDefault();
    });

    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        if (draggingItem) {
            const placeholder = dropZone.querySelector('.placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            dropZone.appendChild(draggingItem);
        }
    });

    // 提交处理
    document.querySelector('.button.next').addEventListener('click', function(e) {
        e.preventDefault();
        
        // 允许未选择也提交
        const q1Answer = document.querySelector('.question.q1 .option.selected');
        const q3Answer = document.querySelector('.question.q3 .option.selected');
        const q2Answers = [];
        dropZone.querySelectorAll('.draggable').forEach(item => {
            q2Answers.push(item.getAttribute('data-value'));
        });

        fetch('/submit_quiz5', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q1: q1Answer ? q1Answer.getAttribute('data-value') : null,
                q2: q2Answers,
                q3: q3Answer ? q3Answer.getAttribute('data-value') : null
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/quiz_results';
            } else {
                console.error("Submission failed.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});