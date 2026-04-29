import Nav from "../features/nav.tsx";
import {useEffect, useState} from "react";
import {cacheReader} from "../state/authSlice.tsx";
import type {AppDispatch, RootState} from "../state/store.tsx";
import {useDispatch, useSelector} from "react-redux";
import {getUser, userPosts} from "../state/userSlice.ts";
import {Link, useNavigate, useParams} from "react-router";
import HeaderMiddle from "../components/headerMiddle.tsx";
import '../styles/profile.css'
import {RxAvatar} from "react-icons/rx";
import {AiFillCalendar} from "react-icons/ai";
import type Post from "../models/post.ts";
import PostComponent from "../components/post.tsx";
import Spinner from "../components/spinner.tsx";
import {userLikes} from "../state/likesSlice.tsx";
import {fetchLikesPosts, type likePetition} from "../state/postSlice.tsx";
const Profile = ()=>{
    const dispatch:AppDispatch = useDispatch();
    const navigate = useNavigate()
    const auth = useSelector((state:RootState)=> state.auth)
    const post = useSelector((state:RootState) => state.posts)
    const profile = useSelector((state:RootState)=> state.profile)
    //const likes = useSelector((state: RootState)=> state.likes)
    const [tab, setTab] = useState<number>(1)
    const {id} = useParams()
    useEffect(()=>{
        const ide: string | null = localStorage.getItem("id");
        if(!auth.isLoading){
            if(!auth.auth){
                navigate('/')
            }
        }
        dispatch(cacheReader({
            id: ide,
            auth: true
        }))
        if(ide){
            dispatch(getUser({id: ide})).unwrap().then(()=>{
                if(auth.id){
                    dispatch(userPosts(auth.id))
                    dispatch(userLikes(auth.id)).unwrap().then((u)=>{
                        const array: string[] = []
                        u.map((e:likePetition) =>{
                            array.push(e.postId)
                        })
                        dispatch(fetchLikesPosts(array))
                    })
                }
            })
        }


    }, [auth.auth, auth.id, auth.isLoading, dispatch, navigate])
    return(
        auth.isLoading || profile.isLoading?
            <Spinner/> :
        <>
            <main>
                <Nav />
                <div className="feed-container">
                    <HeaderMiddle headerText={profile.user?.username || " "} />
                    <section className="banner">

                    </section>
                    <div className="profile-info">
                        <div className="row row-profile-1">
                            <div className="avatar avatar-profile">
                                <RxAvatar className="avatar-icon" />
                            </div>
                            <div></div>
                            <button className="button-rounded edit-profile">Editar perfil</button>
                        </div>
                        <div className="info-container">
                            <h4>{profile.user.username}</h4>
                            <p className={"fw-small text-grey"}>@{profile.user.email?.split('@')[0]}</p>
                            <p className={"fw-small text-grey"}><AiFillCalendar /> {profile.user.date}</p>
                            <div className="row row-follows">
                                <Link to={`/following/${id}`} className={"fw-small link-follow "}> {profile.user.follows} <span className="text-grey">Siguiendo</span> </Link>
                                <Link to={`/followers/${id}`}className={"fw-small link-follow"}>{profile.user.followers } <span className="text-grey">Seguidores</span> </Link>
                            </div>
                            <div className="bio">
                                {profile.user.bio}
                            </div>
                        </div>


                    </div>
                    <section className="principal-content">
                        <div className="tab">
                            <div className={tab === 1? "tab-post cursor-pointer tab-active": "tab-post cursor-pointer"} onClick={()=>setTab(1)}>
                                Posts
                            </div>
                            <div className={tab === 2?"tab-likes cursor-pointer tab-active" :"tab-likes cursor-pointer"} onClick={()=>setTab(2)}>
                                Likes
                            </div>
                        </div>
                        {tab === 1?
                        profile.posts?.map((e:Post)=> <PostComponent text={e.text} date={e.date} _id={e._id} email={e.email} key={e._id} autor={e.autor} /> )
                            : <>
                            {tab === 2? post.liked?.map((e: Post)=> <PostComponent text={e.text} date={e.date} _id={e._id} email={e.email} key={e._id} autor={e.autor} />):
                            <></>}
                            </>
                        }
                    </section>
                </div>
            </main>
        </>
    )
}

export default Profile