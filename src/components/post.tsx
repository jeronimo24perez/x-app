import {RxAvatar} from "react-icons/rx";
import type Post from '../models/post.ts'
const PostComponent = (props: Post)=>{
    return(
        <>
            <div className="post-container">
                <div className="post-user">
                    <div className="post-avatar">
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

                </div>
            </div>
        </>)

}

export default PostComponent;