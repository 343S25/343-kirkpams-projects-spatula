const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

let currentDate = new Date();
const weeks = document.getElementById("calendar-boxes").getElementsByClassName("row");

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
        let days = weeks[currWeek].getElementsByClassName("calendar-day");
        days[currDay].textContent = monthLengths[(baseMonth + 11) % 12] + (currDay - baseDay) + 1;
        days[currDay].classList = "col calendar-day other-month";
        currDay++;
    }

    // this fills in the days of the current month
    while (currDate < monthLengths[baseMonth]) {
        let days = weeks[currWeek].getElementsByClassName("calendar-day");

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
        let days = weeks[currWeek].getElementsByClassName("calendar-day");

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

let baseDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

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