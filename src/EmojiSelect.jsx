/* eslint-disable react/prop-types */
import { Tooltip as ReactTooltip } from "react-tooltip";
import { emojisData } from "./constants";
import { useEffect, useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdAddReaction } from "react-icons/md";
import { toast } from "react-toastify";
const EmojiSelect = ({ selDate }) => {
  let storedEmojiContent;
  try {
    storedEmojiContent = JSON.parse(localStorage.getItem("emojiContent"));
    console.log(storedEmojiContent);
  } catch (error) {
    // If there's an error parsing JSON, log it and use an empty object
    console.error("Error parsing JSON from localStorage:", error);
    storedEmojiContent = {};
  }
  const [searchText, setSearchText] = useState("");
  const [screen, setScreen] = useState(1);
  const [savedemojis, setSavedemojis] = useState(
    JSON.parse(localStorage.getItem("savedemojis")) || []
  );
  const [filteredemojis, setFilteredemojis] = useState(emojisData);
  const [emojiContent, setEmojicontent] = useState(storedEmojiContent || {});

  useEffect(() => {
    const isEmojiContentEmpty = Object.keys(emojiContent).length === 0;
    if (isEmojiContentEmpty) {
      const initialContent = savedemojis.reduce((acc, emoji) => {
        acc[emoji] = "";
        return acc;
      }, {});
      setEmojicontent(initialContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filteremojis = () => {
      const data = emojisData.filter((emoji) =>
        emoji.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredemojis(data);
    };
    filteremojis();
  }, [savedemojis, searchText]);

  const handleSaveEmoji = (emoji) => {
    let selectedEmojiList =
      JSON.parse(localStorage.getItem("savedemojis")) || [];

    if (selectedEmojiList.indexOf(emoji.id) !== -1) {
      selectedEmojiList = selectedEmojiList.filter((id) => id !== emoji.id);
    } else {
      selectedEmojiList.push(emoji.id);
    }
    localStorage.setItem("savedemojis", JSON.stringify(selectedEmojiList));
    setSavedemojis(selectedEmojiList);
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
            <p>Selected emojis {savedemojis.length}</p>
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
          {filteredemojis.map((emoji, index) => {
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
                  {savedemojis.indexOf(emoji.id) !== -1 && (
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
            <button
              onClick={() => {
                localStorage.setItem(
                  "emojiContent",
                  JSON.stringify(emojiContent)
                );
                toast.success("Emojis Saved", { toastId: "save-content" });
              }}
            >
              Save <IoMdCheckmarkCircleOutline />
            </button>
            {savedemojis.length === 0 && (
              <div className="no-emoji">
                <p>No emojis added till now</p>
                <button
                  onClick={() => {
                    setScreen(2);
                  }}
                >
                  Add emojis <MdAddReaction />
                </button>
              </div>
            )}
          </div>
          {emojisData.map((emoji, index) => {
            if (savedemojis.indexOf(emoji.id) !== -1) {
              return (
                <div className="emoji-data" key={index}>
                  <span>{emoji.icon}</span>
                  <input
                    type="text"
                    placeholder="Add text.."
                    value={emojiContent[emoji.id]}
                    onChange={(e) => {
                      setEmojicontent((prev) => ({
                        ...prev,
                        [emoji.id]: e.target.value,
                      }));
                    }}
                  />
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
