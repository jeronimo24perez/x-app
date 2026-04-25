
import './App.css'
import Home from "./pages/home.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import Feed from "./pages/feed.tsx";
import PostPage from "./pages/postPage.tsx";

function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/feed' element={<Feed />} />
                <Route path='/post/:id' element={<PostPage /> } />
                <Route path='*' element={<p>No encontrada</p>} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
