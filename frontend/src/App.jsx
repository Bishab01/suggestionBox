import {Outlet} from "react-router-dom";
import Navbar from "./components/navbar";

function App() {
  return (
    <div className="mainBg">
        <div className="flex flex-col h-full">
            <Navbar />
            <Outlet />
        </div>
    </div>
  )
}

export default App
