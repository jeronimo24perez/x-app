import Nav from "../features/nav.tsx"
import { FaSearch } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { searchAll, clearSearch } from "../state/searchSlice.tsx"
import type {AppDispatch, RootState} from "../state/store.tsx"
import '../styles/explore.css'
import type User from "../models/user.ts";
import {type ChangeEvent, useEffect, useState} from "react";
import SearchList from "../components/searchList.tsx";
import {cacheReader} from "../state/authSlice.tsx";
import {getAllUsers, getUser} from "../state/userSlice.ts";
import {useNavigate} from "react-router";
import UserListed from "../components/userListed.tsx";
import PostComponent from "../components/post.tsx";
import {explore} from "../state/postSlice.tsx";
import Interesting from "../components/interesting.tsx";

const Explore = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { users, loading } = useSelector((state: RootState) => state.search)
    const auth = useSelector((state:RootState)=> state.auth)
    const postReader = useSelector((state: RootState) => state.posts);
    const profile = useSelector((state: RootState) => state.profile)

    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value
        if (q.trim() === "") {
            dispatch(clearSearch())
            return
        }
        dispatch(searchAll(q))
    }
    useEffect(() => {
        dispatch(getAllUsers())
        dispatch(explore());

    }, []);
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

        }
    }, [])
    return (
        <main>
            <Nav />
            <div className="feed-container explore-feed">
                <div className="explore-header">
                    <div className="search search-explore">
                        <FaSearch />
                        <input type="search" placeholder="Buscar" onChange={handleSearch} onFocus={()=>{
                            setIsOpen(true)
                        }} onBlur={(e)=>{
                            if (!e.relatedTarget) {
                                setIsOpen(false)
                            }
                        }} />
                    </div>

                    {isOpen? <div className="explore-container cursor-pointer" onBlur={()=>{
                        setIsOpen(false)
                    }} tabIndex={-1}>
                        {loading && <p>Buscando...</p>}

                        {users.length > 0 && (
                            <div className="users-container" onClick={(e) =>{
                                e.stopPropagation()
                                e.preventDefault()
                                setIsOpen(true)
                            }}>
                                {users.map((user:User) => (
                                    <SearchList item={user} />
                                ))}
                            </div>
                        )}


                    </div>: <></>}
                </div>

                <h3> A quien seguir</h3>
                <div className="users-explore">
                    {profile.allUsers?.map(item => <UserListed key={item._id} item={item} />)}

                </div>
                <h3>Posts para ti</h3>
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
            <div className="third">
                <Interesting posts={postReader.feed} />

            </div>
        </main>
    )
}

export default Explore