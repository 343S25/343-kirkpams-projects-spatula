import { EmojiButton } from 'https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.2/dist/index.min.js';

const taskForm = document.getElementById('taskForm');
const formSubmit = document.getElementById('save');
const saveDIV = document.getElementById('saveDIV');

const currTasks = localStorage.getItem('tasks');

function saveData(e) {
    const formData = new FormData(taskForm, formSubmit);
    const emojiButtons = taskForm.querySelectorAll('.emoji-trigger');
    const tasks = [];

    let index = 0;
    let dates;
    for (const [key, value] of formData) {
        if (value) {
            dates = [];
            if (currTasks) {
                let old = JSON.parse(currTasks);
                for (let idx in old) {
                    if (old[idx].task == value || idx == index) {
                        dates = old[idx].completedDates;
                    }
                }
            }
            tasks.push({
                task: value,
                emoji: emojiButtons[index]?.textContent.trim() || '⭐',
                completedDates: dates
            });

        }
        index++;
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));

}

// If there's at least one item previously saved
if (currTasks) {
    let tasksArray = JSON.parse(localStorage.getItem('tasks'));
    // console.log(template);
    // Build task form
    for (let i = 1; i < tasksArray.length + 2; i++) {
        const template = document.getElementById('taskField').content.cloneNode(true);
        // let temp = template.cloneNode(true);
        let label = template.querySelector('label');
        let input = template.querySelector('input');
        let emojiBtn = template.querySelector('.emoji-trigger');
        let deleteBtn = template.querySelector('.btn-delete');

        label.textContent += " " + i;
        input.id += i;
        // console.log(i - 1);
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
        deleteBtn.addEventListener('click', () => {
            taskForm.removeChild(taskForm.children[i + 1]);
            saveData();
            location.reload();
        });

        taskForm.appendChild(template);
    }
} else {
    const template = document.getElementById('taskField').content.cloneNode(true);
    let label = template.querySelector('label');
    let input = template.querySelector('input');
    let emojiBtn = template.querySelector('.emoji-trigger');

    label.textContent += " 1"
    input.id += 1;
    emojiBtn.textContent = '⭐'
    const picker = new EmojiButton();

    picker.on('emoji', emoji => {
        emojiBtn.textContent = emoji.emoji;
    });

    emojiBtn.addEventListener('click', () => picker.togglePicker(emojiBtn));
    deleteBtn.addEventListener('click', () => {
        taskForm.removeChild(taskForm.children[i + 1]);
        saveData();
        location.reload();
    });

    taskForm.appendChild(template);
}


formSubmit.addEventListener('click', saveData);