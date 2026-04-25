import {type ChangeEvent, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router";
import type Post from "../models/post.ts";
import Spinner from "../components/spinner.tsx";
import Nav from "../features/nav.tsx";
import '../styles/postPage.css'
import PostComponent from "../components/post.tsx";
import {IoArrowBackOutline} from "react-icons/io5";
import {RxAvatar} from "react-icons/rx";
import {ProgressCircle} from "../components/progressCircle.tsx";
import {FaImage} from "react-icons/fa";
import {MdEmojiEmotions} from "react-icons/md";
import EmojiPicker, {type EmojiClickData, Theme} from "emoji-picker-react";
import {useSelector} from "react-redux";
import type {RootState} from "../state/store.tsx";
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
    const navigate = useNavigate()
    const [text, setText] = useState("");
    const [loading, setLoading] = useState<boolean>(true);
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
        if(!auth.auth){
            navigate('/')
        }
        post()
    }, [id]);
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
                    <div className="header go-back ">
                        <Link className="p-1 " to='/feed'>
                            <IoArrowBackOutline className="arrow-icon" />
                        </Link>
                        <h3>Post</h3>
                    </div>

                <PostComponent text={post.text} date={post.date} _id={id} likes={post.likes} key={id} email={post.email} autor={post.autor} />
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
                                        theme={Theme.DARK} // O Theme.DARK según tu app
                                        searchPlaceholder="Buscar emoji..."
                                        width={300}
                                        height={400}
                                    />
                                </div>
                            )}

                            <ProgressCircle key={2} currentLength={text.length} maxLength={MAX_CHARS} />
                            <button className="button-rounded fw-bold button-reply button-disabled cursor-default">responder</button>
                        </div>
                    </div>
                </div>
                <div className="third">

                </div>
            </main>
        </>
    )
}

export default PostPage;