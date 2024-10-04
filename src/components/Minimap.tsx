import { forwardRef } from "react";

const Minimap = forwardRef((_, ref: React.ForwardedRef<HTMLDivElement>) => {
  return (
    <div className="minimap-overlay" style={minimapOverlayStyle}>
      <div
        className="minimap-container"
        style={minimapContainerStyle}
        ref={ref}
      ></div>
    </div>
  );
});

const minimapOverlayStyle: React.CSSProperties = {
  width: "5rem",
  height: "90vh",
  backgroundColor: "green",
  pointerEvents: "all",
  boxShadow: "0 0 20px rgba(0, 0, 0, 1)",
};

const minimapContainerStyle: React.CSSProperties = {
  
}

export default Minimap;
