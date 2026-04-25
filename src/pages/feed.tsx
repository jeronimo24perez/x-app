import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../state/store.tsx";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import '../styles/feed.css';
import { MdEmojiEmotions } from "react-icons/md";
import { FaImage} from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { ProgressCircle } from "../components/progressCircle.tsx";
import {getUser} from "../state/userSlice.ts";
import { createPost, explore, getFeed } from "../state/postSlice.tsx";
import Spinner from "../components/spinner.tsx";
import PostComponent from "../components/post.tsx";

// 1. Importar la librería y el tipo
import EmojiPicker, {type EmojiClickData, Theme } from 'emoji-picker-react';
import Nav from "../features/nav.tsx";
import {userLikes} from "../state/likesSlice.tsx";

const Feed = () => {
    const state = useSelector((state: RootState) => state.auth);
    const profile = useSelector((state: RootState) => state.profile);
    const postReader = useSelector((state: RootState) => state.posts);
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();

    const [post, setPost] = useState<string>("");
    // 2. Estado para el selector de emojis
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

    const MAX_CHARS = 280;

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

    const isMounted = useRef(false);

    useEffect(() => {
        const userId = state.id;
        if (!isMounted.current) {
            dispatch(getUser({ id: userId }));
            dispatch(getFeed(userId));
            if (postReader.feed.length === 1) {
                dispatch(explore());
            }
            isMounted.current = true;
        }
    }, [dispatch, state.id]);
    useEffect(() => {
        if(state.id){
            dispatch(userLikes(state.id))
        }
    }, [dispatch, state.id]);
    useEffect(() => {
        if (!state.auth) {
            navigate('/');
        }
    }, [navigate, state.auth]); // Corregida dependencia: state.auth en lugar de state entero

    return (
        <>
            {profile.isLoading || postReader.isLoading || state.isLoading ?
                <Spinner />
                :
                <main className="main-feed">
                <Nav />
                    <div className="feed-container">
                        <div className="grid-container">
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
                            <div className="row row-separator"></div>

                            {/* 4. Contenedor de iconos con selector de emojis */}
                            <div className="row feed-post" style={{ position: 'relative' }}>
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

                                <ProgressCircle key={2} currentLength={post.length} maxLength={MAX_CHARS} />

                                <button
                                    className={post.length > 0 ? "button-rounded post-button" : "button-rounded post-button button-disabled"}
                                    onClick={() => {
                                        if (post.length > 0){
                                                dispatch(createPost({
                                                    _id: state.id,
                                                    text: post
                                                }));
                                                dispatch(explore());
                                                setPost("");
                                                setShowEmojiPicker(false);
                                              }}
                                        }

                                >
                                    Post
                                </button>
                            </div>
                        </div>
                        <div className="separator-show-post text-blue cursor-pointer">
                            Mostrar Posts
                        </div>
                        <section className="feed-grid">
                            {postReader.feed.map(e => (
                                <PostComponent
                                    key={e._id}
                                    likes={e.likes}
                                    email={e.email}
                                    autor={e.autor}
                                    text={e.text}
                                    date={e.date}
                                    _id={e._id}
                                />
                            ))}
                        </section>
                    </div>
                    <div className="third"></div>
                </main>
            }
        </>
    );
};

export default Feed;