import {type ChangeEvent, useEffect, useState} from "react";
import { useNavigate, useParams} from "react-router";
import type Post from "../models/post.ts";
import Spinner from "../components/spinner.tsx";
import Nav from "../features/nav.tsx";
import '../styles/postPage.css'
import PostComponent from "../components/post.tsx";
import {RxAvatar} from "react-icons/rx";
import {ProgressCircle} from "../components/progressCircle.tsx";
import {FaImage} from "react-icons/fa";
import {MdEmojiEmotions} from "react-icons/md";
import EmojiPicker, {type EmojiClickData, Theme} from "emoji-picker-react";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../state/store.tsx";
import {getUser} from "../state/userSlice.ts";
import {cacheReader} from "../state/authSlice.tsx";
import {getPostComment, PostComment} from '../state/commentSlice.tsx'
import HeaderMiddle from "../components/headerMiddle.tsx";
const PostPage = ()=>{
    const {id} = useParams()
    interface postSaver extends Post {
        userId: string
    }
    const MAX_CHARS = 280;
    const auth = useSelector((state:RootState)=> state.auth)
    const [post, setPost] = useState<postSaver>({
        autor: "",
        date:"",
        email:"",
        img:"",
        likes: 0,
        text:"",
        userId :"",
        _id:"",
    });
    const dispatch:AppDispatch = useDispatch();
    const navigate = useNavigate()
    const [text, setText] = useState("");
    const [loading, setLoading] = useState<boolean>(true);
    const comments= useSelector((state:RootState)=> state.comments)
    const profile= useSelector((state:RootState)=> state.profile)

    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const onEmojiClick = (emojiData: EmojiClickData) => {
        setText((prev) => prev + emojiData.emoji);
        setShowEmojiPicker(false); // Se cierra al elegir
    };

    useEffect(() => {
        async function post(){
            const data = await fetch(`https://x-backend-ruddy.vercel.app/post/${id}`)
            const result = await data.json()

            setPost(result);
            setLoading(false);
            return result
        }
        if(!auth.isLoading){
            if(!auth.auth){
                navigate('/')
            }
        }

        post()
    }, [id]);
    useEffect(() => {
        const ide: string | null = localStorage.getItem("id");
        dispatch(cacheReader({
            id: ide,
            auth: true
        }))
        if(ide){
            dispatch(getUser({id: ide}))
        }

        dispatch(getPostComment(id || ""))
    }, [dispatch]);
    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
        const formattedText = e.target.value.replace(/\n/g, "");
        if (e.target.value.length <= MAX_CHARS) {
            setText(formattedText);
            const el = e.target;
            el.style.setProperty("height", "auto", "important");
            el.style.setProperty("height", `${el.scrollHeight}px`, "important");
        }
    }
    return(
        loading?
            <Spinner />:
        <>
            <main className={"main-post-page"}>
                <Nav />

                <div className="feed-container">
                  <HeaderMiddle headerText="Post"  />
                    {/*POST*/}
                <PostComponent text={post.text} date={post.date} _id={id} likes={post.likes} key={id} userId={post.userId} email={post.email} autor={post.autor} />
                    {/*Comment reply*/}
                    <div className="row write-reply-row">
                        <div className="avatar">
                            <RxAvatar className="avatar-icon" />
                        </div>
                        <textarea
                            placeholder="Cual es tu respuesta?"
                            id="text-post"
                            value={text}
                            onChange={handleChange}
                            className="write-post"
                        ></textarea>
                        <div></div>
                        <div className="row buttons-row">
                            <FaImage className="post-icon" />

                            {/* Botón que despliega el picker */}
                            <MdEmojiEmotions
                                className="post-icon cursor-pointer"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            />

                            {/* Renderizado condicional del Picker */}
                            {showEmojiPicker && (
                                <div style={{ position: 'absolute', zIndex: 10, top: '40px', left: '0' }}>
                                    <EmojiPicker
                                        onEmojiClick={onEmojiClick}
                                        theme={Theme.DARK}
                                        searchPlaceholder="Buscar emoji..."
                                        width={300}
                                        height={400}
                                    />
                                </div>
                            )}

                            <ProgressCircle key={2} currentLength={text.length} maxLength={MAX_CHARS} />
                            <button className={text.length>0? "button-rounded fw-bold button-reply cursor-pointer":"button-rounded fw-bold button-reply button-disabled cursor-default"}
                            onClick={()=>{
                                if(text.length > 0){
                                    dispatch(PostComment({
                                        id: id || "",
                                        userId: auth.id || "",
                                        text: text,
                                        autor: profile.user.username,
                                        email: profile.user.email
                                    }))
                                    setText("")
                            }}
                            }>responder</button>
                        </div>
                    </div>
                    {/*comments*/}
                    {comments.comment.map(e => <PostComponent text={e.text} date={e.date} _id={e._id} email={e.email} key={e._id} autor={e.autor} /> ) }
                </div>
                <div className="third">
                </div>
            </main>
        </>
    )
}

export default PostPage;