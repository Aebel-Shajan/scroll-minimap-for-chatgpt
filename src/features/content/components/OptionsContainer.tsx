import { BiDownArrow, BiRefresh, BiUpArrow } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { ExtensionOptions } from "../../../types/options";
// import { HiMiniMap } from "react-icons/hi2";


const logo = chrome.runtime.getURL("assets/logo.png");
interface OptionsContainerProps {
  options: ExtensionOptions;
  onToggleMinimap: CallableFunction;
  onRefreshMinimap: CallableFunction;
  onNextChat: CallableFunction;
  onPreviousChat: CallableFunction;
  showMinimap: boolean;
}

export default function OptionsContainer({
  options,
  onToggleMinimap,
  onRefreshMinimap,
  onNextChat,
  onPreviousChat,
  showMinimap,
}: OptionsContainerProps) {
  return (
    <div className="options-container" style={OptionsContainerStyle}>
      <button onClick={() => onToggleMinimap()} style={buttonStyle}>
        {showMinimap ? <CgClose /> : <img src={logo} style={imageStyle}/>}
      </button>
      {showMinimap ? (
        <>
          <button 
            onClick={() => onRefreshMinimap()} 
            style={options.autoRefresh ? {...buttonStyle, color: "#AAFF00"} : buttonStyle }>
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
  backgroundColor: "#2F2F2F",
  color: "white",
  borderTopLeftRadius: "1em",
  borderBottomLeftRadius: "1em",
  pointerEvents: "auto",
  border: "solid #676767 1px",
  fontFamily: "Verdana",
  height: "4em",
  width: "1.2em",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
  
};
const imageStyle: React.CSSProperties = {
  objectFit: "contain"
}