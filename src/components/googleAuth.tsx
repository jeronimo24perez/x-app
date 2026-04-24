import {GoogleLogin} from "@react-oauth/google";
import {useNavigate} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {googleOAuth} from "../state/authSlice.tsx";
import type {AppDispatch, RootState} from "../state/store.tsx";
import {useEffect} from "react";

const GoogleAuth = () => {
    const state = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        if(state.id){
            navigate('/feed')
        }
    }, [state, navigate])

    return (
        <GoogleLogin width={300} shape={"circle"} onSuccess={(crd)=>{
           dispatch(googleOAuth(crd))
        }}  onError={()=> console.log('err')} />


    )
}

export default GoogleAuth