import { forwardRef } from "react";

const Minimap = forwardRef((_, ref: React.ForwardedRef<HTMLDivElement>) => {
  return (
    <div
      className="minimap-container"
      style={minimapContainerStyle}
      ref={ref}
    ></div>
  );
});

const minimapContainerStyle: React.CSSProperties = {
  width: "5rem",
  height: "90vh",
  backgroundColor: "green",
  pointerEvents: "all",
};

export default Minimap;
