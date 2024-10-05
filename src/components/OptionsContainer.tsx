import { BiDownArrow, BiRefresh, BiSolidLeftArrowSquare, BiSolidRightArrowSquare, BiUpArrow } from "react-icons/bi";

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
      {showMinimap ? (
        <>
      <button onClick={() => onNextChat()} style={buttonStyle}> 
        <BiSolidLeftArrowSquare />
      </button>
        <button onClick={() => onPreviousChat()} style={buttonStyle}> 
        <BiSolidRightArrowSquare />
      </button>
        <button onClick={() => onRefreshMinimap()} style={buttonStyle}>
          <BiRefresh />
        </button>
      </>
      ) : null}
      <button onClick={() => onToggleMinimap()} style={buttonStyle}>
        {showMinimap ? <BiDownArrow /> : <BiUpArrow /> }
      </button>
      
    </div>
  );
}

const OptionsContainerStyle: React.CSSProperties = {
  height: "fit-content",
  transform: "rotate(270deg)",
  transformOrigin: "bottom right",
};
const buttonStyle: React.CSSProperties = {
  padding: "0.2rem 2rem",
  backgroundColor: "white",
  color: "black",
  borderTopLeftRadius: "1rem",
  borderTopRightRadius: "1rem",
  pointerEvents: "auto",
  border: "solid black 1px",
  fontFamily: "Verdana",
  height: "1rem"
};
