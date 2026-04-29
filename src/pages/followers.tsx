import { useEffect, useState } from "react"
import Nav from "../features/nav"
import { cacheReader } from "../state/authSlice";
import { useNavigate, useParams } from "react-router";
import type { AppDispatch } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../state/store";
import { getUser } from "../state/userSlice";
import type User from "../models/user";
import HeaderMiddle from "../components/headerMiddle";
import '../styles/follows.css'
import { getMyFollowers,  type follow } from "../state/follows";
import UserListed from "../components/userListed";
const Following = () => {
    const {id} = useParams();
    const auth = useSelector((state:RootState)=> state.auth)
    const dispatch:AppDispatch = useDispatch();
    const navigate = useNavigate()
    const [info, setInfo] = useState<User | null>(null);
    const [followed, setFollowed] = useState<User[]>([])
    useEffect(()=>{
        //set user info

        const localId: string | null = localStorage.getItem("id");
        if(!auth.isLoading){
            if(!auth.auth){
                navigate('/')
            }
        }
        dispatch(cacheReader({
            id: localId,
            auth: true
        }))
        if(localId){
                dispatch(getUser({id: localId}))
        }
        fetch(`https://x-backend-ruddy.vercel.app/user/${id}`).then(res => res.json()).then(data => {
        setInfo(data.user)

        //get follows of the user
       dispatch(getMyFollowers(id || "")).unwrap().then((followed) => {
        const fetchPromises = followed.find.map((item: follow) =>
            fetch(`https://x-backend-ruddy.vercel.app/user/${item.followerId}`)
            .then(res => res.json())
            .then(data => data.user)
        );

        Promise.all(fetchPromises).then((users) => {
            setFollowed(users);
        });
        });

        })
    }, [auth.auth, auth.isLoading, dispatch, id, navigate])
    return (
        <>
            <main>
                <Nav />{}
                <div className="feed-container">
                    <div className="following-header">
                    <HeaderMiddle headerText={info?.username || ""} subheaderText={`@${info?.email.split('@')[0]}`} />
                    </div>
                    {followed.map(item => 
                        <UserListed key={item._id} item={item}/>
                )}
                </div>
            </main>
        </>
    )
}

export default Following