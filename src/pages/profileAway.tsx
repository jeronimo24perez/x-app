import Nav from "../features/nav.tsx";
import HeaderMiddle from "../components/headerMiddle.tsx";
import {RxAvatar} from "react-icons/rx";
import {AiFillCalendar} from "react-icons/ai";
import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router";
import type User from "../models/user.ts";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../state/store.tsx";
import {getUser, userPosts} from "../state/userSlice.ts";
import {cacheReader} from "../state/authSlice.tsx";
import type Post from "../models/post.ts";
import PostComponent from "../components/post.tsx";
import {getMyFollows} from "../state/follows.tsx";
import FollowButton from "../features/followButton.tsx";

const ProfileAway = ()=>{
    const {id} = useParams();
    const dispatch :AppDispatch= useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    const profile = useSelector((state: RootState) => state.profile);
  
    const navigate = useNavigate();
    const [info, setInfo] = useState<User | null>(null);
    useEffect(() => {
        const localId: string | null = localStorage.getItem("id")
        if(!auth.isLoading){
            if(!auth.auth){
                navigate('/')
            }
        }
        dispatch(cacheReader({
            id: localId,
            auth: true
        }))
        if(auth.id){
            dispatch(getUser({id: auth.id}))
            dispatch(userPosts(id || ""))
            dispatch(getMyFollows(auth.id))

        }
        fetch(`https://x-backend-ruddy.vercel.app/user/${id}`).then(res => res.json()).then(data => {
            setInfo(data.user)
        })
    }, [auth.auth, auth.id, auth.isLoading, dispatch, id, navigate]);
    return(
        <>
            <main>
                <Nav />
                <div className="feed-container">
                    <HeaderMiddle headerText={info?.username || ""} />
                    <section className="banner">
                    </section>
                    <div className="profile-info">
                        <div className="row row-profile-1">
                            <div className="avatar avatar-profile">
                                <RxAvatar className="avatar-icon" />
                            </div>
                            <div></div>
                           <FollowButton  idToFollow={id || ""} setInfo={setInfo} />
                        </div>
                        <div className="info-container">
                            <h4>{info?.username}</h4>
                            <p className={"fw-small text-grey"}>@{info?.email?.split('@')[0]}</p>
                            <p className={"fw-small text-grey"}><AiFillCalendar /> {info?.date}</p>
                            <div className="row row-follows">
                                <Link to={`/following/${id}`} className={"fw-small link-follow"}> {info?.follows} <span className="text-grey">Siguiendo</span> </Link>
                                <Link to={`/followers/${id}`} className={"fw-small link-follow"}>{info?.followers } <span className="text-grey">Seguidores</span>  </Link>
                            </div>
                            <div className="bio">
                                {info?.bio}
                            </div>
                    </div>
                    <section className={"principal-content"}>
                        <div className="tab tab-away">
                            <div className={ "tab-post tab-post-away cursor-pointer tab-active"} >
                                Posts
                            </div>
                        </div>
                        {   profile.posts?.map((e:Post)=> <PostComponent text={e.text} date={e.date} _id={e._id} email={e.email} key={e._id} autor={e.autor} /> )}
                    </section>
                 </div>
                </div>
            </main>
        </>
    )
}

export default ProfileAway;