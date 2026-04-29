import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type Post from "../models/post.ts";
interface comment{
    comment: Post[]
}
const initialState: comment = {
    comment:[ {
        text: "",
        _id:"",
        email:"",
        autor:"",
        likes:0,
        img:"",
        date:"",
    }]

}

export const getPostComment = createAsyncThunk(
    "comments/getPostComment",
    async(arg: string)=>{
        const comments = await fetch(`https://x-backend-ruddy.vercel.app/posts/${arg}/comments`)
        return await comments.json()
    }
)
interface postComment extends Post{
    userId:string;
    id: string
}
export const PostComment = createAsyncThunk(
    "comments/postComment",
    async (arg:postComment)=>{
        const hoy = new Date()
        const format = new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(hoy).replace(/\//g, '-');
        const comment = await fetch(`https://x-backend-ruddy.vercel.app/comment/${arg.id}`, {
            method: "POST",
            headers: {
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": arg.userId,
                "postId": arg.id,
                "autor": arg.autor,
                "email": arg.email,
                "text": arg.text,
                "date": format,
                "img": ""
            })
        })
        return await comment.json()
    }
)

const CommentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getPostComment.fulfilled, (state, action)=>{
            state.comment = action.payload
        })
        builder.addCase(PostComment.fulfilled, (state, action)=>{
            const newComment: Post = action.payload.comment

            state.comment.push(newComment)
        })
    }
})

export default CommentSlice.reducer;