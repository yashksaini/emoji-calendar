import { useState } from "react";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState(null);

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  ).getDay();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth());

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  return (
    <div className="calendar">
      <div className="header">
        <div className="arrows">
          <button onClick={handlePrevMonth}>
            <MdOutlineArrowBackIos />
          </button>
          <button onClick={handleNextMonth}>
            <MdOutlineArrowForwardIos />
          </button>
        </div>
        <div className="select-box">
          <div>{months[date.getMonth()]}</div>
          <div>{date.getFullYear()}</div>
        </div>
      </div>
      <div className="calendar-body">
        <div className="weekdays">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>
        <div className="days">
          {[
            ...Array(firstDayOfMonth).fill(null),
            ...generateCalendarDays(),
          ].map((day, index) => (
            <div
              key={index}
              className={
                new Date(selected) ===
                new Date(date.getFullYear(), date.getMonth(), day)
                  ? "active day"
                  : "day"
              }
              onClick={() => {
                if (day) {
                  console.log(day, months[date.getMonth()], date.getFullYear());
                  let newDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    day
                  );
                  console.log(selected, newDate);
                  setSelected(newDate);
                }
              }}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
