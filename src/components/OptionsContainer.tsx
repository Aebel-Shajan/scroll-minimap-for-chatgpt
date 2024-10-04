interface OptionsContainerProps {
  onToggleMinimap: CallableFunction;
  onRefreshMinimap: CallableFunction;
  showMinimap: boolean;
}

export default function OptionsContainer({
  onToggleMinimap,
  onRefreshMinimap,
  showMinimap,
}: OptionsContainerProps) {
  return (
    <div className="options-container" style={OptionsContainerStyle}>
      {showMinimap ? (
        <button onClick={() => onRefreshMinimap()} style={buttonStyle}>
          refresh minimap
        </button>
      ) : null}
      <button onClick={() => onToggleMinimap()} style={buttonStyle}>
        toggle minimap
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
  padding: "0.1rem 1rem",
  backgroundColor: "white",
  color: "black",
  borderTopLeftRadius: "1rem",
  borderTopRightRadius: "1rem",
  pointerEvents: "auto",
  border: "solid black 1px",
  fontFamily: "Verdana"
};
