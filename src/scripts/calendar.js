const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

let currentDate = new Date();
const monthBoxes = document.getElementById("calendar-boxes").getElementsByClassName("row");
const weekBoxes = document.getElementById("weekly-calendar-boxes").getElementsByClassName("row");

let baseDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

const mobileLayout = document.getElementById("mobile-layout");
const desktopLayout = document.getElementById("desktop-layout");
let view = window.location.search.substring(1);
if (view == "mobile")   {
    desktopLayout.style.display = "none";
    mobileLayout.style.display = "block";
} else if (view == "desktop")   {
    desktopLayout.style.display = "block";
    mobileLayout.style.display = "none";
}

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
        days[currDay].textContent = monthLengths[(baseMonth + 11) % 12] + (currDay - baseDay) + 1;
        days[currDay].classList = "col calendar-day other-month";
        currDay++;
    }

    // this fills in the days of the current month
    while (currDate < monthLengths[baseMonth]) {
        let days = monthBoxes[currWeek].getElementsByClassName("calendar-day");

        // inner loop handles each individual
        while (currDay < 7 && currDate <= monthLengths[baseMonth]) {
            days[currDay].textContent = currDate;
            days[currDay].classList = "col calendar-day curr-month";

            if (currDate == currentDate.getDate() && baseDate.getMonth() == currentDate.getMonth() && baseDate.getFullYear() == currentDate.getFullYear()) {
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
            days[currDay].textContent = currDate;
            days[currDay].classList = "col calendar-day other-month";
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
        weekBoxes[currDay].childNodes[3].textContent = monthLengths[(baseMonth + 11) % 12] + (currDay - baseDay) + 2;
        currDate++;
        currDay++;
    }

    // this fills in the days of the current month
    while (currDate <= monthLengths[baseMonth] && currDay < 7) {
        weekBoxes[currDay].childNodes[3].classList = "col calendar-day curr-month";
        weekBoxes[currDay].childNodes[3].textContent = currDate;
        if (currDate == currentDate.getDate() && baseDate.getMonth() == currentDate.getMonth() && baseDate.getFullYear() == currentDate.getFullYear()) {
            weekBoxes[currDay].childNodes[3].classList.add("curr-day");
        }
        currDate++;
        currDay++;
    }

    // this fills in any possible days after the end of the month
    currDate = 1;
    while (currDay < 7) {
        weekBoxes[currDay].childNodes[3].classList = "col calendar-day other-month";
        weekBoxes[currDay].childNodes[3].textContent = currDate;
        currDate++;
        currDay++;
    }
}

const desktopCalendar = document.getElementById("desktop-layout");
const mobileCalendar = document.getElementById("mobile-layout");

function swapView() {
    if (desktopCalendar.style.display == "none")  {
        desktopCalendar.style.display = "block";
        mobileCalendar.style.display = "none";
        localStorage.setItem("defaultView", 0);
    } else {
        desktopCalendar.style.display = "none";
        mobileCalendar.style.display = "block";
        localStorage.setItem("defaultView", 1);
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
    desktopCalendar.style.display = "block";
    mobileCalendar.style.display = "none";
} else {
    desktopCalendar.style.display = "none";
    mobileCalendar.style.display = "block";
    localStorage.setItem("defaultView", 1);
}