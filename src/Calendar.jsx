/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { emojisData } from "./constants";
import { toast } from "react-toastify";
import SavedEmojes from "./SavedEmojes";

const Calendar = ({ setSelDate, selDate, savedemojis }) => {
  const db = window.data_base;
  const [currEmoji, setCurrEmoji] = useState(0);
  const [date, setDate] = useState(selDate);
  const today = new Date();
  const firstDayOfMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  ).getDay();
  const [monthEmojiData, setMonthEmojiData] = useState([]);

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth());

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };
  const addEmojiToDate = async (date) => {
    const currentEmojiValue = currEmoji;
    let selectedDate = new Date(date).toISOString();
    const tx = db.transaction(["emojiStore"], "readwrite");
    const dataStore = tx.objectStore("emojiStore");

    console.log(selectedDate);
    const getRequest = dataStore.index("date").get(selectedDate);

    getRequest.onsuccess = async (event) => {
      // Check for data already present or not
      const existingData = event.target.result;

      console.log("CURR VALUE", currentEmojiValue);
      if (existingData) {
        existingData.emoji = currentEmojiValue;
        await dataStore.put(existingData);
        getInitialData();
      } else if (!existingData) {
        const data = {
          date: selectedDate,
          emoji: currentEmojiValue,
        };
        await dataStore.add(data);
        getInitialData();
      }
    };
    getRequest.onerror = (error) => {
      console.log(error);
    };
  };
  useEffect(() => {
    // Any side effects related to currEmoji can be performed here
    console.log("Current Emoji:", currEmoji);
  }, [currEmoji]);

  const getCompleteEmojiData = async (db) => {
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

      return new Promise((resolve, reject) => {
        const request = mStore.index("date").openCursor(range);

        request.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            filledData[cursor.value.date] = cursor.value;
            cursor.continue();
          } else {
            resolve(filledData);
          }
        };

        request.onerror = (error) => {
          reject(error);
        };
      });
    }
  };
  useEffect(() => {
    getInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const getInitialData = () => {
    const request = indexedDB.open("emoji-calendar", "1");
    request.onsuccess = async (e) => {
      const db = e.target.result;
      if (db) {
        const data = await getCompleteEmojiData(db);
        setMonthEmojiData(data);
      }
    };
  };

  const handleAddEmoji = (day) => {
    let newDate = new Date(date.getFullYear(), date.getMonth(), day);
    setSelDate(newDate);
    console.log(currEmoji);
    if (currEmoji === 0) {
      toast.error("Please select an emoji", {
        toastId: "empty-emoji-error",
      });
    } else {
      addEmojiToDate(newDate);
      getInitialData();
    }
  };

  const saveCurrEmoji = (emoji_id) => {
    setCurrEmoji(emoji_id);
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
          <SavedEmojes
            savedemojis={savedemojis}
            currEmoji={currEmoji}
            saveCurrEmoji={saveCurrEmoji}
          />
        </div>
        <div className="days">
          {[
            ...Array(firstDayOfMonth).fill(null),
            ...generateCalendarDays(),
          ].map((day, index) => {
            const currDate = new Date(date.getFullYear(), date.getMonth(), day);
            const selectedDate = currDate.toISOString();
            let emoji = null;
            if (monthEmojiData[selectedDate]) {
              emoji = emojisData[monthEmojiData[selectedDate].emoji - 1];
            }
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
                  handleAddEmoji(day);
                }}
              >
                <span className="date">{day}</span>
                {emoji?.icon && (
                  <span className="emoji-date">{emoji?.icon}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
