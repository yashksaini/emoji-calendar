import { useEffect, useState } from "react";
import "./App.css";
import Calendar from "./Calendar";
import EmojiSelect from "./EmojiSelect";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// App jsx files
function App() {
  const [selDate, setSelDate] = useState(new Date());
  const [savedemojis, setSavedemojis] = useState(
    JSON.parse(localStorage.getItem("savedemojis")) || []
  );
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);
  return (
    <>
      {!isLoading && (
        <div className="container">
          <Calendar
            selDate={selDate}
            setSelDate={setSelDate}
            savedemojis={savedemojis}
          />
          <EmojiSelect
            selDate={selDate}
            setSavedemojis={setSavedemojis}
            savedemojis={savedemojis}
          />
          <div className="top-bar">
            <img src="./emoji-calendar.png" />
            <p>Emoji Calendar</p>
          </div>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            limit={3}
            className="toastContainer"
            closeButton={false}
            hideProgressBar
          />
        </div>
      )}
      {isLoading && (
        <div className="loadingScreen">
          <div className="loading-content">
            <img src="./emoji-calendar.png" />
            <h1>Emoji Calendar</h1>
            <span className="loader"></span>
            <p>© 2024 Copyright :</p>
            <p>
              <a href="https://yashksaini.netlify.app/" target="_blank">
                Yash Kumar Saini
              </a>{" "}
              All rights reserved
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
