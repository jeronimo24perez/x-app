import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {CredentialResponse} from "@react-oauth/google";
import Swal from "sweetalert2";
import type User from '../models/user.ts'
// ================== TYPES ==================

interface userPassword extends User{
    password: string;

}


// 🔥 respuesta correcta: error o success
type RegisterResponse =
    | { detail: string }
    | {
    id?: string;
    user: userPassword};

type LoginResponse =
    | { detail: string }
    | {
    id?: string;
    user: userPassword };

interface InitialState {
    id?: string,
    registed?: boolean;
    auth: boolean;
    step: number;
    detail?: string | null;
    user: userPassword | null;
    isLoading: boolean;
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
    isLoading: false
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
export const googleOAuth = createAsyncThunk(
    "auth/googleOAuth",
    async (arg: CredentialResponse)=>{
        const data = await fetch('https://x-backend-ruddy.vercel.app/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: arg.credential
            })
        })
        return await data.json();
    }
)
// ================== SLICE ==================

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        cacheReader: (state, action) => {
            state.auth = action.payload.auth;
            state.id = action.payload.id;
        }
    },
    extraReducers: (builder) => {
        builder
            // REGISTER
            .addCase(register.fulfilled, (state, action) => {
                if ("detail" in action.payload) {
                    state.user = null;
                    state.detail = action.payload.detail;
                    state.registed = false;
                    state.isLoading = false
                    return;
                }

                state.id = action.payload.id;
                state.auth = true;
                state.registed = true;
                state.detail = null;
                state.isLoading = false;

            })
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            // LOGIN
            .addCase(loginStepOne.fulfilled, (state, action) => {
                if ("detail" in action.payload) {
                    state.detail = action.payload.detail;
                    state.auth = false;
                    if(!state.auth){
                        Swal.fire({
                            title: 'Error al logearse',
                            text: 'Email o contraseña incorrectos',
                            icon: 'warning',
                            confirmButtonText: 'Aceptar'
                        })
                    }
                    state.isLoading = false
                    return;
                }
                state.id = action.payload.id;
                state.auth = true;
                state.detail = null;
                state.isLoading = false

            })
            .addCase(loginStepOne.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(googleOAuth.fulfilled, (state, action)=>{
                state.id = action.payload.id
                state.auth = true;
                state.detail = null
                state.isLoading = false

                localStorage.setItem('id', action.payload.id)
            } )
            .addCase(googleOAuth.pending, (state)=>{
                state.isLoading = true
            })
    },

});

export const {cacheReader} = AuthSlice.actions;
export default AuthSlice.reducer;