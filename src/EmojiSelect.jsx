/* eslint-disable react/prop-types */
import { emojisData } from "./constants";
import { useEffect, useState } from "react";
import { IoMdArrowForward } from "react-icons/io";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdAddReaction } from "react-icons/md";
import { CgMenuRight } from "react-icons/cg";
import { toast } from "react-toastify";
import Emoji from "./components/Emoji";
const EmojiSelect = ({ savedemojis, setSavedemojis }) => {
  let storedEmojiContent;
  try {
    storedEmojiContent = JSON.parse(localStorage.getItem("emojiContent"));
  } catch (error) {
    console.error("Error parsing JSON from localStorage:", error);
    storedEmojiContent = {};
  }
  const [searchText, setSearchText] = useState("");
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [screen, setScreen] = useState(1); // For swiching screen between selected list and all emojis
  const [filteredemojis, setFilteredemojis] = useState(emojisData); // Filtered emoji data for searchText
  const [emojiContent, setEmojicontent] = useState(storedEmojiContent || {}); // Used for storing the text for an emoji

  useEffect(() => {
    const isEmojiContentEmpty = Object.keys(emojiContent).length === 0;
    if (isEmojiContentEmpty) {
      // Converting the object data to an array with key as emoji_id
      const initialContent = savedemojis.reduce((arr, emoji_id) => {
        arr[emoji_id] = "";
        return arr;
      }, {});
      setEmojicontent(initialContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Filter emoji based on search text
    const filteremojis = () => {
      const data = emojisData.filter((emoji) =>
        emoji.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredemojis(data);
    };
    filteremojis();
  }, [savedemojis, searchText]);
  //Save emoji to localstorage
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
  const saveData = () => {
    localStorage.setItem("emojiContent", JSON.stringify(emojiContent));
    toast.success("Saved Successfully", {
      toastId: "save-content",
    });
  };
  return (
    <div
      className={
        isSideBarOpen
          ? "emoji-container emoji-container-active"
          : "emoji-container"
      }
    >
      <div
        className={
          isSideBarOpen ? "arrow-open arrow-open-active" : "arrow-open"
        }
        onClick={() => {
          setIsSideBarOpen(!isSideBarOpen);
        }}
      >
        <CgMenuRight />
      </div>
      <div className="emoji-head">
        <div className="top-box">
          <div>
            <h1>{screen === 2 ? "Select emojis" : "Your emojis"}</h1>
            <p>Selected emojis {savedemojis.length}</p>
          </div>
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
              <IoMdArrowForward />
            </span>
          )}
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
        {screen === 1 && (
          <button onClick={saveData} className="save-btn">
            Save <IoMdCheckmarkCircleOutline />
          </button>
        )}
      </div>
      {screen === 2 && (
        <>
          <div className="emoji-select">
            {filteredemojis
              .filter((emoji) => savedemojis.indexOf(emoji.id) !== -1)
              .map((emoji, index) => (
                <Emoji
                  handleSaveEmoji={handleSaveEmoji}
                  emoji={emoji}
                  key={index}
                  savedemojis={savedemojis}
                />
              ))}
          </div>
          <div className="emoji-select">
            {filteredemojis
              .filter((emoji) => savedemojis.indexOf(emoji.id) == -1)
              .map((emoji, index) => (
                <Emoji
                  handleSaveEmoji={handleSaveEmoji}
                  emoji={emoji}
                  key={index}
                  savedemojis={savedemojis}
                />
              ))}
          </div>
        </>
      )}
      {screen === 1 && (
        <div className="emoji-list">
          <div className="save-data">
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
