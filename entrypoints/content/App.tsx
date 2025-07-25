import "@/assets/tailwind.css";


function ToggleOpenButton(
  {
    openState,
    setOpenState,
  }: {
    openState: boolean,
    setOpenState: CallableFunction,
  }
) {

  return (
    <button
      className="bg-gray-500 rounded w-7 h-7 flex items-center justify-center fixed top-3 right-3 cursor-pointer text-white"
      onClick={() => setOpenState((old: boolean) => !old)}
    >
      {openState ? "x" : "<>"}
    </button>
  )
}

export default function App() {
  const [isOpen, setIsOpen] = useState(true)


  if (!isOpen) {
    return <ToggleOpenButton openState={isOpen} setOpenState={setIsOpen} />
  }


  return (
    <div className="bg-gray-50 text-black fixed top-0 right-0 w-100 h-100 z-99999999 rounded-xl border-gray-300 border-1 p-5 overflow-hidden">
      Hello world
      <ToggleOpenButton openState={isOpen} setOpenState={setIsOpen} />
    </div>
  )
}