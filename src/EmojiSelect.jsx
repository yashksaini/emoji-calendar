/* eslint-disable react/prop-types */
import { Tooltip as ReactTooltip } from "react-tooltip";
import { emojisData } from "./constants";
import { useEffect, useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";

const EmojiSelect = ({ selDate }) => {
  const [searchText, setSearchText] = useState("");
  const [savedEmojies, setSavedEmojies] = useState(
    JSON.parse(localStorage.getItem("savedEmojies")) || []
  );
  const [filteredEmojies, setFilteredEmojies] = useState(emojisData);

  useEffect(() => {
    const filterEmojies = () => {
      const data = emojisData.filter((emoji) =>
        emoji.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredEmojies(data);
    };
    filterEmojies();
  }, [savedEmojies, searchText]);

  const handleSaveEmoji = (emoji) => {
    let selectedEmojiList =
      JSON.parse(localStorage.getItem("savedEmojies")) || [];

    if (selectedEmojiList.indexOf(emoji.id) !== -1) {
      selectedEmojiList = selectedEmojiList.filter((id) => id !== emoji.id);
    } else {
      selectedEmojiList.push(emoji.id);
    }
    localStorage.setItem("savedEmojies", JSON.stringify(selectedEmojiList));
    setSavedEmojies(selectedEmojiList);
  };

  return (
    <div className="emoji-container">
      <div className="emoji-head">
        <h1>
          {new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          }).format(selDate)}
        </h1>
        <p>Select Emojies {savedEmojies.length}</p>
        <input
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          placeholder="Search emoji.."
        />
      </div>

      <div className="emoji-select">
        {filteredEmojies.map((emoji, index) => {
          return (
            <>
              <span
                key={index}
                data-tooltip-id={"tooltip-" + index}
                onClick={() => {
                  handleSaveEmoji(emoji);
                }}
              >
                {emoji.icon}
                {savedEmojies.indexOf(emoji.id) !== -1 && (
                  <IoIosCheckmarkCircle className="emoji-tick" />
                )}
              </span>{" "}
              <ReactTooltip
                id={"tooltip-" + index}
                place="bottom"
                content={emoji.name}
              />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default EmojiSelect;
