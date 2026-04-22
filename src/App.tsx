
import './App.css'
import Home from "./pages/home.tsx";
import {BrowserRouter, Route, Routes} from "react-router";

function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/feed' element={<p>feed in progress</p>} />
                <Route path='*' element={<p>No encontrada</p>} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
