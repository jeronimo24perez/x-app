import {configureStore} from "@reduxjs/toolkit";
import AuthReducer from "./authSlice.tsx";
import UserReducer from "./userSlice.ts";
import PostReducer from "./postSlice.tsx";
import LikeReducer from "./likesSlice.tsx"
import CommentReducer from "./commentSlice.tsx";
import FollowReducer from './follows.tsx'
import searchReducer from './searchSlice.tsx'

export const store = configureStore({
    reducer: {
        auth: AuthReducer,
        profile: UserReducer,
        posts: PostReducer,
        likes: LikeReducer,
        comments: CommentReducer,
        follows: FollowReducer,
        search: searchReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;