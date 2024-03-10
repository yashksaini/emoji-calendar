import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
window.dbVersion = "1";
window.dbNewName = "emoji-calendar";

function setUpDatabase() {
  const dbVersion = window.dbVersion;
  const dbName = window.dbNewName;
  const request = indexedDB.open(dbName, dbVersion);
  //On Upgrade Needed
  request.onupgradeneeded = (e) => {
    const tempdb = e.target.result;

    // Create collection to store the morning and evening milk data for specific date
    const emojiStore = tempdb.createObjectStore("emojiStore", {
      keyPath: "id",
      autoIncrement: true,
    });
    emojiStore.createIndex("date", "date", { unique: true });
  };
  //On Success (Every time called if any success)
  request.onsuccess = (e) => {
    const tempdb = e.target.result;
    window.data_base = tempdb;
  };
  //On Error
  request.onerror = (e) => {
    console.log(`Error: ${e.target.error} was found `);
  };
}
setUpDatabase();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
