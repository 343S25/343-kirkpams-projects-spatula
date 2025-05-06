const taskForm = document.getElementById('taskForm');
const formSubmit = document.getElementById('save');
const saveDIV = document.getElementById('saveDIV');

if (localStorage.getItem('tasks')) {
    tasksArray = JSON.parse(localStorage.getItem('tasks'));
    // console.log(template);
    for (let i = 1; i < tasksArray.length + 2; i++) {
        const template = document.getElementById('taskField').content.cloneNode(true);
        // let temp = template.cloneNode(true);
        let label = template.querySelector('label');
        let input = template.querySelector('input');
        label.textContent += " " + i;
        input.id += i;
        console.log(i - 1);
        // console.log(tasksArray[i-1].task);
        try {
            input.value = tasksArray[i - 1].task;
        } catch (e) {
            // Do nothing
        }
        taskForm.appendChild(template);
    }
}
formSubmit.addEventListener('click', () => {
    const formData = new FormData(taskForm, formSubmit);
    const tasks = [];
    for (const [key, value] of formData) {
        if (value) 
            tasks.push({"task": value});
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
})