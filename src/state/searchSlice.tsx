import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type User from "../models/user.ts";
import type Post from "../models/post.ts";

export const searchAll = createAsyncThunk(
    "search/searchAll",
    async (q: string) => {
        const response = await fetch(`https://x-backend-ruddy.vercel.app/search?q=${encodeURIComponent(q)}`)
        return await response.json()
    }
)
interface initialState {
    users: User[]
    posts: Post[]
    loading: boolean
    error: string | null
}
const initialState:initialState = {
    users: [],
    posts: [],
    loading: false,
    error: null
}
const SearchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearSearch: (state) => {
            state.users = []
            state.posts = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchAll.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(searchAll.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload.users
                state.posts = action.payload.posts
            })
            .addCase(searchAll.rejected, (state) => {
                state.loading = false
                state.error = "Error al buscar"
            })
    }
})

export const { clearSearch } = SearchSlice.actions
export default SearchSlice.reducer