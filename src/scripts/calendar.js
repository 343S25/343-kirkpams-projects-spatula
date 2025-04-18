const month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month_lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

let current_date = new Date();
const weeks = document.getElementById("calendar-boxes").getElementsByClassName("row");

function buildCalendar(date) {
    let base_month = date.getMonth();
    let base_day = date.getDay();

    let curr_date = 1;
    let curr_week = 1;
    let curr_day = 0;

    // this fills in the days before the start of the month by starting on Sunday and going until it hits the first day of the month
    while (curr_day < date.getDay()) {
        let days = weeks[curr_week].getElementsByClassName("calendar-day");
        days[curr_day].textContent = month_lengths[(base_month + 11) % 12] + (curr_day - base_day) + 1;
        days[curr_day].classList = "col calendar-day other-month";
        curr_day++;
    }

    // this fills in the days of the current month
    while (curr_date < month_lengths[base_month]) {
        let days = weeks[curr_week].getElementsByClassName("calendar-day");

        // inner loop handles each individual
        while (curr_day < 7 && curr_date <= month_lengths[base_month]) {
            days[curr_day].textContent = curr_date;
            days[curr_day].classList = "col calendar-day curr-month";

            if (curr_date == current_date.getDate() && baseDate.getMonth() == current_date.getMonth() && baseDate.getFullYear() == current_date.getFullYear()) {
                days[curr_day].classList.add("curr-day");
            }
            curr_date++;
            curr_day++;
        }

        if (curr_day == 7) {
            curr_week++;
            curr_day = 0;
        }
    }

    // this fills in the days after the end of the current month. pretty similar to the last one as it just goes until there aren't any more weeks
    curr_date = 1;
    while (curr_week <= 6) {
        let days = weeks[curr_week].getElementsByClassName("calendar-day");

        while (curr_day < 7 && curr_week <= 6) {
            days[curr_day].textContent = curr_date;
            days[curr_day].classList = "col calendar-day other-month";
            curr_date++;
            curr_day++;
        }

        curr_week++;
        curr_day = 0;

    }
}

let baseDate = new Date(current_date.getFullYear(), current_date.getMonth(), 1);

const leftButton = document.getElementById("calendar-button-left");
const rightButton = document.getElementById("calendar-button-right");
const jumpButton = document.getElementById("date-submit");
const dateSelect = document.getElementById("date-input");

leftButton.addEventListener("click", function () {
    baseDate.setMonth(baseDate.getMonth() - 1);
    dateSelect.value = baseDate.toISOString().substring(0, 7);
    buildCalendar(baseDate);
});

rightButton.addEventListener("click", function () {
    baseDate.setMonth(baseDate.getMonth() + 1);
    dateSelect.value = baseDate.toISOString().substring(0, 7);
    buildCalendar(baseDate);
});

jumpButton.addEventListener("click", function (event) {
    let target = dateSelect.value.split("-");
    baseDate.setYear(parseInt(target[0]));
    baseDate.setMonth(parseInt(target[1]) - 1);

    buildCalendar(baseDate);
    event.preventDefault();
});

dateSelect.value = baseDate.toISOString().substring(0, 7);

buildCalendar(baseDate);