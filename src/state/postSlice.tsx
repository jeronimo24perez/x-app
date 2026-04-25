import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type Post from '../models/post.ts'
interface initialState {
    feed: Post[]
    isLoading: boolean
}
interface likePetition{
    userId: string
    postId: string
}
const initialState: initialState = {
    feed: [{
        _id: "",
        autor: "",
        email: "",
        likes: 0,
        text: "",
        img: "",
        date: ""
    }],
    isLoading: false,
}
export const getFeed = createAsyncThunk(
    "posts/getFeed",
    async (arg: string | undefined)=>{
        const feed = await fetch(`https://x-backend-ruddy.vercel.app/feed/${arg}`)
        return await feed.json()
    }
)
export const explore = createAsyncThunk(
    "posts/explore",
    async ()=>{
        const posts = await fetch(`https://x-backend-ruddy.vercel.app/posts/`)
        return await posts.json()
    }
)
export const createPost = createAsyncThunk(
    "posts/createPost",
    async (arg: Post)=>{
        const hoy = new Date()
        const format = new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(hoy).replace(/\//g, '-');
        const post = await fetch(`https://x-backend-ruddy.vercel.app/posts`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "userId": arg._id ,
                    "text": arg.text,
                    "likes": 0,
                    "img": "",
                    "date": format
                })
            })
        return await post.json()
    }
)
export const makeLike = createAsyncThunk(
    "posts/makeLike",
    async (arg:likePetition)=>{
        console.log(arg)

        const like = await fetch('https://x-backend-ruddy.vercel.app/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": arg.userId ,
                "postId": arg.postId
            })
        })
        return await like.json()
    }
)
export const deleteLike = createAsyncThunk(
    "posts/deleteLike",
    async (arg: likePetition)=>{
        const like = await fetch('https://x-backend-ruddy.vercel.app/like', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": arg.userId ,
                "postId": arg.postId
            })
        })
        return await like.json()
    }
)
const PostSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getFeed.fulfilled, (state)=>{
                 state.isLoading = false
        })
            .addCase(getFeed.pending, (state)=>{
                state.isLoading = true
            })
        .addCase(explore.fulfilled,(state, action)=>{
            state.feed = action.payload
            state.isLoading = false
        })
            .addCase(explore.pending,(state)=>{
                state.isLoading = true
        })
            .addCase(createPost.fulfilled, (state)=>{
                state.isLoading = false
            })
            .addCase(createPost.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(makeLike.fulfilled, (state, action)=>{
                console.log(action.payload)
                const finder = state.feed.find(e => e._id === action.payload)
                if(finder){
                    if(typeof finder.likes === 'number'){
                        console.log(finder.likes)
                        finder.likes += 1
                    }
                }
            })
            .addCase(deleteLike.fulfilled, (state, action)=>{
                const finder = state.feed.find(e => e._id === action.payload)
                if(finder){
                    if(finder.likes){
                        finder.likes -= 1;
                    }
                }
            })
    }

})

export default PostSlice.reducer;