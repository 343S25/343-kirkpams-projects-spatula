const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

let currentDate = new Date();
const monthBoxes = document.getElementById("calendar-boxes").getElementsByClassName("row");
const weekBoxes = document.getElementById("weekly-calendar-boxes").getElementsByClassName("row");

let baseDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

const mobileLayout = document.getElementById("mobile-layout");
const desktopLayout = document.getElementById("desktop-layout");

const taskList = document.getElementById("tasks-list");
let taskArray = localStorage.getItem("tasks");

function isLeapYear(year) {
    return (year % 4 == 0) && ((year % 400 == 0) || (year % 100 != 0));
}

function buildCalendar(date) {
    let baseMonth = date.getMonth();
    let baseDay = date.getDay();

    let currDate = 1;
    let currWeek = 1;
    let currDay = 0;

    // this fills in the days before the start of the month by starting on Sunday and going until it hits the first day of the month
    while (currDay < date.getDay()) {
        let days = monthBoxes[currWeek].getElementsByClassName("calendar-day");
        days[currDay].setAttribute("date-string",
            ((baseMonth + 11) % 12 + 1) + "/" +
            (monthLengths[(baseMonth + 11) % 12] + (currDay - baseDay) + 1) + "/" +
            (baseMonth == 0 ? date.getFullYear() - 1 : date.getFullYear())
        );

        days[currDay].children[0].textContent = monthLengths[(baseMonth + 11) % 12] + (currDay - baseDay) + 1;
        days[currDay].classList = "col calendar-day other-month last-month";
        currDay++;
    }

    // this fills in the days of the current month
    while (currDate < monthLengths[baseMonth]) {
        let days = monthBoxes[currWeek].getElementsByClassName("calendar-day");

        // inner loop handles each individual
        while (currDay < 7 && currDate <= monthLengths[baseMonth]) {
            days[currDay].setAttribute("date-string",
                (baseMonth + 1) + "/" +
                currDate + "/" +
                date.getFullYear()
            );

            days[currDay].children[0].textContent = currDate;
            days[currDay].classList = "col calendar-day curr-month";

            if (days[currDay].getAttribute("date-string") == currentDate.toLocaleDateString())  {
                days[currDay].classList.add("curr-day");
            }
            currDate++;
            currDay++;
        }

        if (currDay == 7) {
            currWeek++;
            currDay = 0;
        }
    }

    // this fills in the days after the end of the current month. pretty similar to the last one as it just goes until there aren't any more weeks
    currDate = 1;
    while (currWeek <= 6) {
        let days = monthBoxes[currWeek].getElementsByClassName("calendar-day");

        while (currDay < 7 && currWeek <= 6) {
            days[currDay].setAttribute("date-string",
                ((baseMonth + 13) % 12 + 1) + "/" +
                currDate + "/" +
                (baseMonth == 11 ? date.getFullYear() + 1 : date.getFullYear())
            );

            days[currDay].children[0].textContent = currDate;
            days[currDay].classList = "col calendar-day other-month next-month";
            currDate++;
            currDay++;
        }

        currWeek++;
        currDay = 0;

    }

    let tasks = JSON.parse(taskArray);

    currDate = 1;
    currWeek = 1;
    while (currWeek <= 6)   {
        let days = monthBoxes[currWeek].getElementsByClassName("calendar-day");
        while (currDay < 7 && currWeek <= 6)    {

            for (let item of tasks) {
                if (item.completedDates.includes(days[currDay].getAttribute("date-string")))    {
                    days[currDay].children[1].textContent += item.emoji;
                }
            }

            currDate++;
            currDay++;
        }

        currWeek++;
        currDay = 0;
    }
}

function buildMobileCalendar(date)  {
    let baseMonth = date.getMonth();
    let baseDay = date.getDay();

    let currDate = date.getDate() - baseDay;
    let currWeek = 1;
    let currDay = 0;

    // this fills in any possible days before the start of the month by starting on Sunday and going until it hits the first day of the month
    while ((currDate - baseDay) < -2)   {
        weekBoxes[currDay].childNodes[3].classList = "col calendar-day other-month";

        weekBoxes[currDay].childNodes[3].setAttribute("date-string",
            ((baseMonth + 11) % 12 + 1) + "/" +
            (monthLengths[(baseMonth + 11) % 12] + (currDay - baseDay) + 1) + "/" +
            (baseMonth == 0 ? date.getFullYear() - 1 : date.getFullYear())
        );

        weekBoxes[currDay].childNodes[3].children[0].textContent = monthLengths[(baseMonth + 11) % 12] + (currDay - baseDay) + 1;
        currDate++;
        currDay++;
    }

    // this fills in the days of the current month
    while (currDate <= monthLengths[baseMonth] && currDay < 7) {
        weekBoxes[currDay].childNodes[3].classList = "col calendar-day curr-month";
        weekBoxes[currDay].childNodes[3].setAttribute("date-string",
            (baseMonth + 1) + "/" +
            currDate + "/" +
            date.getFullYear()
        );

        weekBoxes[currDay].childNodes[3].children[0].textContent = currDate;

        if (weekBoxes[currDay].childNodes[3].getAttribute("date-string") == currentDate.toLocaleDateString())  {
            weekBoxes[currDay].childNodes[3].classList.add("curr-day");
        }
        
        currDate++;
        currDay++;
    }

    // this fills in any possible days after the end of the month
    currDate = 1;
    while (currDay < 7) {
        weekBoxes[currDay].childNodes[3].classList = "col calendar-day other-month";
        weekBoxes[currDay].childNodes[3].setAttribute("date-string",
            ((baseMonth + 13) % 12 + 1) + "/" +
            currDate + "/" +
            (baseMonth == 11 ? date.getFullYear() + 1 : date.getFullYear())
        );

        weekBoxes[currDay].childNodes[3].children[0].textContent = currDate;
        currDate++;
        currDay++;
    }

    let tasks = JSON.parse(taskArray);

    currDate = date.getDate() - baseDay;
    currDay = 0;
    while (currDay < 7) {
        for (let item of tasks) {
            if (item.completedDates.includes(weekBoxes[currDay].childNodes[3].getAttribute("date-string"))) {
                weekBoxes[currDay].childNodes[3].children[1].textContent += item.emoji
            }
        }

        currDay++;
    }
}

