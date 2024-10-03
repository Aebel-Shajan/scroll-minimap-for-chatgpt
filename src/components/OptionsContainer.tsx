
interface OptionsContainerProps {
    setShowMinimap: CallableFunction,
    showMinimap: boolean
}  


const OptionsContainer = ({setShowMinimap, showMinimap}: OptionsContainerProps) => {
    return ( 
        <div 
            className="options-container"
            style={OptionsContainerStyle}    
        >
            <button 
                onClick={() => setShowMinimap(!showMinimap)}
                style={buttonStyle}
            >
                toggle minimap
            </button>
        </div>
     );
}


const OptionsContainerStyle: React.CSSProperties = {
    height: "fit-content",
    transform: "rotate(270deg)",
    transformOrigin: "bottom right",
}
const buttonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    backgroundColor: "white",
    color: "black",
    borderTopLeftRadius: "1rem",
    borderTopRightRadius: "1rem",
    pointerEvents: "auto"

}
 
export default OptionsContainer;