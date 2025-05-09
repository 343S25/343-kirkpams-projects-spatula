import { EmojiButton } from 'https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.2/dist/index.min.js';

const taskForm = document.getElementById('taskForm');
const formSubmit = document.getElementById('save');
const addButton = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

const importButton = document.getElementById('import-btn');
const exportButton = document.getElementById('export-btn');

const currTasks = localStorage.getItem('tasks');

function addTask() {
    let currLen = document.querySelectorAll('.task-entry').length + 1;

    const template = document.getElementById('taskField').content.cloneNode(true);
    // let temp = template.cloneNode(true);
    let label = template.querySelector('label');
    let input = template.querySelector('input');
    let emojiBtn = template.querySelector('.emoji-trigger');
    let deleteBtn = template.querySelector('.btn-delete');

    label.textContent += " " + currLen;
    input.id += currLen;
    // console.log(i - 1);
    // console.log(tasksArray[i-1].task);
    try {
        input.value = tasksArray[currLen].task;
        emojiBtn.textContent = tasksArray[currLen].emoji || '⭐';
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
        taskList.removeChild(taskList.children[currLen - 1]);
        saveData();
        location.reload();
    });

    taskList.appendChild(template);
}

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

function exportTasks() {
    saveData();
    let item = { "tasks": JSON.parse(localStorage.getItem("tasks")) };
    item = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(item));

    let dl = document.createElement("a");
    dl.href = item;
    dl.download = "spatula-export.json";

    dl.click();
}

function importTasks() {
    let file = importButton.files[0];

    const fileReader = new FileReader();
    fileReader.addEventListener('load', (e) => {
        let result = JSON.parse(e.target.result).tasks;
        localStorage.setItem('tasks', JSON.stringify(result));
        location.reload();
    });
    fileReader.readAsText(file);
}

// stuff from transportodon ends

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
            taskList.removeChild(taskList.children[i - 1]);
            saveData();
            location.reload();
        });

        taskList.appendChild(template);
    }
} else {
    const template = document.getElementById('taskField').content.cloneNode(true);
    let label = template.querySelector('label');
    let input = template.querySelector('input');
    let emojiBtn = template.querySelector('.emoji-trigger');
    let deleteBtn = template.querySelector('.btn-delete');

    label.textContent += " 1"
    input.id += 1;
    emojiBtn.textContent = '⭐'
    const picker = new EmojiButton();

    picker.on('emoji', emoji => {
        emojiBtn.textContent = emoji.emoji;
    });

    emojiBtn.addEventListener('click', () => picker.togglePicker(emojiBtn));
    deleteBtn.addEventListener('click', () => {
        taskList.removeChild(taskList.children[i - 1]);
        saveData();
        location.reload();
    });

    taskList.appendChild(template);
}


formSubmit.addEventListener('click', saveData);
addButton.addEventListener('click', addTask);

importButton.addEventListener('input', importTasks);
exportButton.addEventListener('click', exportTasks);