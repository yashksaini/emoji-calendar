import { useState } from "react";
import "./App.css";
import Calendar from "./Calendar";
import EmojiSelect from "./EmojiSelect";

function App() {
  const [selDate, setSelDate] = useState(new Date());
  return (
    <div className="container">
      <Calendar selDate={selDate} setSelDate={setSelDate} />
      <EmojiSelect selDate={selDate} />
    </div>
  );
}

export default App;
