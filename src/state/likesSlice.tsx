import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

interface initialState{
    likes: string[]
}
interface expected{
    postId: string
}
export const userLikes = createAsyncThunk(
    "likes/userLikes",
    async(arg: string)=>{
        const likes = await fetch(`https://x-backend-ruddy.vercel.app/user/likes/${arg}`)
        return await likes.json()
    }
)
const initialState: initialState = {likes:[""]}
const Like = createSlice({
    name: "likes",
    initialState,
    reducers:{},
    extraReducers: builder => {
        builder.addCase(userLikes.fulfilled, (state, action)=>{
            if(action.payload.detail){
                return
            }
            const array: string[] = []

            action.payload.map((e:expected) =>{
                array.push(e.postId)
            })
            state.likes = array
        })
    }
})

export default Like.reducer;
