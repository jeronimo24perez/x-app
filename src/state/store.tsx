import {configureStore} from "@reduxjs/toolkit";
import AuthReducer from "./authSlice.tsx";
import UserReducer from "./userSlice.ts";
import PostReducer from "./postSlice.tsx";
import LikeReducer from "./likesSlice.tsx"
export const store = configureStore({
    reducer: {auth: AuthReducer, profile: UserReducer, posts: PostReducer, likes: LikeReducer}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;