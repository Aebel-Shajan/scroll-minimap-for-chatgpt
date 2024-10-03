const Minimap = () => {
    return (  
        <div 
            className="minimap-container"
            style={minimapContainerStyle}
        >

        </div>
    );
}

const minimapContainerStyle: React.CSSProperties = {
    width: "10rem",
    height: "100rem",
    backgroundColor: "green",
    pointerEvents: "all"
}
 
export default Minimap;