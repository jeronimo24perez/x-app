
import './App.css'
import Home from "./pages/home.tsx";
import { Route, Routes, useLocation} from "react-router";
import Feed from "./pages/feed.tsx";
import PostPage from "./pages/postPage.tsx";
import Profile from "./pages/profile.tsx";
import ProfileAway from "./pages/profileAway.tsx";
import Following from './pages/following.tsx';
import Followers from './pages/followers.tsx';
import ToFollow from "./pages/toFollow.tsx";
import ModalCompose from "./features/modalCompose.tsx";
import Explore from "./pages/explore.tsx";
function App() {
    const location = useLocation();
    const backgroundLocation = location.state?.backgroundLocation;
  return (
    <>
            <Routes location={backgroundLocation || location}>
                <Route path='/' element={<Home />} />
                <Route path='/feed' element={<Feed />} />
                <Route path='/connect_people' element={<ToFollow />} />
                <Route path={'/explore'} element={<Explore />} />
                <Route path='/:id' element={<ProfileAway />} />
                <Route path='/post/:id' element={<PostPage /> } />
                <Route path='/profile/:id' element={<Profile />} />
                <Route path='/following/:id' element={<Following />} />
                <Route path='/followers/:id' element={<Followers />} />
                <Route path='*' element={<p>No encontrada</p>} />

            </Routes>
            {backgroundLocation && (
                <Routes>
                    <Route path='/compose/post' element={<ModalCompose />} />
                </Routes>
            )}
    </>
  )
}

export default App
