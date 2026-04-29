import {RxAvatar} from "react-icons/rx";
import type Post from '../models/post.ts'
import {FaRegComment} from "react-icons/fa";
import {FaHeart, FaRegBookmark, FaRetweet} from "react-icons/fa6";
import {IoMdHeartEmpty} from "react-icons/io";
import {RiShare2Line} from "react-icons/ri";
import type {AppDispatch, RootState} from "../state/store.tsx";
import {useDispatch, useSelector} from "react-redux";
import {deleteLike,  makeLike} from "../state/postSlice.tsx";
import {userLikes} from "../state/likesSlice.tsx";
import {Link, useNavigate, useParams} from "react-router";

const PostComponent = (props: Post)=>{
    const {id} = useParams()
    const auth = useSelector((state: RootState) => state.auth);
    const likes = useSelector((state:RootState) => state.likes)
    const post = useSelector((state:RootState)=> state.posts)
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate()
    const isLiked:boolean = likes.likes.includes(props._id || "");



    return(
        <>
            <div  className="post-container" id={props._id}>
                {id? <>
                    <div className="post-user">
                        <div className="post-avatar" onClick={()=>{
                            const finder = post.feed.find(e => e.userId === auth.id)
                            if(finder){
                                navigate(`/profile/${props._id}`)
                            }else{
                                navigate(`/${props.userId}`)
                            }
                        }}>
                            <div className="avatar">
                                <RxAvatar className="avatar-icon" />
                            </div>
                        </div>
                        <div className="post-username fw-bold" >
                            {props.autor}
                        </div>
                        <div className="post-email fw-small text-grey">
                            @{props?.email?.split('@')[0]
                        }
                        </div>
                        <div className="post-date fw-small text-grey">
                            {props.date}
                        </div>
                    </div>

                    <div className="post-text">
                        <div></div>
                        <p>{props.text}</p>
                    </div>

                    <div className="post-buttons">
                    <div></div>
                    <FaRegComment className="post-button-icon" />
                    <FaRetweet className="post-button-icon green-effect" />
                    <div className="likes-container flex">
                {   isLiked  ?<>
                    <FaHeart color={"red"} onClick={()=>{
                dispatch(deleteLike({
                    userId: auth.id || "" ,
                    postId: props._id || ""
                })).unwrap().then(()=>{
                    if(auth.id) {
                        dispatch(userLikes(auth.id))
                    }
                })

            }} /><p className={"text-grey fw-small" }>
            {props.likes}</p> </>
:
    <>
        <IoMdHeartEmpty className="post-button-icon red-effect"  onClick={()=>{
            dispatch(makeLike({
                userId: auth.id || "" ,
                postId: props._id || ""
            })).unwrap().then(()=>{
                if(auth.id) {
                    dispatch(userLikes(auth.id))
                }
            })

        }} /><p className={"text-grey fw-small" }>
        {props.likes}</p>
    </>
}
</div>
    <div></div>
    <FaRegBookmark className="post-button-icon" />
    <RiShare2Line className="post-button-icon " />
</div></> :<>
                    <Link to={`/post/${props._id}`}>
                    <div className="post-user">
                    <div className="post-avatar" onClick={(e)=>{
                        e.stopPropagation()
                        e.preventDefault()
                        const finder = post.feed.find(e => e._id === props._id)
                        if(finder?.userId === auth.id){
                                navigate(`/profile/${finder?.userId}`)
                        }else {
                            navigate(`/${finder?.userId}`)
                        }

                    }}>
                        <div className="avatar">
                            <RxAvatar className="avatar-icon" />
                        </div>
                    </div>
                    <div className="post-username fw-bold" >
                        {props.autor}
                    </div>
                    <div className="post-email fw-small text-grey">
                       @{props?.email?.split('@')[0]
                    }
                    </div>
                    <div className="post-date fw-small text-grey">
                        {props.date}
                    </div>
                </div>

                <div className="post-text">
                    <div></div>
                    <p>{props.text}</p>
                </div>
                    </Link>

                <div className="post-buttons">
                    <div></div>
                    <FaRegComment className="post-button-icon" />
                    <FaRetweet className="post-button-icon green-effect" />
                    <div className="likes-container flex">
                        {   isLiked  ?<>
                                <FaHeart color={"red"} onClick={()=>{
                                    dispatch(deleteLike({
                                        userId: auth.id || "" ,
                                        postId: props._id || ""
                                    })).unwrap().then(()=>{
                                        if(auth.id) {
                                            dispatch(userLikes(auth.id))
                                        }
                                    })

                                }} /><p className={"text-grey fw-small" }>
                                {props.likes}</p> </>
                            :
                            <>
                                <IoMdHeartEmpty className="post-button-icon red-effect"  onClick={()=>{
                                    dispatch(makeLike({
                                        userId: auth.id || "" ,
                                        postId: props._id || ""
                                    })).unwrap().then(()=>{
                                        if(auth.id) {
                                            dispatch(userLikes(auth.id))
                                        }
                                    })

                                }} /><p className={"text-grey fw-small" }>
                                {props.likes}</p>
                            </>
                        }
                    </div>
                    <div></div>
                    <FaRegBookmark className="post-button-icon" />
                    <RiShare2Line className="post-button-icon " />
                </div>
                    </>
                }
            </div>
        </>)

}

export default PostComponent;