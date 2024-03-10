/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { emojisData } from "./constants";
import { toast } from "react-toastify";

const Calendar = ({ setSelDate, selDate, savedemojis }) => {
  const [date, setDate] = useState(selDate);
  const today = new Date();
  const db = window.data_base;
  const [currEmoji, setCurrEmoji] = useState(0);
  const firstDayOfMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  ).getDay();
  const [calendarData, setCalendarData] = useState([]);

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth());

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };
  const addEmojiToDate = (date) => {
    let selectedDate = new Date(date).toISOString();
    const tx = db.transaction(["emojiStore"], "readwrite");
    const dataStore = tx.objectStore("emojiStore");
    const getRequest = dataStore.index("date").get(selectedDate);

    getRequest.onsuccess = (event) => {
      // Check for data already present or not
      const exitingData = event.target.result;
      if (exitingData) {
        exitingData.emoji = currEmoji;
        dataStore.put(exitingData);
      } else {
        const data = {
          date: selectedDate,
          emoji: currEmoji,
        };
        dataStore.add(data);
      }
    };
  };
  const getCompleteEmojiData = (db) => {
    let filledData = [];
    if (db) {
      const tx = db.transaction(["emojiStore"], "readonly");
      const mStore = tx.objectStore("emojiStore");
      const days = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();
      const start = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      ).toISOString();
      const end = new Date(
        date.getFullYear(),
        date.getMonth(),
        days
      ).toISOString();

      const range = IDBKeyRange.bound(start, end);
      const request = mStore.index("date").openCursor(range);
      request.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          filledData[cursor.value.date] = cursor.value;
          cursor.continue();
        }
        setCalendarData(drawCalendar(filledData));
      };
    }
  };
  useEffect(() => {
    const request = indexedDB.open("emoji-calendar", "1");
    request.onsuccess = (e) => {
      const db = e.target.result;
      getCompleteEmojiData(db);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const drawCalendar = (monthEmojiData) => {
    return [
      ...Array(firstDayOfMonth).fill(null),
      ...generateCalendarDays(),
    ].map((day, index) => {
      const currDate = new Date(date.getFullYear(), date.getMonth(), day);
      const selectedDate = currDate.toISOString();
      const emoji = emojisData.find((data) => {
        return data.id === monthEmojiData[selectedDate]?.emoji;
      });
      return (
        <div
          key={index}
          className={
            today?.getDate() === day &&
            today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear()
              ? "active day"
              : "day"
          }
          onClick={() => {
            if (day) {
              let newDate = new Date(date.getFullYear(), date.getMonth(), day);
              setSelDate(newDate);
              console.log(currEmoji, day, newDate);
              if (currEmoji === 0) {
                toast.error("Please select an emoji", {
                  toastId: "empty-emoji-error",
                });
              } else {
                addEmojiToDate(newDate);
              }
            }
          }}
        >
          <span className="date">{day}</span>
          {emoji?.icon && <span className="emoji-date">{emoji?.icon}</span>}
        </div>
      );
    });
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
        <div className="cal-emoji-list">
          {emojisData.map((emoji, index) => {
            if (savedemojis.indexOf(emoji.id) !== -1) {
              return (
                <div
                  key={index}
                  onClick={() => {
                    console.log(emoji);
                    setCurrEmoji(emoji.id);
                  }}
                  className={
                    currEmoji === emoji.id
                      ? "cal-emoji emoji-active"
                      : "cal-emoji"
                  }
                >
                  <span>{emoji.icon}</span>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
        <div className="days">{calendarData}</div>
      </div>
    </div>
  );
};

export default Calendar;
