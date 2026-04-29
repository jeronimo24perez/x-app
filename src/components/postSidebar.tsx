import type Post from "../models/post.ts";

const PostSidebar = (props: Post) => {
    return(
        <>
            <div  className="post-container" id={props._id}>
                <h4>{props.text}</h4>

            </div>
        </>
    )
}

export default PostSidebar;