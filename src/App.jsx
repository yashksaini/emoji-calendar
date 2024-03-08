import { useState } from "react";
import "./App.css";
import Calendar from "./Calendar";
import EmojiSelect from "./EmojiSelect";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [selDate, setSelDate] = useState(new Date());
  return (
    <div className="container">
      <Calendar selDate={selDate} setSelDate={setSelDate} />
      <EmojiSelect selDate={selDate} />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={3}
        className="toastContainer"
        closeButton={false}
        hideProgressBar
      />
    </div>
  );
}

export default App;
