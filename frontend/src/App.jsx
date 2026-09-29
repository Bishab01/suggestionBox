import {Outlet} from "react-router-dom";

function App() {
  return (
    <div className="mainBg">
        <div className="flex flex-col h-full">
            <Outlet/>
        </div>
    </div>
  )
}

export default App
