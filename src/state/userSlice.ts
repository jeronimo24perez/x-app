import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type User from '../models/user.ts'


interface initialState{
    user: User;
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
const UserSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
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
    }
})


export default UserSlice.reducer;
