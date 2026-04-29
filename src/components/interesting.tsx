import {FaSearch} from "react-icons/fa";
import type User from "../models/user.ts";
import SearchList from "./searchList.tsx";
import {type ChangeEvent, memo, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../state/store.tsx";
import {clearSearch, searchAll} from "../state/searchSlice.tsx";
import UserListed from "./userListed.tsx";
import type Post from "../models/post.ts";
import PostSidebar from "./postSidebar.tsx";

const Interesting = ({posts}:{posts: Post[]}) => {
    const dispatch:AppDispatch = useDispatch()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { users, loading } = useSelector((state: RootState) => state.search)
    const [allUser, setAllUser ] = useState<User[]>([])
    const hasFetched = useRef(false)
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value
        if (q.trim() === "") {
            dispatch(clearSearch())
            return
        }
        dispatch(searchAll(q))
    }
    useEffect(() => {

        if (hasFetched.current) return // ✅ Si ya fetcheó, no vuelve a hacerlo
        hasFetched.current = true
        fetch('https://x-backend-ruddy.vercel.app/users').then(r => r.json()).then(data => {
                setAllUser(data)
            }
        )
    },[])
    return(
        <>
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
            <div className="relevant-people">
                <h4 className="ml-1">A quien seguir</h4>
                {allUser.slice(0, 2).map(item => <UserListed item={item} key={item._id} /> )}
            </div>
            <div className="happening">
                {posts.slice(1, 5).map(item => <PostSidebar text={item.text} key={item._id} /> )}
            </div>
            <footer className="text-grey fw-small mt-5">
                Terms of Service
                |
                Privacy Policy
                |
                Cookie Policy
                |
                Accessibility
                |
                Ads info
                |

                More
                © 2026 X Corp.
            </footer>
        </>
    )
}

export default memo(Interesting) ;