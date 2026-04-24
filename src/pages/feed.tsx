import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../state/store.tsx";
import {type ChangeEvent, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import '../styles/feed.css'
import {FaXTwitter} from "react-icons/fa6";
import {MdEmojiEmotions, MdHomeFilled, MdPerson, MdPersonAdd} from "react-icons/md";
import {FaImage, FaSearch} from "react-icons/fa";
import { CgMoreO} from "react-icons/cg";
import {RxAvatar} from "react-icons/rx";
import {ProgressCircle} from "../components/progressCircle.tsx";
import {getUser} from "../state/userSlice.ts";
import {explore, getFeed} from "../state/postSlice.tsx";
import Spinner from "../components/spinner.tsx";
import PostComponent from "../components/post.tsx";

const Feed = ()=>{
    const state = useSelector((state: RootState)=> state.auth)
    const profile = useSelector((state:RootState) => state.profile)
    const postReader = useSelector((state: RootState)=> state.posts)
    const navigate = useNavigate()
    const dispatch: AppDispatch = useDispatch()
    const [post, setPost] = useState<string>("")
    const MAX_CHARS = 280;

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>){
        const formattedText = e.target.value.replace(/\n/g, "");
        if (e.target.value.length <= MAX_CHARS) {
            setPost(formattedText);
        }
    }

    const isMounted = useRef(false);

    useEffect(() => {
        const userId = state.id
        if (!isMounted.current) {
            dispatch(getUser({
                id: userId
            }))
            dispatch(getFeed(userId))
            if(postReader.feed.length === 1){
                dispatch(explore())
            }
            isMounted.current = true;
        }
    }, [dispatch, state.id]);
    useEffect(()=>{

        if(!state.auth){
            navigate('/')
        }

    }, [navigate, state, post])
    return (
        <>
            {profile.isLoading || postReader.isLoading || state.isLoading ?
                <Spinner/>
                :
                <main className="main-feed">
                    <nav>
                        <ul>
                            <div className="logo-nav">
                                <FaXTwitter className={'x-navigation-logo'}  />
                            </div>
                            <li><MdHomeFilled /> Inicio</li>
                            <li> <FaSearch/> Explorar</li>
                            <li><MdPersonAdd /> seguir</li>
                            <li><MdPerson /> perfil</li>
                            <li> <CgMoreO /> mas</li>
                            <button className={"button-rounded"}>Post</button>
                            <div>name</div>
                        </ul>
                    </nav>
                    <div className="feed-container">
                        <div className="grid-container">
                            <div className="row write-post-row">
                                <div className="avatar">
                                    <RxAvatar className="avatar-icon" />
                                </div>
                                <textarea placeholder="Que esta pasando?" value={post} onChange={handleChange} id="text-post" className="write-post"></textarea>
                            </div>
                            <div className="row row-separator"></div>
                            <div className="row feed-post" >
                                <FaImage className="post-icon" />
                                <MdEmojiEmotions className="post-icon" />
                                <ProgressCircle key={2} currentLength={post.length} maxLength={MAX_CHARS} />

                                <button className={post.length > 0? "button-rounded post-button":"button-rounded post-button button-disabled" }>Post</button>
                            </div>
                        </div>
                        <div className="separator-show-post text-blue cursor-pointer">
                            Mostrar Posts
                        </div>
                        <section className="feed-grid">
                            {postReader.feed.map(e => <PostComponent key={e._id} email={e.email} autor={e.autor} text={e.text} date={e.date} likes={e.likes} /> )}

                        </section>
                    </div>
                </main>
            }

        </>
    )
}

export default Feed;