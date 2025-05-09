document.addEventListener('DOMContentLoaded', function() {
    // Single choice logic
    document.querySelectorAll('.options.single-choice').forEach(group => {
        const questionId = group.getAttribute('data-question');
        group.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', () => {
                group.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                console.log(`Selected option: ${option.textContent} in question ${group.dataset.question}`);
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
            // 确保不重复添加
            if (!dropZone.querySelector(`[data-value="${draggingItem.getAttribute('data-value')}"]`)) {
                const clone = draggingItem.cloneNode(true);
                dropZone.appendChild(clone);
                console.log(`Dropped item: ${clone.textContent} with value ${clone.getAttribute('data-value')}`);
                
                // 添加删除功能
                clone.addEventListener('click', () => {
                    clone.remove();
                    console.log(`Removed item: ${clone.textContent}`);
                    if (dropZone.querySelectorAll('.draggable').length === 0) {
                        const placeholder = dropZone.querySelector('.placeholder');
                        if (placeholder) {
                            placeholder.style.display = '';
                        }
                    }
                });
            }
        }
    });

    // Submit handler
    document.querySelector('.button.next').addEventListener('click', function(e) {
        e.preventDefault();
        
        // 获取问题1答案 (单选题)
        const q1Element = document.querySelector('.single-choice[data-question="q1"] .option.selected');
        let q1Value = q1Element ? q1Element.getAttribute('data-value') || q1Element.textContent.trim() : null;
        console.log(`Quiz 5 Q1 value: ${q1Value}`);
        
        // 获取问题2答案（多选拖拽题）
        const q2Answers = [];
        dropZone.querySelectorAll('.draggable').forEach(item => {
            const value = item.getAttribute('data-value') || item.textContent.trim();
            if (value) {
                q2Answers.push(value);
                console.log(`Quiz 5 Q2 item: ${value}`);
            }
        });
        
        // 获取问题3答案 (单选题)
        const q3Element = document.querySelector('.single-choice[data-question="q3"] .option.selected');
        let q3Value = q3Element ? q3Element.getAttribute('data-value') || q3Element.textContent.trim() : null;
        console.log(`Quiz 5 Q3 value: ${q3Value}`);

        console.log("Submitting Quiz 5 data:", { q1: q1Value, q2: q2Answers, q3: q3Value });

        fetch('/submit_quiz5', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q1: q1Value,
                q2: q2Answers,
                q3: q3Value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Quiz 5 submitted successfully");
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