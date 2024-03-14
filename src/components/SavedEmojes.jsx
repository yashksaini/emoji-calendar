/* eslint-disable react/prop-types */
import { emojisData } from "../constants";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { MdDelete } from "react-icons/md";
const SavedEmojes = ({ savedemojis, saveCurrEmoji, currEmoji }) => {
  let emojiContent = [];
  try {
    emojiContent = JSON.parse(localStorage.getItem("emojiContent"));
  } catch (error) {
    console.error("Error parsing JSON from localStorage:", error);
    emojiContent = {};
  }
  const handleSelectCurrent = (emoji_id) => {
    saveCurrEmoji(emoji_id);
  };

  return (
    <>
      <div
        data-tooltip-id={"saved-tooltip--d"}
        onClick={() => {
          handleSelectCurrent(-1);
        }}
        className={currEmoji === -1 ? "cal-emoji emoji-active" : "cal-emoji"}
      >
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#e23838",
            fontSize: "18px",
          }}
        >
          <MdDelete />
          <ReactTooltip
            id={"saved-tooltip-" + "-d"}
            place="bottom"
            content={"Delete"}
          />
        </span>
      </div>
      {savedemojis.map((emoji_id, index) => {
        return (
          <div
            data-tooltip-id={"saved-tooltip-" + emoji_id}
            key={index}
            onClick={() => {
              handleSelectCurrent(emoji_id);
            }}
            className={
              currEmoji === emoji_id ? "cal-emoji emoji-active" : "cal-emoji"
            }
          >
            <span>{emojisData[emoji_id - 1].icon}</span>

            <ReactTooltip
              id={"saved-tooltip-" + emoji_id}
              place="bottom"
              content={emojiContent && emojiContent[emoji_id]}
            />
          </div>
        );
      })}
    </>
  );
};

export default SavedEmojes;
