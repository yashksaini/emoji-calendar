/* eslint-disable react/prop-types */
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Tooltip as ReactTooltip } from "react-tooltip";
const Emoji = ({ emoji, handleSaveEmoji, savedemojis }) => {
  return (
    <>
      <span
        data-tooltip-id={"tooltip-" + emoji.id}
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
        id={"tooltip-" + emoji.id}
        place="bottom"
        content={emoji.name}
      />
    </>
  );
};

export default Emoji;
