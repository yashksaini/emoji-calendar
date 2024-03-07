/* eslint-disable react/prop-types */
import { Tooltip as ReactTooltip } from "react-tooltip";
import { emojisData } from "./constants";
import { useEffect, useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
const EmojiSelect = ({ selDate }) => {
  const [searchText, setSearchText] = useState("");
  const [screen, setScreen] = useState(1);
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
        <div className="top-box">
          {screen === 1 && (
            <span
              onClick={() => {
                setScreen(2);
              }}
            >
              <MdFormatListBulletedAdd className="list-icon" />
            </span>
          )}
          {screen === 2 && (
            <span
              onClick={() => {
                setScreen(1);
              }}
            >
              <IoMdArrowBack />
            </span>
          )}

          <div>
            <h1>
              {new Intl.DateTimeFormat("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              }).format(selDate)}
            </h1>
            <p>Selected Emojies {savedEmojies.length}</p>
          </div>
        </div>

        {screen === 2 && (
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            placeholder="Search emoji.."
          />
        )}
      </div>
      {screen === 2 && (
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
      )}
      {screen === 1 && (
        <div className="emoji-list">
          <div className="save-data">
            <button>
              Save <IoMdCheckmarkCircleOutline />
            </button>
          </div>
          {emojisData.map((emoji, index) => {
            if (savedEmojies.indexOf(emoji.id) !== -1) {
              return (
                <div className="emoji-data" key={index}>
                  <span>{emoji.icon}</span>
                  <input type="text" placeholder="Write..." />
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      )}
    </div>
  );
};

export default EmojiSelect;
