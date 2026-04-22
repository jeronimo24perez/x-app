import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ================== TYPES ==================

interface User {
    bio: string;
    date: string;
    email: string;
    followers: number;
    follows: number;
    location: string;
    password: string;
    username: string;
    website: string;
}

// 🔥 respuesta correcta: error o success
type RegisterResponse =
    | { detail: string }
    | {
    id?: string;
    user: User };

type LoginResponse =
    | { detail: string }
    | {
    id?: string;
    user: User };

interface InitialState {
    id?: string,
    registed?: boolean;
    auth: boolean;
    step: number;
    detail?: string | null;
    user: User | null; // ✅ clave
}

interface BodyReq {
    email: string;
    password: string;
    username: string;
    date: string;
}

interface LoginReq {
    email: string;
    password: string;
}

// ================== INITIAL STATE ==================

const initialState: InitialState = {
    auth: false,
    step: 0,
    user: null, // ✅ ya no rompe
    detail: null,
};

// ================== THUNKS ==================

export const register = createAsyncThunk<RegisterResponse, BodyReq>(
    "auth/register",
    async (arg) => {
        const post = await fetch("https://x-backend-ruddy.vercel.app/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: arg.email,
                password: arg.password,
                username: arg.username,
                date: arg.date,
                bio: "",
                follows: 0,
                followers: 0,
                website: "",
                location: "",
            }),
        });

        return await post.json(); // ✅ importante
    }
);

export const loginStepOne = createAsyncThunk<LoginResponse, LoginReq>(
    "auth/loginStepOne",
    async (arg: LoginReq) => {
        const post = await fetch("https://x-backend-ruddy.vercel.app/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: arg.email,
                password: arg.password,
            }),
        });

        return await post.json();
    }
);

// ================== SLICE ==================

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // REGISTER
            .addCase(register.fulfilled, (state, action) => {
                if ("detail" in action.payload) {
                    state.user = null;
                    state.detail = action.payload.detail;
                    state.registed = false;
                    return;
                }

                state.id = action.payload.id;
                state.auth = true;
                state.registed = true;
                state.detail = null;
            })

            // LOGIN
            .addCase(loginStepOne.fulfilled, (state, action) => {
                if ("detail" in action.payload) {
                    state.detail = action.payload.detail;
                    state.auth = false;
                    return;
                }
                state.id = action.payload.id;
                state.auth = true;
                state.detail = null;

            });
    },
});

export default AuthSlice.reducer;
