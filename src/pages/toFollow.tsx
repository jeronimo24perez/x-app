import Nav from "../features/nav.tsx";
import {useNavigate} from "react-router";
import {useEffect} from "react";
import {getAllUsers, getUser} from "../state/userSlice.ts";
import type {AppDispatch, RootState} from "../state/store.tsx";
import {useDispatch, useSelector} from "react-redux";
import HeaderMiddle from "../components/headerMiddle.tsx";
import '../styles/toFollow.css'
import UserListed from "../components/userListed.tsx";
import {cacheReader} from "../state/authSlice.tsx";

const ToFollow = () => {
    const dispatch:AppDispatch = useDispatch();
    const navigate = useNavigate()
    const auth= useSelector((state:RootState)=> state.auth)
    const profile = useSelector((state: RootState)=> state.profile)
    useEffect(() => {
        const localId: string | null = localStorage.getItem("id")
        dispatch(cacheReader({
            id: localId,
            auth: true
        }))
        if(!auth.isLoading){
            if(!auth.auth){
                navigate('/')
            }
        }
        if(localId){
            dispatch(getUser({id: localId}))
        }
    }, []);
    useEffect(() => {
        dispatch(getAllUsers())

    }, []);
    return (
        <>
            <main>
                <Nav />
                <div className="feed-container">
                    <div className="to-follow-header">
                        <HeaderMiddle headerText={"Seguir"} />
                    </div>
                    <div className="follow-header">
                       <p className="follow-header-text cursor-pointer">A quien seguir</p>
                    </div>
                    <section className="to-follow-content">
                        <h3>Sugeridos para ti</h3>
                        {profile.allUsers?.map(item => <UserListed key={item._id} item={item} />)}
                    </section>
                </div>
            </main>
        </>
    )
}

export default ToFollow;