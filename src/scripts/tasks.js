import { EmojiButton } from 'https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.2/dist/index.min.js';

const taskForm = document.getElementById('taskForm');
const formSubmit = document.getElementById('save');
const saveDIV = document.getElementById('saveDIV');

if (localStorage.getItem('tasks')) {
    let tasksArray = JSON.parse(localStorage.getItem('tasks'));
    // console.log(template);
    // Build task form
    for (let i = 1; i < tasksArray.length + 2; i++) {
        const template = document.getElementById('taskField').content.cloneNode(true);
        // let temp = template.cloneNode(true);
        let label = template.querySelector('label');
        let input = template.querySelector('input');
        let emojiBtn = template.querySelector('.emoji-trigger');

        label.textContent += " " + i;
        input.id += i;
        console.log(i - 1);
        // console.log(tasksArray[i-1].task);
        try {
            input.value = tasksArray[i - 1].task;
            emojiBtn.textContent = tasksArray[i - 1].emoji || '⭐';
        } catch (e) {
            emojiBtn.textContent = '⭐'
        }

        // Attach emoji picker and trigger to current input
        const picker = new EmojiButton();
        picker.on('emoji', emoji => {
            emojiBtn.textContent = emoji.emoji;
        });

        emojiBtn.addEventListener('click', () => picker.togglePicker(emojiBtn));

        taskForm.appendChild(template);
    }
}
formSubmit.addEventListener('click', () => {
    
    const formData = new FormData(taskForm, formSubmit);
    const emojiButtons = taskForm.querySelectorAll('.emoji-trigger');
    const tasks = [];
    
    let index = 0;
    for (const [key, value] of formData) {
        if (value) {
            tasks.push({
                task: value,
                emoji: emojiButtons[index]?.textContent.trim() || '⭐'
            });

        }
        index++;
    }
    

    localStorage.setItem('tasks', JSON.stringify(tasks));
})