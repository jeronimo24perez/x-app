import {useEffect, useState} from "react";
import {Link, useParams} from "react-router";
import type Post from "../models/post.ts";
import Spinner from "../components/spinner.tsx";
import Nav from "../features/nav.tsx";
import '../styles/postPage.css'
import PostComponent from "../components/post.tsx";
import {IoArrowBackOutline} from "react-icons/io5";
const PostPage = ()=>{
    const {id} = useParams()
    interface postSaver extends Post {
        userId: string
    }
    const [post, setPost] = useState<postSaver>({
        autor: "",
        date:"",
        email:"",
        img:"",
        likes: 0,
        text:"",
        userId :"",
        _id:"",
    });
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        async function post(){
            const data = await fetch(`https://x-backend-ruddy.vercel.app/post/${id}`)
            const result = await data.json()

            setPost(result);
            setLoading(false);
            return result
        }

        post()
    }, [id]);
    return(
        loading?
            <Spinner />:
        <>
            <main className={"main-post-page"}>
                <Nav />

                <div className="feed-container">
                    <div className="header go-back ">
                        <Link className="p-1 " to='/feed'>
                            <IoArrowBackOutline className="arrow-icon" />
                        </Link>
                        <h3>Post</h3>
                    </div>

                <PostComponent text={post.text} date={post.date} _id={id} likes={post.likes} key={id} email={post.email} autor={post.autor} />
                </div>
                <div className="third">

                </div>
            </main>
        </>
    )
}

export default PostPage;