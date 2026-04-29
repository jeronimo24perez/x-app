import {RxAvatar} from "react-icons/rx";
import '../styles/modalCompose.css'
import {CgClose} from "react-icons/cg";
import {useNavigate} from "react-router";
import {ProgressCircle} from "../components/progressCircle.tsx";
import {type ChangeEvent, useState} from "react";
import EmojiPicker, {type EmojiClickData, Theme} from "emoji-picker-react";
import {MdEmojiEmotions} from "react-icons/md";
import {FaImage} from "react-icons/fa";
import {createPost} from "../state/postSlice.tsx";
import type {AppDispatch, RootState} from "../state/store.tsx";
import {useDispatch, useSelector} from "react-redux";
const ModalCompose = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState<string>("");
    const auth = useSelector((state:RootState)=> state.auth)
    const MAX_CHARS = 280;
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const dispatch:AppDispatch = useDispatch();

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
        const formattedText = e.target.value.replace(/\n/g, "");
        if (e.target.value.length <= MAX_CHARS) {
            setPost(formattedText);
        }
    }
    const onEmojiClick = (emojiData: EmojiClickData) => {
        setPost((prev) => prev + emojiData.emoji);
        setShowEmojiPicker(false); // Se cierra al elegir
    };

    return(
        <div className={"modal-compose-background"}>

            <div className="modal-compose">
                <div className="modal-compose-close">
                    <button className="close" onClick={()=>{
                        navigate(-1)
                    }}> <CgClose size={18} /> </button>
                </div>
                <div className="modal-compose-content">

                    <div className="row write-post-row">
                        <div className="avatar">
                            <RxAvatar className="avatar-icon" />
                        </div>
                        <textarea
                            placeholder="¿Qué está pasando?"
                            value={post}
                            onChange={handleChange}

                            id="text-post"
                            className="write-post"
                        ></textarea>
                    </div>

                </div>
                <div className="modal-compose-footer">
                    <FaImage className="post-icon" />
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
                    <ProgressCircle currentLength={post.length} maxLength={MAX_CHARS} />
                    <button
                        className={post.length > 0 ? "button-rounded post-button" : "button-rounded post-button button-disabled"}
                        onClick={() => {
                            if (post.length > 0){
                                dispatch(createPost({
                                    _id: auth.id,
                                    text: post
                                }));
                                setPost("");
                                setShowEmojiPicker(false);
                                navigate(-1)
                            }}
                        }

                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalCompose;