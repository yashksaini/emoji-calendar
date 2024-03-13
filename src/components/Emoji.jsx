/* eslint-disable react/prop-types */
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Tooltip as ReactTooltip } from "react-tooltip";
const Emoji = ({ emoji, handleSaveEmoji, savedemojis, keyValue }) => {
  console.log(emoji, keyValue);
  return (
    <>
      <span
        data-tooltip-id={"tooltip-" + keyValue + emoji.id}
        onClick={() => {
          handleSaveEmoji(emoji);
        }}
      >
        {emoji.icon}
        {savedemojis.indexOf(emoji.id) !== -1 && (
          <IoIosCheckmarkCircle className="emoji-tick" />
        )}
        <ReactTooltip
          id={"tooltip-" + keyValue + emoji.id}
          place="bottom"
          content={emoji.name}
        />
      </span>{" "}
    </>
  );
};

export default Emoji;
