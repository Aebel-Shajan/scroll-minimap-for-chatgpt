import { BiDownArrow, BiRefresh, BiUpArrow } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
// import { ExtensionOptions } from "../../../../types/options";
import {  IoSettingsOutline } from "react-icons/io5";
import { useContext } from "react";
import { ContentContext } from "../ContentContainer";
import { onNextChat, onPreviousChat } from "../../utils/renderLogic";


const logo = chrome.runtime.getURL("assets/logo.png");


export default function OptionsContainer() {
  // Context
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("OptionsContainer should be used within content context")
  }
  const {showMinimap, setShowMinimap, searchForChat} = context;

  function onOpenOptions() {
    chrome.runtime.sendMessage({"action": "openOptionsPage"});
  }

  return (
    <div className="options-container" style={OptionsContainerStyle}>
      <button onClick={() => setShowMinimap((last: boolean) => !last)} style={buttonStyle}>
        {showMinimap ? <CgClose /> : <img src={logo} style={imageStyle}/>}
      </button>
      {showMinimap ? (
        <>
          <div>
            <button onClick={() => onOpenOptions()} style={buttonStyle} >
            <IoSettingsOutline />
            </button>
            <button
              onClick={() => searchForChat()} 
              // style={options.autoRefresh ? {...buttonStyle, color: "#AAFF00"} : buttonStyle }
              >
              <BiRefresh />
            </button>
   
          </div>
          <div>
            <button onClick={() => onPreviousChat(true)} style={buttonStyle}>
              <BiUpArrow />
            </button>
            <button onClick={() => onNextChat(true)} style={buttonStyle}>
              <BiDownArrow />
            </button>
          </div>
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
  gap: "1em",
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