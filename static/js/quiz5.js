document.addEventListener('DOMContentLoaded', function() {
    // Single choice logic
    document.querySelectorAll('.options.single-choice').forEach(group => {
        const questionId = group.getAttribute('data-question');
        group.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', () => {
                group.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    });

    // Drag Logic
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

    // Submit handler
    document.querySelector('.button.next').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the first question answer (single choice)
        const q1Answer = document.querySelector('.single-choice[data-question="q1"] .option.selected');
        
        // Get the third question answer (single choice)
        const q3Answer = document.querySelector('.single-choice[data-question="q3"] .option.selected');
        
        // Get the dragged items for question 2
        const dropZone = document.querySelector('.drop-zone');
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