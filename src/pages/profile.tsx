import Nav from "../features/nav.tsx";
import {useEffect, useState} from "react";
import {cacheReader} from "../state/authSlice.tsx";
import type {AppDispatch, RootState} from "../state/store.tsx";
import {useDispatch, useSelector} from "react-redux";
import {getUser, userPosts} from "../state/userSlice.ts";
import {Link, useLocation, useNavigate, useParams} from "react-router";
import HeaderMiddle from "../components/headerMiddle.tsx";
import '../styles/profile.css'
import {RxAvatar} from "react-icons/rx";
import {AiFillCalendar} from "react-icons/ai";
import type Post from "../models/post.ts";
import PostComponent from "../components/post.tsx";
import Spinner from "../components/spinner.tsx";
import {userLikes} from "../state/likesSlice.tsx";
import {explore, fetchLikesPosts, type likePetition} from "../state/postSlice.tsx";
import Interesting from "../components/interesting.tsx";
import {IoLocationSharp} from "react-icons/io5";
import {CgWebsite} from "react-icons/cg";
const Profile = ()=>{
    const dispatch:AppDispatch = useDispatch();
    const navigate = useNavigate()
    const auth = useSelector((state:RootState)=> state.auth)
    const post = useSelector((state:RootState) => state.posts)
    const profile = useSelector((state:RootState)=> state.profile)
    //const likes = useSelector((state: RootState)=> state.likes)
    const [tab, setTab] = useState<number>(1)
    const {id} = useParams()
    const location = useLocation()
    useEffect(() => {
        dispatch(explore())
    }, []);
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

        <>
            <main>
                <Nav />
                <div className="feed-container">
                    {auth.isLoading || profile.isLoading?
                    <Spinner/> :
                        <>
                    <HeaderMiddle headerText={profile.user?.username || " "} />
                    <section className="banner">

                    </section>
                    <div className="profile-info">
                        <div className="row row-profile-1">
                            <div className="avatar avatar-profile">
                                <RxAvatar className="avatar-icon" />
                            </div>
                            <div></div>
                            <Link to={'/settings/profile'} state={{ backgroundLocation: location }} className="button-rounded edit-profile text-decoration-none d-flex align-items-center justify-content-center">Editar perfil</Link>
                        </div>
                        <div className="info-container">
                            <h4>{profile.user.username}</h4>
                            <p className={"fw-small text-grey"}>@{profile.user.email?.split('@')[0]}</p>

                            <div className="row row-icons">
                                <p className={"fw-small text-grey"}><AiFillCalendar /> {profile.user.date}</p>

                                <p className={"fw-small text-grey"}> {profile.user.location? <><IoLocationSharp /> { profile.user.location}</>:<></> }</p>
                                <a className={"fw-small text-grey link-follow cursor-pointer"} href={profile.user.website}>  {profile.user.website? <><CgWebsite /> { profile.user.website}</>:<></> }</a>
                            </div>


                            <div className="bio mb-1">
                                {profile.user.bio}
                            </div>
                            <div className="row row-follows">
                                <Link to={`/following/${id}`} className={"fw-small link-follow "}> {profile.user.follows} <span className="text-grey">Siguiendo</span> </Link>
                                <Link to={`/followers/${id}`}className={"fw-small link-follow"}>{profile.user.followers } <span className="text-grey">Seguidores</span> </Link>
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
                        </>}
                </div>
                <div className="third">
                    <Interesting posts={post.feed} />

                </div>
            </main>
        </>
    )
}

export default Profile