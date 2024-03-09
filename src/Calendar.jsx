/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
const Calendar = ({ setSelDate, selDate }) => {
  const [date, setDate] = useState(selDate);
  // Function used for going back months
  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };
 // Function used for going forward months
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
          <div>
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
            }).format(date)}
          </div>
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
                selDate?.getDate() === day &&
                selDate.getMonth() === date.getMonth() &&
                selDate.getFullYear() === date.getFullYear()
                  ? "active day"
                  : "day"
              }
              onClick={() => {
                if (day) {
                  let newDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    day
                  );
                  setSelDate(newDate);
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
