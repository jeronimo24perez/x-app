    import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type User from '../models/user.ts'
import type Post from "../models/post.ts";


interface initialState{
    user: User;
    posts?: Post[]
    allUsers?: User[]
    isLoading: boolean;
}
const initialState: initialState = {
    user: {
        username: "",
        email: "",
        date: "",
        bio: "",
        follows: 0,
        followers: 0,
        website:"",
        location:""
    },
    posts: [],
    isLoading: false,
}
interface getUser{
    id: string | undefined
}
export const getUser = createAsyncThunk(
    "users/getUser",
    async (arg:getUser)=>{
        const user = await fetch(`https://x-backend-ruddy.vercel.app/user/${arg.id}`)
        return await user.json()
    }
)
export const userPosts = createAsyncThunk(
    "users/userPosts",
    async (arg: string)=>{
        const posts = await fetch(`https://x-backend-ruddy.vercel.app/user/posts/${arg}`)
        return await posts.json()
    }
)

export const getAllUsers = createAsyncThunk(
    "users/getAllUsers",
    async ()=>{
        const users = await fetch(`https://x-backend-ruddy.vercel.app/users`)
        return await users.json()
    }
)
export const editUser = createAsyncThunk(
    "user/editUser",
    async (arg:User)=>{
        const user = await fetch(`https://x-backend-ruddy.vercel.app/user/${arg._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: arg.username,
                bio: arg.bio,
                website: arg.website,
                location: arg.location

            })    }
            )
    return user.json()
    })


const UserSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = initialState.user
            localStorage.removeItem("id")
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(getUser.fulfilled, (state, action)=>{
            const user:User = action.payload.user
            if(user){
                state.user = {
                    username: user.username,
                    email: user.email,
                    date: user.date,
                    bio: user.bio,
                    follows: user.follows,
                    followers: user.followers,
                    website: user.website,
                    location: user.location,
                }
                state.isLoading = false
            }
        })
            .addCase(getUser.pending,(state)=>{
                state.isLoading = true
            })
            .addCase(userPosts.fulfilled, (state, action)=>{
                state.posts = action.payload
                state.isLoading = false
            })
            .addCase(userPosts.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getAllUsers.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getAllUsers.fulfilled, (state, action)=>{
                state.allUsers = action.payload
                state.isLoading = false;
            })
            .addCase(editUser.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(editUser.fulfilled, (state, action)=>{
                state.user = { ...state.user, ...action.payload.user }
                state.isLoading = false
            })
    }
})

export const {logout} = UserSlice.actions;
export default UserSlice.reducer;
