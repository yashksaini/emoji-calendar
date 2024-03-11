/* eslint-disable react/prop-types */

import { emojisData } from "./constants";

const SavedEmojes = ({ savedemojis, saveCurrEmoji, currEmoji }) => {
  const handleSelectCurrent = (emoji_id) => {
    saveCurrEmoji(emoji_id);
    console.log("SAVED", emoji_id);
  };
  return (
    <>
      {savedemojis.map((emoji_id, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              handleSelectCurrent(emoji_id);
            }}
            className={
              currEmoji === emoji_id ? "cal-emoji emoji-active" : "cal-emoji"
            }
          >
            <span>{emojisData[emoji_id - 1].icon}</span>
          </div>
        );
      })}
    </>
  );
};

export default SavedEmojes;
