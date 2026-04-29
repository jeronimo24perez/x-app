import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
export interface follow{
    _id?: string,
    followerId: string,
    followedId: string,
}
interface initialState{
    follows: follow[]
    followeds: follow[]
}
const initialState: initialState = {
    follows: [],
    followeds: []
}

export const followAction = createAsyncThunk(
    "follows/followAction",
    async (arg:follow)=>{
        const follow = await fetch(`https://x-backend-ruddy.vercel.app/follow/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                followerId: arg.followerId,
                followedId: arg.followedId
            })
        })
        return await follow.json()

    }
)
export const fetchUsersFollowed = createAsyncThunk(
    "follows/fetchUsersFollowed",
    async (arg: string[]) => {
        const promises = arg.map(async (id) => {
            const res = await fetch(`https://x-backend-ruddy.vercel.app/following/${id}`)
            return await res.json()
        })
        return await Promise.all(promises);
    }
)
export const unfollowAction = createAsyncThunk(
    "follows/unfollowAction",
    async (arg:follow)=>{
        const follow = await fetch(`https://x-backend-ruddy.vercel.app/follow/`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                followerId: arg.followerId,
                followedId: arg.followedId
            })
        })
        return await follow.json()
    })
    
export const getMyFollows = createAsyncThunk(
    "follows/getMyFollows",
    async(arg:string)=>{
        const follows = await fetch(`https://x-backend-ruddy.vercel.app/following/${arg}`)
        return await follows.json()
    }
)
export const getMyFollowers = createAsyncThunk(
    "follows/getMyFollowers",
    async(arg:string)=>{
        const follows = await fetch(`https://x-backend-ruddy.vercel.app/followers/${arg}`)
        return await follows.json()
    }
)
const Follows = createSlice({
    name: "follows",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(followAction.fulfilled, (state, action)=>{
            if(!action.payload.detail){
                state.followeds.push(action.payload)
            }
        })
        .addCase(getMyFollows.fulfilled, (state, action)=>{
            if(!action.payload.detail){
                state.followeds = action.payload.find
            }
        })
        .addCase(getMyFollowers.fulfilled, (state, action)=>{
            if(!action.payload.detail){
                state.follows = action.payload.find
            }
        })
        .addCase(unfollowAction.fulfilled, (state, action)=>{
            if(!action.payload.detail){
                console.log(action.payload);
                state.follows = state.follows.filter(e => !(e.followerId === action.payload.followerId && e.followedId === action.payload.followedId))
                state.followeds = state.followeds.filter(e => !(e.followerId === action.payload.followerId && e.followedId === action.payload.followedId))
            }
    })
    }
})

export default Follows.reducer;