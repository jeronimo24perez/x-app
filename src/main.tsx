import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {Provider} from 'react-redux'
import {store} from "./state/store.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {BrowserRouter} from "react-router";

const clientID:string = "1071419571458-upqdg48e5h33gc2ejdeblrv6orm4iqn7.apps.googleusercontent.com"
ReactDOM.createRoot(document.getElementById('root')!).render(

    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <GoogleOAuthProvider clientId={clientID}>
                    <App />
                </GoogleOAuthProvider>
            </Provider>
        </BrowserRouter>

    </React.StrictMode>,
)