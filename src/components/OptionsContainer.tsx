import { BiDownArrow, BiRefresh, BiUpArrow } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { HiMiniMap } from "react-icons/hi2";

interface OptionsContainerProps {
  onToggleMinimap: CallableFunction;
  onRefreshMinimap: CallableFunction;
  onNextChat: CallableFunction;
  onPreviousChat: CallableFunction;
  showMinimap: boolean;
}

export default function OptionsContainer({
  onToggleMinimap,
  onRefreshMinimap,
  onNextChat,
  onPreviousChat,
  showMinimap,
}: OptionsContainerProps) {
  return (
    <div className="options-container" style={OptionsContainerStyle}>
      <button onClick={() => onToggleMinimap()} style={buttonStyle}>
        {showMinimap ? <CgClose /> : <HiMiniMap />}
      </button>
      {showMinimap ? (
        <>
          <button onClick={() => onRefreshMinimap()} style={buttonStyle}>
            <BiRefresh />
          </button>
          <button onClick={() => onPreviousChat()} style={buttonStyle}>
            <BiUpArrow />
          </button>
          <button onClick={() => onNextChat()} style={buttonStyle}>
            <BiDownArrow />
          </button>
        </>
      ) : null}
    </div>
  );
}

const OptionsContainerStyle: React.CSSProperties = {
  fontSize: "16px",
  height: "fit-content",
  display: "flex",
  flexDirection: "column",
  gap: "0.3em",
  paddingTop: "1em"
};
const buttonStyle: React.CSSProperties = {
  padding: " 0 0.2em",
  backgroundColor: "white",
  color: "black",
  borderTopLeftRadius: "1em",
  borderBottomLeftRadius: "1em",
  pointerEvents: "auto",
  border: "solid black 1px",
  fontFamily: "Verdana",
  height: "4em",
};