function swapView() {
    if (desktopLayout.style.display == "none")  {
        desktopLayout.style.display = "block";
        mobileLayout.style.display = "none";
        localStorage.setItem("defaultView", 0);
    } else {
        desktopLayout.style.display = "none";
        mobileLayout.style.display = "block";
        localStorage.setItem("defaultView", 1);
    }
}

function markTask(e) {
    let tasks = JSON.parse(taskArray);
    let today = document.querySelectorAll("[date-string='" + currentDate.toLocaleDateString() + "']");
    let myContents = this.textContent.split(" ");
    myContents = [myContents[0], this.textContent.slice(myContents[0].length + 1)];
    // TIL that some emojis are two characters long and some are three!
    for (let item of tasks) {
        if (item.task == myContents[1] && item.emoji == myContents[0])   {
            if (this.classList.contains("finished"))    {
                this.classList.remove("finished");
                today.forEach((day) => day.children[1].textContent = day.children[1].textContent.replace(myContents[0], ""));
                item.completedDates.splice(item.completedDates.indexOf(currentDate.toLocaleDateString()));
            } else {
                this.classList.add("finished");
                today.forEach((day) => day.children[1].textContent += item.emoji);
                item.completedDates.push(currentDate.toLocaleDateString());
            }
        }
    }


    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function populateTasksList()    {
    if (taskArray == null)  {
        return
    }
    let tasks = JSON.parse(taskArray);
    let listItem;
    for (let idx in tasks)   {
        listItem = document.createElement("li");
        listItem.textContent = tasks[idx].emoji + " " + tasks[idx].task;
        if (tasks[idx].completedDates.includes(currentDate.toLocaleDateString()))  {
            listItem.classList.add("finished");
        }
        listItem.addEventListener('click', markTask);
        taskList.appendChild(listItem);
    }
}

const swapViewButton = document.getElementById("view-toggle");
swapViewButton.addEventListener('click', swapView);

const leftButton = document.getElementById("calendar-button-left");
const rightButton = document.getElementById("calendar-button-right");
const jumpButton = document.getElementById("date-submit");

const defaultDateSelect = document.getElementById("date-input-default");
const fallbackDateSelect = document.getElementById("date-input-fallback");

// by default, hide fallback date selector
fallbackDateSelect.style.display = "none";

// attempt to create a month input to figure out if the current browser supports it
const test = document.createElement("input");
try {
    test.type = "month";
} catch (e) { }

if (test.type === "text") {
    defaultDateSelect.style.display = "none";
    fallbackDateSelect.style.display = "block";
}

leftButton.addEventListener("click", function () {
    baseDate.setMonth(baseDate.getMonth() - 1);
    defaultDateSelect.value = baseDate.toISOString().substring(0, 7);
    fallbackDateSelect.value = baseDate.toISOString().substring(0, 10);
    monthLengths[1] = isLeapYear(baseDate.getFullYear()) ? 29 : 28;
    buildCalendar(baseDate);
});

rightButton.addEventListener("click", function () {
    baseDate.setMonth(baseDate.getMonth() + 1);
    defaultDateSelect.value = baseDate.toISOString().substring(0, 7);
    fallbackDateSelect.value = baseDate.toISOString().substring(0, 10);
    monthLengths[1] = isLeapYear(baseDate.getFullYear()) ? 29 : 28;
    buildCalendar(baseDate);
});


jumpButton.addEventListener("click", function (event) {
    let target;
    if (test.type === "text") {
        target = fallbackDateSelect.value.split("-");
    } else {
        target = defaultDateSelect.value.split("-");
    }
    baseDate.setYear(parseInt(target[0]));
    baseDate.setMonth(parseInt(target[1]) - 1);
    monthLengths[1] = isLeapYear(baseDate.getFullYear()) ? 29 : 28;

    buildCalendar(baseDate);
    event.preventDefault();
});

defaultDateSelect.value = baseDate.toISOString().substring(0, 7);
fallbackDateSelect.value = currentDate.toISOString().substring(0, 10);

buildCalendar(baseDate);
buildMobileCalendar(currentDate);

if (localStorage.getItem("defaultView") == 0)   {
    desktopLayout.style.display = "block";
    mobileLayout.style.display = "none";
} else {
    desktopLayout.style.display = "none";
    mobileLayout.style.display = "block";
    localStorage.setItem("defaultView", 1);
}

populateTasksList();