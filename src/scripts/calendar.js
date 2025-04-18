const month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month_lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const today = new Date();
const calendarTitle = document.getElementById("calendar-title");

function buildCalendar(date) {
    let base_month = date.getMonth();
    let base_day = date.getDay();

    // set month field to the correct month
    calendarTitle.textContent = month_names[base_month] + " " + date.getFullYear();

    let weeks = document.getElementById("calendar-boxes").getElementsByClassName("row");

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

            if (curr_date == today.getDate() && baseDate.getMonth() == today.getMonth() && baseDate.getFullYear() == today.getFullYear()) {
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

let baseDate = new Date(today.getFullYear(), today.getMonth(), 1);

const leftButton = document.getElementById("calendar-button-left");
const rightButton = document.getElementById("calendar-button-right");

leftButton.addEventListener("click", function () {
    baseDate.setMonth(baseDate.getMonth() - 1);
    buildCalendar(baseDate);
});

rightButton.addEventListener("click", function () {
    baseDate.setMonth(baseDate.getMonth() + 1);
    buildCalendar(baseDate);
});

buildCalendar(baseDate);