import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
interface post{
    [x: string]: string;
    _id: string;
    autor: string,
    likes: number,
    text: string,
    img: string,
    date: string
}
interface initialState {
    feed: post[]
    isLoading: boolean
}

const initialState: initialState = {
    feed: [{
        _id: "",
        autor: "",
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
    }

})

export default PostSlice.reducer;